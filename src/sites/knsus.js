import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";

export async function checkKNSUS() {
  // fetch store products XML
  const url = `https://knivesandstones.us/sitemap_products_1.xml?from=1567185502244&to=6743569367215`;
  const res = await fetch(url);
  const xmlData = await res.text();

  // parse XML to JS obj
  const options = {
    trimValues: true
  };
  const tObj = parser.getTraversalObj(xmlData, options);
  const kns = parser.convertToJson(tObj, options);

  console.log(`KNS currently has ${kns.urlset.url.length} items!`);

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
