import { connectToDB } from "@/lib/mongoose";
import Product from "@/lib/models/product.model";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getLowestPrice, getHighestPrice, getAveragePrice } from "@/lib/utils";
export async function GET() {
  try {
    connectToDB();
    const products = await Product.find();
    if (!products) throw new Error("No products found");

    //1. Scrape latest product details and update db
    const updatedProduct = await Promise.all(
      products.map(async (currProduct) => {
        const scrapedProduct = await scrapeAmazonProduct(currProduct.url);
        if (!scrapedProduct) throw new Error("No product found");
        const updatedPriceHistory = [
          ...currProduct.priceHistory,
          { price: scrapedProduct.currentPrice },
        ];
        const product = {
          ...scrapedProduct,
          priceHistory: updatedPriceHistory,
          lowestPrice: getLowestPrice(updatedPriceHistory),
          highestPrice: getHighestPrice(updatedPriceHistory),
          averagePrice: getAveragePrice(updatedPriceHistory),
        };
        const updatedProduct = await Product.findOneAndUpdate(
          {
            url: scrapedProduct.url,
          },
          product
        );
        //2. check each product status and send email
        // const emailNotif = 
        
      })
    );
  } catch (error) {
    console.log(error);
  }
}
