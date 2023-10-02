const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  typeOfAnimal: String,
  shopId: { type: Schema.Types.ObjectId, ref: "Shop" },
  ownerId: { type: Schema.Types.ObjectId, ref: "User" },
  breed: String,
  age: {
    type: String,
    enum: ["young", "adult", "senior"],
    required: [true, "Age is required."],
  },
  size: {
    type: String,
    enum: ["very small", "small", "medium", "big", "super big"],
    required: [true, "Size is required."],
  },
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Unknown"],
    required: [true, "Gender is required."],
  },
  dateOfBirth: Date,
  profilePicture: {
    type: String,
    // add default img
  },
  images: Array,
  description: String,
  isAdopted: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
});

const Pet = model("Pet", petSchema);

module.exports = Pet;
