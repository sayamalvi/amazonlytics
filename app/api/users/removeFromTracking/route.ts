import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import Product from "@/lib/models/product.model";
import { getProductById } from "@/lib/actions";
connectToDB();

export async function POST(request: NextRequest) {
  try {
    const emailcookie = request.cookies.get("email");
    const email = String(emailcookie?.value);

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const reqBody = await request.json();
    const { productID } = reqBody;
    const product = await Product.findById(productID);
    if (!product)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    const updatedArray = user.trackedProducts.filter(
      (product: any) => product._id.toString() !== productID
    );

    user.trackedProducts = [...updatedArray];
    await user.save();
    return NextResponse.json(
      { message: "Removed from tracked products" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
