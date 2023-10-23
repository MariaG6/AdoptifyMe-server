const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  fullName: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Invalid email address",
    ],
  },
  hashedPassword: {
    type: String,
    required: [true, "Password is required."],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  phoneNumber: {
    type: String,
  },
  profilePicture: {
    type: String,
    default:
      "https://img.freepik.com/free-photo/user-profile-icon-front-side-with-white-background_187299-40010.jpg?w=740&t=st=1697111034~exp=1697111634~hmac=e362fd34e7a54368b8dc48bd44e02de9b090f35456c96e7d03f009737e7f8ac9",
  },
  address: { street: String, postalCode: String, country: String },
  adoptedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  reportedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  shops: [{ type: Schema.Types.ObjectId, ref: "Shop" }],
});

const User = model("User", userSchema);

module.exports = User;
