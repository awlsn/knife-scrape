import mongoose from "mongoose";
import cloudinary from "cloudinary";

import { checkCKTG } from "./sites/cktg.js";
import { scrapeShopifySite, saveItem } from "./sites/shopify.js";


async function main () {
  
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  await mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = mongoose.connection;
  console.log('Connected?',mongoose.connection.readyState);
  
  scrapeShopifySite("https://bernalcutlery.com/");
  scrapeShopifySite("https://japanesechefsknife.com/");
  scrapeShopifySite("https://knifewear.com/");
  scrapeShopifySite("https://carbonknifeco.com/");
  scrapeShopifySite("https://www.japaneseknifeimports.com/");
  scrapeShopifySite("https://knivesandstones.us/");
}

main();