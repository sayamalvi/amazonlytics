import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";

connectToDB();

export async function POST(request: NextRequest) {
  try {
    //This emailcookie will be of type RequestCookie so we have to convert it into string to use it in finding the user, else the query will throw an error
    const reqBody = await request.json();
    console.log(reqBody);
    const emailcookie = request.cookies.get("email");
    const email = String(emailcookie?.value);
    console.log(email);
    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    console.log(user);

    return NextResponse.json({ email }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
}
