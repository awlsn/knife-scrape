import mongoose from "mongoose";
import cloudinary from "cloudinary";
import express from 'express';

import { checkCKTG } from "./sites/cktg.js";
import { scrapeShopifySite, saveItem } from "./sites/shopify.js";
import { Item } from "./models/Item.js";

const app = express();
const port = 3000;


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
  
  //scrapeShopifySite("https://bernalcutlery.com/");
  //scrapeShopifySite("https://japanesechefsknife.com/");
  //scrapeShopifySite("https://knifewear.com/");
  //scrapeShopifySite("https://carbonknifeco.com/");
  //scrapeShopifySite("https://www.japaneseknifeimports.com/");
  //scrapeShopifySite("https://knivesandstones.us/");


  app.get('/', (req, res) => {
    res.send('<h1>You should not be here.<h1>')
  });

  app.get('/about', (req, res) => {
    res.send('<h1>Knife DB is a DB of kitchen knives.<h1>')
  });

  app.get('/api', (req, res) => {
    Item.find({quantity: { $gte: 1 }})
      .sort({'dateAdded': -1})
      .limit(20)
      .exec(function(err, posts) {
          res.json(posts);
      });
  });

  app.get('/list', (req, res) => {
    
    Item.find({quantity: { $gte: 1 }})
      .sort({'dateAdded': -1})
      .limit(20)
      .exec(function(err, items) {
          const output = items.reduce((html, item, i, []) => {
              // console.log(item);
              const {url, name, price, image, siteUrl, productUrl, tags, desc} = item;
              return html + `<div>
                <a href="${url}"><h2>${name}</h2></a>
                <h3>$${price}</h3>
                <img width="400" src="${image.url}"/>
                <p>${siteUrl} / ${productUrl}</p>
                <p>${tags}</p>
                ${desc}
                </div>`
          });
          res.send(output);
      });
  });
  
  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
  })

  
}

main();

