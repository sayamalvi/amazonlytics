import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  trackedProducts: { type: Array, default: [] },
  wishlist: { type: Array, default: [] },
  searchedProducts: { type: Array, default: [] },
});
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
