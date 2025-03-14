import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import mysql from 'mysql2';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'gp_apps'
});

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('connected to database');
});

(async () => {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://appfigures.com/top-apps/google-play/united-states/top-overall', {
        waitUntil: 'networkidle0'
    });

    async function autoScroll(page) {
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 250;
                const pageLength = 13000;

                const timer = setInterval(() => {
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    console.log('total height: ' + totalHeight);
                    if (totalHeight >= pageLength) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    }

    await autoScroll(page);

    const topFreeApps = await page.evaluate(() => {
        const list = Array.from(document.querySelectorAll('.s1488507463-0')).filter((_,i) => i % 3 == 0)

        let freeApps = Array.from(list).flatMap( li =>{
            const appElements = li.querySelectorAll('.s-4262409-0'); // Update the selector if necessary
            return Array.from(appElements).map(_app => ({
                name: _app.innerText.substring(_app.innerText.indexOf(' ') + 1).trim(),
                link: _app.href,
                packageName: '',
                version: '',
                lastUpdated: ''
            }));
        })

        return freeApps;
    });

    // const chunkSize = 50;
    // let appChunks = [];

    //slices the apps into chunkc for processing speed
    // for(let i = 0; i < topFreeApps.length; i += chunkSize){
    //     appChunks.push(topFreeApps.slice(i, i + chunkSize));
    // }

    // const pages = await Promise.all(appChunks.map(() => browser.newPage()));

    const detailsPage = await browser.newPage();

    for(const app of topFreeApps) {
        await detailsPage.goto(app.link, { 
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        const updatedApp = await detailsPage.evaluate(() => {
            const packageNameEl = document.querySelector('.s-1674543659-0.s1901059984-1');
            const parentElements = document.querySelectorAll('.s797788345-0');
            let versionEl, dateEl; 

            for(const el of parentElements){
                const innerText = el.childNodes[0].innerText;
                if(innerText === 'Version' && versionEl == null){
                    versionEl = el.childNodes[1];
                }
                else if (innerText === 'Last updated' && dateEl == null){
                    dateEl = el.childNodes[1];
                }
            }

            return {
                packageName: packageNameEl ? packageNameEl.innerText.trim() : '',
                version: versionEl ? versionEl.innerText.trim() : '',
                lastUpdated: dateEl ? dateEl.innerText.trim() : ''
            };
        });
        
        app.packageName = updatedApp.packageName;
        app.version = updatedApp.version;
        app.lastUpdated = updatedApp.lastUpdated;

        console.log(`App: ${app.name} \n\t Version: ${app.version} \n\t App ID: ${app.packageName} \n\t Last Updated: ${app.lastUpdated}`);

        //load data onto database
        //check if app already exists
        checkExistingApps(app.packageName, (found) => {
            if(found){
                //update the version on the db
                updateAppData(app.packageName, app.version);
            } else {
                //add a new row of data
                addAppData(app);
            }
        });

        await new Promise(r => setTimeout(r, 20000));
    }

    function checkExistingApps(packageName, callback){
        const query = 'SELECT COUNT(*) AS count FROM app_details WHERE package_name = ?';

        db.execute(query, [packageName], (err, results) => {
            if (err) {
                console.error('Error querying the database: ', err);
                return;
            }

            if (results[0].count > 0){
                console.log('App *' + packageName + '* exists');
                callback(true);
            } else{
                console.log('App *' + packageName + '* DOESNT exist');
                callback(false);
            }
        });
    }

    function updateAppData(packageName, newVersion, newDate){
        const query = `UPDATE app_details SET version = ?, last_updated = ? WHERE package_name = ?`;

        db.execute(query, [packageName, newVersion, newDate], (err, results) => {
            if(err){
                console.error('Error update user: ',  err);
                return;
            }

            console.log('App *' + packageName + '* was updated');
        });
    }

    function addAppData(app){
        const query = 'INSERT INTO app_details (name, package_name, version, last_updated) VALUES (?, ?, ?, ?)';
        db.query(query, [app.name, app.packageName, app.version, app.lastUpdated], (err, result) => {
            if(err) {
                console.error('Database Error: ', err);
                return;
            }
            console.log('App *' + app.name + '* added to database');
        });
    }

    // // Process each chunk in a separate tab
    // await Promise.all(
    //     pages.map(async (tab, index) => {
    //         const apps = appChunks[index] || [];
    //         for (const app of apps) {
    //             console.log(`Tab ${index + 1} visiting: ${app.name}`);
    //             await tab.goto(app.link, { waitUntil: 'networkidle0' });
                
    //             const updatedApp = await tab.evaluate(() => {
    //                 const packageNameEl = document.querySelector('.s-1674543659-0.s1901059984-1');
                    
    //                 const versionEl = document.querySelectorAll('.s-400240423-0.s-533381810-1');                
    //                 return {
    //                     packageName: packageNameEl ? packageNameEl.innerText.trim() : '',
    //                     version: versionEl[16] ? versionEl[16].innerText.trim() : ''
    //                 };
    //             }, app);
                
    //             app.packageName = updatedApp.packageName;
    //             app.version = updatedApp.version;

    //             console.log(`App: ${app.name} \n\t Version: ${app.version} \n\t App ID: ${app.packageName}`);
                
    //             await new Promise(r => setTimeout(r, 60000)); // Delay between URLs
    //         }
    //     })
    // );

    console.log('Top Free App: ', topFreeApps);

    await browser.close();
})();

// const browser = await puppeteer.launch({
//     executablePath: '/usr/bin/chromium-browser',
//     headless: false, 
//     args: [
//     '--incognito',
//     '--no-sandbox'
//   ]});

// (async () => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();

//     await page.goto('https://www.luno.com/en/price/BTC', 
//         {
//             waitUntil: 'networkidle0',
//           }
//     );


//     const inputId = '#mat-input-1';
//     try {
//         // Wait for the input element to be present
//         await page.waitForSelector(inputId);
    
//         // Set the input value and trigger Angular's change detection
//         await page.evaluate((selector) => {
//           const input = document.querySelector(selector);
//         //   if (input) {
//         //     // input.value = 'My Value with ID';
//         //     input.dispatchEvent(new Event('input'));
//         //   }
//          console.log(input);
//         }, inputId);
    
//         // Verify the input value
//         const inputValue = await page.$eval(inputId, (el) => el.value);
//         console.log('Input Value:', inputValue);
    
//       } catch (error) {
//         console.error('Error interacting with input:', error);
//       }


//       browser.close();

//     // setInterval(async () => {
//     //     const amount = await page.evaluate(() => {
//     //         const element = document.getElementById('mat-input-1');
//     //         return element;
//     //     });
//     //     console.log(amount);
//     //     browser.close();
//     // }, 10000)




// });

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
