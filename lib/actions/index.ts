"use server";
import { revalidatePath } from "next/cache";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import Product from "../models/product.model";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "../utils";
import User from "../models/user.model";
import axios from "axios";
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
    return newProduct._id.toString();
  } catch (error: any) {
    throw new Error(`Failed to create/update product: :${error.message}`);
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

async function cronJob() {
  try {
    const allProducts = await Product.find();
    if (!allProducts) return;
    for (const product of allProducts) {
      await scrapeAndStore(product.url);
      if (product.priceHistory.length === 20) {
        product.priceHistory.splice(0, 10);
        console.log("Deleted first 5 prices");
        await product.save();
      }
    }
    console.log("Tracking..");
  } catch (error) {
    console.log(error);
  }
}

// setInterval(cronJob, 1000 * 60 * 60 * 24);
