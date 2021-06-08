import http from "http";

// shopify sites
import { checkJKI } from "./sites/jki.js";
import { checkBernal } from "./sites/bernal.js";
import { checkKNSUS } from "./sites/knsus.js";

import { checkCKTG } from "./sites/cktg.js";
import { scrapeShopifySite } from "./sites/shopify.js";
// Need to store historical data?

/*

each site is its own js file
for now just write to json?

create a raw copy, then migrate it into a standardized system?

*/

//create a server object:
http
  .createServer(function (req, res) {
    scrapeShopifySite("https://bernalcutlery.com/");
    scrapeShopifySite("https://knifewear.com/");
    scrapeShopifySite("https://japanesechefsknife.com/");
    scrapeShopifySite("https://carbonknifeco.com/");
    scrapeShopifySite("https://www.japaneseknifeimports.com/");
    scrapeShopifySite("https://knivesandstones.us/");

    //checkCKTG();
    res.write("Hello World!"); //write a response to the client
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
