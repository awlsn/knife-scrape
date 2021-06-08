import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";
import { JSDOM } from "jsdom";

export async function checkCKTG() {
  // fetch store products XML
  const url = `https://www.chefknivestogo.com/ind.html`;
  const res = await fetch(url);
  const htmlData = await res.text();

  const dom = new JSDOM(htmlData);
  const knifetypes = dom.window.document.body.querySelectorAll(
    ".sitemap>li"
  )[1];

  if (knifetypes) {
    // console.log(knifetypes[1].querySelector("h2").textContent);
    // set will automatically filter duplicates
    const knifeLinks = new Set(knifetypes.querySelectorAll("a"));
    /*
    knifeLinks.forEach((link) => {
      console.log(link.href);
    });
    */
    //console.log(knifeLinks.size);
    console.log(`CKTG currently has ${knifeLinks.size} items!`);
  }

  // if lastmod is more recent than current record, store new record
}

async function checkItem(url) {
  // fetch json data for item
  url =
    "https://www.japaneseknifeimports.com/products/gesshin-ittetsu-180mm-white-2-hon-kasumi-wa-petty.json";
  const res = await fetch(url);
  const item = await res.json();

  const rec = {};
  rec.name = item.product.title;
  rec.storeId = item.product.id;
  // rec.desc = item.product.body_html;
  rec.price = item.product.variants[0].price;
  rec.quantity = item.product.variants[0].inventory_quantity;
  rec.url = `https://www.japaneseknifeimports.com/products/${item.product.handle}`;
  rec.image = item.product.image;
  //rec.images = item.product.images;

  console.log(rec);
  // create new record for the item? etc.
}

/*

JKI

get all products



-> loc param with .json added is knife data

"inventory_quantity": 0, = sold out?

need to store URL also

need to figure out object shape for DB, do differential updates

for JKI, could check https://www.japaneseknifeimports.com/collections/in-stock-items.json products_count?

*/
