const { Schema, model } = require("mongoose");

const petSchema = new Schema({
  typeOfAnimal: {
    type: String,
    enum: ["dog", "cat"],
    required: [true, "Type is required."],
  },
  shop: { type: Schema.Types.ObjectId, ref: "Shop" },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
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
    default: 'Unknown',
    required: [true, "Name is required."],
  },
  gender: {
    type: String,
    enum: ["male", "female", "unknown"],
    required: [true, "Gender is required."],
  },
  dateOfBirth: Date,
  profilePicture: {
    type: String,
    // add default img
  },
  images: [String],
  description: String,
  isAdopted: { type: Boolean, default: false },
  isReported: { type: Boolean, default: false },
}, { timestamps: true });

const Pet = model("Pet", petSchema);

module.exports = Pet;
