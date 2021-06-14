import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String,
  siteName: String,
  siteUrl: String,
  productUrl: { type: String, unique: true },

  store: String,
  storeId: Number,
  storeCreatedAt: Date,
  storeUpdatedAt: Date,

  dateAdded: { type: Date, default: Date.now },

  quantity: Number,
  price: Number,
  desc: String,
  image: {},
  images: [],
  tags: String,

  hidden: Boolean,
  comments: [{ body: String, date: Date }],
  meta: {
    votes: Number,
    favs: Number
  }
});

export const Item = mongoose.model("Item", itemSchema);
