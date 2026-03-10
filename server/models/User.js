import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Clerk userId

  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, required: true },

  // Profile data
  phone: String,
  college: String,
  course: String,
  branch: String,
  graduationYear: String,
  linkedin: String,
  github: String,

  resume: String,

  profileCompleted: {
    type: Boolean,
    default: false,
  },

  adminVerified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
