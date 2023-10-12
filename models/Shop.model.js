const { Schema, model } = require("mongoose");

const shopSchema = new Schema({
  shopName: {
    type:String,
    required: [true, "Shop name is required."],
  },
  website: String,
  shopLogo: String,
  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
  owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const Shop = model("Shop", shopSchema);

module.exports = Shop;