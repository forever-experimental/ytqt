import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import bing from 'bing-image-search-api-scraper';
import os from 'os';
puppeteer.use(StealthPlugin());

// I need to fix the cookie situation idk why its not working.
const browser = async () =>
{
    console.log(os.userInfo().username);
    return await puppeteer.launch({
            headless: false,
            executablePath: `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Google\\Chrome SxS\\Application\\chrome.exe`,
            userDataDir: `C:\\Users\\${os.userInfo().username}\\AppData\\Local\\Google\\Chrome SxS\\User Data\\Default`
        });
};

const bing_abuser = async (query = 'anime legs', count = 4, random = true) =>
{
    console.log(`Initiating image search with query: ${query}`);

    let search = await bing.search(query);
    if (random) {
        search = getRandomElementsBack(search, count);
    }
    console.log("Not raw: ", search);

    console.log("Getting direct Image URLs...");
    let directImageUrls = await getDirectImageLinksFromBingSeachObjects(search, count);
    return (directImageUrls);

    async function getDirectImageLinksFromBingSeachObjects(photoUrls, howMany, debugScreenshot = false)
    {
        let browser = await cute.browser();

        const page = await browser.newPage();
        const directImageUrls = [];

        for (const photoUrlObject of photoUrls) {
            try {
                console.log("Navigating to Photo URL...");
                await page.goto(photoUrlObject.photo, {waitUntil: 'networkidle2'});

                await page.waitForTimeout(200); // not needed depends

                if (debugScreenshot) {
                    await page.screenshot({path: `screenshot-${Date.now()}.png`});
                }

                const directImageUrl = await page.evaluate(() =>
                {
                    const img = document.querySelector('img[style="display: none"]');
                    return img ? img.src : null;
                });

                if (directImageUrl) {
                    console.log(`Found Direct Image URL: ${directImageUrl}`);
                    directImageUrls.push(directImageUrl);
                }
                else {
                    console.log("No direct image URL found.");
                    directImageUrls.push(null);
                }

                if (directImageUrls.length === howMany) {
                    console.log("Collected desired number of Image URLs. Exiting loop.");
                    break;
                }
            }
            catch (error) {
                console.error(`Failed to process ${photoUrlObject.photo}:`, error);
                if (debugScreenshot) {
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
        if (count > theList.length) {
            count = theList.length;
        }

        let result = [];
        let taken = [];
        while (count--) {
            let x = Math.floor(Math.random() * theList.length);
            result[count] = theList[x in taken ? taken[x] : x];
            taken[x] = --theList.length in taken ? taken[theList.length] : theList.length;
        }
        return result;
    }
};

browser();
