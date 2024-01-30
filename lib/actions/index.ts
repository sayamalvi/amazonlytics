"use server";
import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "../utils";
import User from "../models/user.model";
import { cookies } from "next/headers";

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
        { price: scrapedProduct.currentPrice, date: Date.now() },
      ];
      if (
        !existingProduct.priceHistory.includes(scrapedProduct.originalPrice)
      ) {
        updatedPriceHistory = [
          ...existingProduct.priceHistory,
          { price: scrapedProduct.originalPrice, date: Date.now() },
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
    saveToSearchedProducts(newProduct._id.toString());
    revalidatePath(`/products/${newProduct._id}`);
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
    const productExists = await User.find({
      productID: {
        " $in": user.searchedProducts,
      },
    });
    // const productExists = user.searchedProducts.find(
    //   (product: any) => product._id.toString() === productID
    // );

    if (Object.keys(productExists).length > 0) return;
    else {
      const newUser = await User.updateOne(
        {
          email,
        },
        {
          $push: {
            searchedProducts: productID,
          },
        }
      );
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
    const searchedProducts = user.searchedProducts.map((product: any) => {
      return product.toString();
    });
    const products = await Product.find({
      _id: { $in: searchedProducts },
    });
    return products
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
