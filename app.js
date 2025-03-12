import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto('https://appfigures.com/top-apps/google-play/united-states/top-overall');

    // Function to scroll to the bottom of the page
    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = window.innerHeight;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 500);
            });
        });
    }

    // Scroll to bottom
    await autoScroll(page);

    const topFreeApps = await page.evaluate(() => {
        const list = document.querySelectorAll('.s1488507463-0');

        let allTop = Array.from(list).map( li =>{
            const appElements = li.querySelectorAll('.s-4262409-0'); // Update the selector if necessary
            return Array.from(appElements).map(app => app.innerText.trim());
        })

        const freeApps = allTop.filter((_, i) => i % 3 === 0).flat();
        const paidApps = allTop.filter((_, i) => i % 3 === 1).flat();
        const grossingApps = allTop.filter((_, i) => i % 3 === 2).flat();

        allTop = [freeApps, paidApps, grossingApps];

        return allTop;
    });

    console.log('Top Free App: ', topFreeApps);

    await browser.close();
})();

app.post("/topApps", async (req, res) => {
    try {
        const { category, collection, numApps, language, country } = req.body;
        console.log("Received form data:", req.body);

        const topApps = await gplay.list(
            {
                category: gplay.category[category],
                collection: gplay.collection[collection],
                num: parseInt(numApps),
                lang: language,
                country: country,
                appDetails: 'true',
                throttle: 10
            }
        );

        const appDetails = await Promise.all(topApps.map(app => getAppDetail(app.appId)));


        res.json(topApps);
    } catch (error) {
        console.log("ERROR: " + error)
    }
})

app.get('/top-free', async (req, res) => {
    try{


    } catch (err){
        console.error("Error in search: ", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post('/search', async (req, res) => {
    try{
        const {searchValue, lang, country} = req.body;
        console.log("Searching: "+ searchValue);

        const searchResults = await gplay.search(
            {
                term: searchValue,
                num: 20,
                lang: lang,
                country: country,
                fullDetail: 'true'
            }
        )[0];

        const simplifiedResults = searchResults.map(results => {
            return {
                Name: results.title,
                Version: results.version
            }
        })

        console.log(simplifiedResults);
        res.json(searchResults);
    } catch (error){
        console.log('Error during search: ', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

app.post('/packageSearch', async (req, res) => {
    try{
        const {searchValue} = req.body;
        console.log("Searching: "+ searchValue);

        const searchResults = await gplay.search(
            {
                term: searchValue,
                num: 1,
                fullDetail: 'true'
            }
        );

        const simplifiedResults = searchResults.map(results => {
            return {
                Name: results.title,
                Version: results.version
            }
        })

        console.log(simplifiedResults);
        res.json(searchResults);
    } catch (error){
        console.log('Error during search: ', error);
        res.status(500).json({ success: false, message: "Server error" });
    }
})

async function getAppDetail(appID) {
    return gplay.search({ 
        term: appID,
        num: 1,
        fullDetail: 'true'
     });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
