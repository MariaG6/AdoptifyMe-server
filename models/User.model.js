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
    match:[/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,'Invalid email address']
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
    // add default img
  },
  address: { street: String, postalCode: String, country: String },
  adoptedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  reportedPets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});

const User = model("User", userSchema);

module.exports = User;
