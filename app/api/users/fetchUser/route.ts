import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    console.log(request);
    const reqBody = await request.json();
    const { email } = reqBody;
    const user = await User.findOne({ email });
    const sentUser = {
      id: user._id,
      username: user.username,
      email: user.email,
      searchedProducts: user.searchedProducts,
      trackedProducts: user.trackedProducts,
      wishlist: user.wishlist,
    };
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    return NextResponse.json(sentUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const emailcookie = request.cookies.get("email");
    const email = String(emailcookie?.value);
    return NextResponse.json({ email }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: 404 });
  }
}
