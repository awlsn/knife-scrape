import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";
import cloudinary from "cloudinary";

import { Item } from "../models/Item.js";

export async function scrapeShopifySite(url) {
  // TODO: randomize headers?

  // get sitemap
  const sitemapRes = await fetch(`${url}/sitemap.xml`);
  const sitemapData = await sitemapRes.text();

  const sitemapTraversalObj = parser.getTraversalObj(sitemapData, {
    trimValues: true
  });
  const sitemap = parser.convertToJson(sitemapTraversalObj, {
    trimValues: true
  });
  // shopify has a products sitemap as the first entry on their sitemap.xml
  const productsMapURL = sitemap.sitemapindex.sitemap[0].loc;
  // fetch the products from the secondary sitemap
  const ProductMapRes = await fetch(productsMapURL);
  const ProductMapData = await ProductMapRes.text();

  const ProductMapTraversalObj = parser.getTraversalObj(ProductMapData, {
    trimValues: true
  });
  const ProductMap = parser.convertToJson(ProductMapTraversalObj, {
    trimValues: true
  });
  console.log(`${url} currently has ${ProductMap.urlset.url.length} items!`);
  // scrape product links
  // build product db from links,
  // check if exists, check if up to date
  // if new, make new record
}

export async function saveItem(url) {
  // fetch json data for item
  //url = "https://www.japaneseknifeimports.com/products/gesshin-ittetsu-180mm-white-2-hon-kasumi-wa-petty";
  url =
    "https://www.japaneseknifeimports.com/products/gesshin-stainless-240mm-wa-gyuto";
  const res = await fetch(url + ".json");
  const item = await res.json();

  const rec = {};
  rec.name = item.product.title;
  rec.storeId = item.product.id;
  // rec.desc = item.product.body_html;
  rec.price = item.product.variants[0].price;
  rec.quantity = item.product.variants[0].inventory_quantity;
  rec.storeCreatedAt = item.product.created_at;
  rec.storeUpdatedAt = item.product.updated_at;
  rec.url = `https://www.japaneseknifeimports.com/products/${item.product.handle}`;

  //rec.image = item.product.image;
  //rec.images = item.product.images;

  const dbItem = await Item.findOne({ url });

  if (dbItem) {
    console.log("item already exists");
    // check if it is up to date
    const fetchDate = new Date(item.product.updated_at);
    const dbDate = new Date(dbItem.storeUpdatedAt);
    if (fetchDate > dbDate) {
      console.log("need to update!");
      // update item
      Item.updateOne({ url }, rec, function (err, doc) {
        if (err) return console.error(err);
        console.log(rec);
        console.log("updated a new item");
      });
    }
    // console.log(dbItem);
  } else {
    // upload images
    //const image = await uploadImage(item.product.image.src);

    // save a new item
    const recItem = new Item(rec);
    recItem.save(function (err, doc) {
      if (err) return console.error(err);
      console.log(rec);
      console.log("added a new item");
    });
  }
}

async function uploadImage(src) {
  return new Promise(
    cloudinary.v2.uploader.upload(src, function (err, res) {
      if (err) return console.error(err);
      console.log("image uploaded!");
      return res;
    })
  );
}
