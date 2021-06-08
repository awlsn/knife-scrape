import http from "http";
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

// Need to store historical data?

/*

each site is its own js file
for now just write to json?

create a raw copy, then migrate it into a standardized system?

TODO need to try catch the scrape attempts

*/

//create a server object:
http
  .createServer(function (req, res) {
    // scrapeShopifySite("https://bernalcutlery.com/");
    /*
    scrapeShopifySite("https://knifewear.com/");
    scrapeShopifySite("https://japanesechefsknife.com/");
    scrapeShopifySite("https://carbonknifeco.com/");
    scrapeShopifySite("https://www.japaneseknifeimports.com/");
    scrapeShopifySite("https://knivesandstones.us/");
    */
    saveItem("");
    //checkCKTG();
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
