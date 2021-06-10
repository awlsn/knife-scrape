import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";
import cloudinary from "cloudinary";

import { Item } from "../models/Item.js";

export async function scrapeShopifySite(siteUrl) {
  // shopify has a secondary products sitemap as the first entry on their sitemap.xml
  const sitemap = await getXMLAsJson(`${siteUrl}/sitemap.xml`);
  // get the link to the secondary products sitemap and access
  const productsMapURL = sitemap.sitemapindex.sitemap[0].loc;
  // access the secondary products sitemap
  const productMap = await getXMLAsJson(productsMapURL);
  const productLinks = productMap.urlset.url
  console.log(`${siteUrl} currently has ${productLinks.length} items!`);

  productLinks.forEach(async item => {
    
    const url = item.loc
    // skip the initial entry with the site's url
    if(url === siteUrl) return;

    // check if item url is already in db
    const dbItem = await Item.findOne({url});

    if (dbItem) {
      console.log("item already exists", url);
      // check if there is a newer version available and update if needed

      const fetchDate = new Date(loc.lastmod);
      const dbDate = new Date(dbItem.storeUpdatedAt);

      if (fetchDate > dbDate) {
        // update item
        Item.updateOne({ url }, rec, function (err, doc) {
          if (err) return console.error("DB UPDATE ERROR!", err);
          //console.log(rec);
          console.log("updated a new item", url);
        });
    }
   } else {
      saveItem(url);
    }
  });

  // scrape product links
  // build product db from links,
  // check if exists, check if up to date
  // if new, make new record
}


export async function saveItem(url) {
  // shopify has a json data version for each product url if you append .json
  const res = await fetch(url + ".json");
  const item = await res.json();

  const rec = {};
  rec.name = item.product.title;
  rec.storeId = item.product.id;
  rec.desc = item.product.body_html;
  rec.price = item.product.variants[0].price;
  rec.quantity = item.product.variants[0].inventory_quantity;
  rec.storeCreatedAt = item.product.created_at;
  rec.storeUpdatedAt = item.product.updated_at;
  rec.tags = item.product.tags;
  rec.url = url;

  // upload images
  console.log('uploading images...', url);
  try {
    const image = await uploadImage(item.product?.image?.src);
    const images = await item.product.images.map(async (img) => {await uploadImage(img.src)}) 
    rec.image = image;
    rec.images = images;
  } catch(e) {
    console.log('error uploading to cloudinary', url);
    console.error(e);
  }
  
  const recItem = new Item(rec);
  recItem.save(function (err, doc) {
    if (err) console.error('DB Save Exception!', err);
    console.log('added new item...', url);
  });
}

async function uploadImage(src) {
  return new Promise(function(resolve, reject) {
    cloudinary.v2.uploader.upload(src, {use_filename: true, unique_filename: false, folder: 'knifedb'}, function (err, res) {
      if (err) return reject(err);
      resolve(res);
    })
  });
}


async function getXMLAsJson(url) {
  // TODO: randomize headers?
  const headers = {
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"90\", \"Google Chrome\";v=\"90\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "cookie": "secure_customer_sig=; _y=c43218bb-6328-4c10-8925-b2134e781215; _shopify_y=c43218bb-6328-4c10-8925-b2134e781215; cart_currency=USD; _orig_referrer=https%3A%2F%2Fwww.reddit.com%2F; _landing_page=%2F; _s=747fbafc-5a4e-4071-adcc-1d1a5a9ad99d; _shopify_s=747fbafc-5a4e-4071-adcc-1d1a5a9ad99d"
  };
  // get sitemap
  const sitemapRes = await fetch(url, headers);
  const sitemapData = await sitemapRes.text();

  const sitemapTraversalObj = parser.getTraversalObj(sitemapData, {
    trimValues: true
  });
  const sitemap = parser.convertToJson(sitemapTraversalObj, {
    trimValues: true
  });

  return sitemap;
}
