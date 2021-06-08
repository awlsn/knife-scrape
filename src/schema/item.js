import mongoose from "mongoose";
const { Schema } = mongoose;

const itemSchema = new Schema({
  name: String, // String is shorthand for {type: String}
  url: String,
  store: String,
  storeId: Number,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  quantity: Number,
  price: Number,
  desc: String,
  images: [],
  meta: {
    votes: Number,
    favs: Number
  }
});
