#!/usr/bin/env node

const bing = require('bing-image-search-api-scraper')
const puppeteer = require('puppeteer');
const console = require("console");

if (require.main === module)
{
    console.log("Running from CLI. Initiating scraping of images.");
    getImgUrlsFromBingImage("cybercore anime", 1);
}
else
{
    module.exports = {};
}

async function getImgUrlsFromBingImage(query, count = 1, random = true)
{
    console.log(`Initiating image search with query: ${query}`);

    var search = await bing.search(query);
    console.log("Not raw: ", search);
    if (random)
    {
        search = getRandomElementsBack(search, count);
    }
    console.log("Not raw: ", search);

    console.log("Getting direct Image URLs...");
    var directImageUrls = await getDirectImageLinksFromBingSeachObjects(search, count);


    async function getDirectImageLinksFromBingSeachObjects(photoUrls, howMany, debugScreenshot = false)
    {

        console.log("Launching Puppeteer Browser...");
        const browser = await puppeteer.launch({headless: 'new'});
        const page = await browser.newPage();
        const directImageUrls = [];

        for (const photoUrlObject of photoUrls)
        {
            try
            {
                console.log("Navigating to Photo URL...");
                await page.goto(photoUrlObject.photo, {waitUntil: 'networkidle2'});

                //await page.waitForTimeout(1000);

                if (debugScreenshot)
                {
                    await page.screenshot({path: `screenshot-${Date.now()}.png`});
                }

                const directImageUrl = await page.evaluate(() =>
                {
                    const img = document.querySelector('img[style="display: none"]');
                    return img ? img.src : null;
                });


                if (directImageUrl)
                {
                    console.log(`Found Direct Image URL: ${directImageUrl}`);
                    directImageUrls.push(directImageUrl);
                }
                else
                {
                    console.log("No direct image URL found.");
                    directImageUrls.push(null);
                }

                if (directImageUrls.length == howMany)
                {
                    console.log("Collected desired number of Image URLs. Exiting loop.");
                    break;
                }
            }
            catch (error)
            {
                console.error(`Failed to process ${photoUrlObject.photo}:`, error);
                if (debugScreenshot)
                {
                    await page.screenshot({path: `error-${Date.now()}.png`});
                }
                directImageUrls.push(null); // Push null or some error indicator for failed attempts
            }
        }

        console.log("Closing Browser...");
        await browser.close();
        return directImageUrls;
    }

    function getRandomElementsBack(theList, count)
    {
        if (count > theList.length)
        {
            count = theList.length;
        }

        let result = [];
        let taken = [];
        while (count--)
        {
            let x = Math.floor(Math.random() * theList.length);
            result[count] = theList[x in taken ? taken[x] : x];
            taken[x] = --theList.length in taken ? taken[theList.length] : theList.length;
        }
        return result;
    }
}




