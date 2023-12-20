import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;
  try {
    //Load cheerio
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    //extract data
    const title = $("#productTitle").text().trim();
    const currentPrice = extractPrice($(".a-price-whole"));
    const originalPrice = extractPrice(
      $("span.a-price.a-text-price span.a-offscreen")
    );
    const outOfStock =
      $("#availability span").text().trim().toLowerCase() ===
      "currently unavailable";
    const img = $(".imgTagWrapper img").attr("src");
    const discount = $(".savingsPercentage").text().trim();
    const category = $(".a-link-normal.a-color-tertiary")
      .text()
      .trim()
      .split(" ")
      .pop();
    const reviewCount = $("#averageCustomerReviews #acrCustomerReviewText")
      .text()
      .trim()
      .split(" ")[0];
    const reviewRating = $("#averageCustomerReviews .a-size-base.a-color-base")
      .text()
      .trim()
      .split(" ")[0];
    const description = $("#productDescription span").text().trim();
    const detail = $("#detailBullets_feature_div").text().trim();
    const data = {
      url,
      title,
      originalPrice,
      currentPrice,
      lowestPrice: currentPrice,
      highestPrice: originalPrice,
      averagePrice: currentPrice,
      priceHistory: [],
      outOfStock,
      img,
      category,
      reviewRating,
      description,
      detail,
      reviewCount,
      discount,
    };
    return data;
  } catch (error: any) {
    throw new Error("Failed to scrape");
  }
}
