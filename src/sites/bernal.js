import fetch from "isomorphic-fetch";
import parser from "fast-xml-parser";

export async function checkBernal() {
  // fetch store products XML
  //const url = `https://bernalcutlery.com/sitemap_products_1.xml?from=5681781964952&to=6809622053016`;
  const res = await fetch(
    "https://knivesandstones.us/sitemap_products_1.xml?from=1567185502244&to=6743569367215",
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        "sec-ch-ua":
          '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
        "sec-ch-ua-mobile": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "cross-site",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        cookie:
          "secure_customer_sig=; _y=c43218bb-6328-4c10-8925-b2134e781215; _shopify_y=c43218bb-6328-4c10-8925-b2134e781215; cart_currency=USD; _orig_referrer=https%3A%2F%2Fwww.reddit.com%2F; _landing_page=%2F"
      },
      referrerPolicy: "strict-origin-when-cross-origin",
      body: null,
      method: "GET",
      mode: "cors"
    }
  );
  const xmlData = await res.text();

  // parse XML to JS obj
  const options = {
    trimValues: true
  };
  const tObj = parser.getTraversalObj(xmlData, options);
  const bern = parser.convertToJson(tObj, options);

  console.log(`Bernal currently has ${bern.urlset.url.length} items!`);

  // if lastmod is more recent than current record, store new record
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
fetch(
  "https://knivesandstones.us/sitemap_products_1.xml?from=1567185502244&to=6743569367215",
  {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "cache-control": "max-age=0",
      "sec-ch-ua":
        '" Not A;Brand";v="99", "Chromium";v="90", "Google Chrome";v="90"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "cross-site",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      cookie:
        "secure_customer_sig=; _y=c43218bb-6328-4c10-8925-b2134e781215; _shopify_y=c43218bb-6328-4c10-8925-b2134e781215; cart_currency=USD; _orig_referrer=https%3A%2F%2Fwww.reddit.com%2F; _landing_page=%2F"
    },
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors"
  }
);
