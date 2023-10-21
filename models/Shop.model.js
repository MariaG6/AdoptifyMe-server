const { Schema, model } = require("mongoose");

const shopSchema = new Schema(
  {
    shopName: {
      type: String,
      required: [true, "Shop name is required."],
    },
    website: String,
    location: String,
    shopLogo: {
      type: String,
      default:
        "https://img.freepik.com/free-photo/image-icon-front-side-white-background_187299-40166.jpg?w=740&t=st=1697111573~exp=1697112173~hmac=e548437457784e86b30facfb1354d67713af48795a5e947c031295e863870727",
    },
    pets: [{ type: Schema.Types.ObjectId, ref: "Pet" }],
    owner: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Shop = model("Shop", shopSchema);

module.exports = Shop;
