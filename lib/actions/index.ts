"use server";
import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "../utils";
import User from "../models/user.model";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";

connectToDB();

export async function scrapeAndStore(productURL: string) {
  if (!productURL) {
    return;
  }
  try {
    const scrapedProduct = await scrapeAmazonProduct(productURL);
    if (!scrapedProduct) return;
    let product = scrapedProduct;
    const existingProduct = await Product.findOne({
      title: scrapedProduct.title,
    });
    if (existingProduct) {
      let updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
      if (
        !existingProduct.priceHistory.includes(scrapedProduct.originalPrice)
      ) {
        updatedPriceHistory = [
          ...existingProduct.priceHistory,
          { price: scrapedProduct.originalPrice },
        ];
      }
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      };
    }
    const newProduct = await Product.findOneAndUpdate(
      {
        url: scrapedProduct.url,
      },
      product,
      { new: true, upsert: true }
    );
    revalidatePath(`/products/${newProduct._id}`);
    saveToSearchedProducts(newProduct._id.toString());
  } catch (error: any) {
    throw new Error(`Failed to create/update product: :${error.message}`);
  }
}

export async function saveToSearchedProducts(productID: string) {
  try {
    const email = cookies().get("email")?.value;
    const user = await User.findOne({ email });
    if (!user) return;
    const product = await Product.findById(productID);
    if (!product) return;
    const productExists = user.searchedProducts.find(
      (product: any) => product._id.toString() === productID
    );
    if (productExists) return;
    else {
      user.searchedProducts.push(product);
      await user.save();
    }
  } catch (error) {
    console.log(error);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();
    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}
export async function getAllProducts() {
  try {
    connectToDB();
    const products = await Product.find();
    return products;
  } catch (error) {
    console.log(error);
  }
}
export async function getSearchedProducts() {
  try {
    connectToDB();
    const email = cookies().get("email")?.value;
    const user = await User.findOne({ email });
    if (!user) return null;
    const searchedProducts = user.searchedProducts;
    return searchedProducts;
  } catch (error) {
    console.log(error);
  }
}
export async function getSimilarProducts(productId: string) {
  try {
    connectToDB();
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) return null;
    const similarProducts = await Product.find({
      category: currentProduct.category,
    }).limit(3);
    return similarProducts;
  } catch (error) {
    console.log(error);
  }
}
export async function getUser() {
  try {
    connectToDB();
    const email = cookies().get("email")?.value;
    const user = await User.findOne({ email });
    return JSON.stringify(user);
  } catch (error) {
    console.log(error);
  }
}
async function notifyUser(user: any, product: any) {
  const email = user.email;
  return new Promise(() => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sayamalvi07@gmail.com",
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: "sayamalvi07@gmail.com",
      to: email,
      subject: "Price dropped !",
      text: `Price dropped for ${product.title} to ${
        product.priceHistory[product.priceHistory.length - 1].price
      }`,
    };
    transporter.sendMail(mailOptions);
  });
  
}
async function retryScrape(productURL: string) {
  const scrapedProduct = await scrapeAmazonProduct(productURL);
  if (scrapedProduct) return scrapedProduct;
  else {
    console.log("Retrying scraping..");
    retryScrape(productURL);
  }
}
async function cronJob() {
  try {
    const users = await User.find();
    for (const user of users) {
      const { trackedProducts } = user;
      if (trackedProducts.length === 0) continue;
      for (let i = 0; i < trackedProducts.length; i++) {
        const product = trackedProducts[i];
        const productId = product._id.toString();
        const productURL = product.url;

        const scrapedProduct = await scrapeAmazonProduct(productURL);
        if (!scrapedProduct) retryScrape(productURL);
        else {
          console.log("Scraped product", scrapedProduct.currentPrice);
          user.trackedProducts[i].priceHistory.push({
            price: scrapedProduct.currentPrice,
          });
        }

        const latestPrice =
          product.priceHistory[product.priceHistory.length - 1];
        const lastPrice = product.priceHistory[product.priceHistory.length - 2];
        if (latestPrice < lastPrice) {
          notifyUser(user, product);
        }
        if (product.priceHistory.length >= 20) {
          product.priceHistory.splice(0, 5);
          console.log("Deleted first 5 prices");
        }
      }
      await User.findOneAndUpdate(
        { _id: user._id },
        { trackedProducts: user.trackedProducts },
        { new: true }
      );
      console.log("Updated products for user", user.username);
    }
  } catch (error: any) {
    console.log(error.message);
  }
}

setInterval(cronJob, 1000 * 60 * 2);
