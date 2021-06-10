import mongoose from "mongoose";
import cloudinary from "cloudinary";

import { checkCKTG } from "./sites/cktg.js";
import { scrapeShopifySite, saveItem } from "./sites/shopify.js";

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`we're connected!`);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUDNAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

saveItem('');