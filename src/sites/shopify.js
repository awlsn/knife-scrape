import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";

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
