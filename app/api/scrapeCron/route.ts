import { scrapeAmazonProduct } from "@/lib/scraper";
import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import Product from "@/lib/models/product.model";

export const dynamic = 'force-dynamic'

connectToDB();
export async function GET() {
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
        const { trackedProducts, email } = user;
        if (trackedProducts.length === 0) continue;
        for (let i = 0; i < trackedProducts.length; i++) {
          const productObjId = trackedProducts[i];
          const productId = trackedProducts[i].toString();
          const product = await Product.findById(productId);
          const productURL = product.url;
          const scrapedProduct = await scrapeAmazonProduct(productURL);
          if (!scrapedProduct) retryScrape(productURL);
          else {
            console.log("Scraped product", scrapedProduct.currentPrice);
            await Product.updateOne(
              { _id: productObjId },
              {
                $push: {
                  priceHistory: {
                    price: scrapedProduct.currentPrice,
                    date: new Date(),
                  },
                },
              }
            );
          }
          const latestPrice =
            product.priceHistory[product.priceHistory.length - 1];
          const lastPrice =
            product.priceHistory[product.priceHistory.length - 2];

          if (latestPrice.price < lastPrice.price) {
            await notifyUser(user, product);
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
  cronJob();
  return NextResponse.json({ message: "Cron job finished" });
}
