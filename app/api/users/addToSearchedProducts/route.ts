import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Product from "@/lib/models/product.model";
import { getProductById } from "@/lib/actions";
connectToDB();

export async function POST(request: NextRequest) {
  try {
    //This emailcookie will be of type RequestCookie so we have to convert it into string to use it in finding the user, else the query will throw an error
    const emailcookie = request.cookies.get("email");
    const email = String(emailcookie?.value);

    //Find User first
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    //Find product
    const reqBody = await request.json();
    const { productID } = reqBody;
    const product = await Product.findById(productID);
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    //Push the product into user's searchedProducts array and save it
    if (
      user.searchedProducts.some((product: any) => product._id.toString()) ===
      productID
    ) {
      return NextResponse.json(
        { message: "Product already exists" },
        { status: 200 }
      );
    } else {
      user.searchedProducts.push(product);
      await user.save();

      return NextResponse.json({ email }, { status: 200 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
