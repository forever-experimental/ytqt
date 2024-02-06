// Filename: openFirefoxWithProfile.js

const {Builder, until} = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');

const profilePath = 'C:\\Users\\SDS\\AppData\\Roaming\\Mozilla\\Firefox\\Profiles\\zew5fvgj.default';

let options = new firefox.Options();
options.setProfile(profilePath);


(async function openYoutubeChannel()
{
    let driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(options)
    .build();

    try
    {
        await driver.get('https://www.youtube.com/@planetrenox');
        await driver.wait(until.urlContains("not"), 10000000);
    }
    finally
    {
        //await driver.quit();
    }
})();


module.exports = {};
