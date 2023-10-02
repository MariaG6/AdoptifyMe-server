const { Schema, model } = require("mongoose");

const shopSchema = new Schema({
  shopName: String,
  address: { street: String, postalCode: String, country: String },
  phoneNumber: String,
  website: String,
  shopLogo: String,
  pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
});

const Shop = model("Shop", shopSchema);

module.exports = Shop;
