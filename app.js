import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer-core';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv'

const app = express();
const PORT = 3001;

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'gp_apps'
// });

// db.connect((err) => {
//     if(err){
//         throw err;
//     }
//     console.log('connected to database');
// });

updateFindApkApps()
updateDatabase();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const pageLength = 13000;

            const timer = setInterval(() => {
                window.scrollBy(0, distance);
                totalHeight += distance;
                console.log('total height: ' + totalHeight);
                if (totalHeight >= pageLength) {
                    clearInterval(timer);
                    resolve();
                }
            }, 500);
        });
    });
}

async function getFindApkApps(numApps){
    try{
        const res = await fetch(`https://findapk.co.za/api/v1/app/get-app-details/petal?page=1&limit=${numApps}`, {
            method: 'GET',
            headers: { "Content-Type": "application/json" }
        });

        if(!res.ok){
            throw new Error('Failed to get apps');
        }

        console.log('POST OK');
        const findApkApps = await res.json();
        const apps = findApkApps.applications ?? [];

        function isNewerVersion(v1, v2){
            console.log("v1 :" +v1);
            console.log("v2 :" +v2);
            const splitV1 = v1.split('.').map(Number);
            const splitV2 = v2.split('.').map(Number);

            for (let i = 0; i < Math.max(splitV1.length, splitV2.length); i++){
                const num1 = splitV1[i] || 0;
                const num2 = splitV2[i] || 0;

                if(num1 > num2) return true;
                else if(num1 < num2) return false;
            }
            return false;
        }

        const filteredApps = Object.values(apps.reduce((accumilator, app) => {
            if (app.num != null){
                if(!accumilator[app.num] || isNewerVersion(app.versionName, accumilator[app.num].versionName)){
                    accumilator[app.num] = app;
                }
            }
            return accumilator;
        }, {}));

        return filteredApps;
    } catch (err){
        console.error("Error Getting Apps ", err);
        return null;
    }
}

//#region Database

//TODO: update database to supabase
async function updateDatabase() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://appfigures.com/top-apps/google-play/south-africa/top-overall', {
        waitUntil: 'networkidle0'
    });

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

    const detailsPage = await browser.newPage();

    for (let i = 0; i < topFreeApps.length; i++) {
        const app = topFreeApps[i];

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
            
            const match = dateEl.innerText.match(/\((.*?)\)/);
            const dateText = match ? match[1] : null;

            return {
                packageName: packageNameEl ? packageNameEl.innerText.trim() : '',
                version: versionEl ? versionEl.innerText.trim() : '',
                lastUpdated: dateEl ? dateText : ''
            };
        });
        
        app.packageName = updatedApp.packageName;
        app.version = updatedApp.version;
        app.lastUpdated = updatedApp.lastUpdated;

        console.log(`App: ${app.name} \n\t Version: ${app.version} \n\t App ID: ${app.packageName} \n\t Last Updated: ${app.lastUpdated}`);

        await checkExistingApps(app.packageName, async (found) => {
            if(found){
                await updateAppData(app.packageName, app.version, app.lastUpdated);
            } else {
                await addAppData(app);
            }
        });

        await new Promise(r => setTimeout(r, 20000));
    }

    console.log('Top Free App: ', topFreeApps);

    await browser.close();
}

async function checkExistingApps(packageName, callback){
    console.log('checking ' + packageName)

    const {data, error} = await supabase
        .from('app_details')
        .select('count')
        .eq('package_name', packageName)

    if (error) {
        console.error('Error querying the database: ', error);
        return;
    }

    if (data[0].count > 0){
        console.log('App *' + packageName + '* exists');
        callback(true);
    } else{
        console.log('App *' + packageName + '* DOESNT exist');
        callback(false);
    }
}

async function updateAppData(packageName, newVersion, newDate){
    const { data, error } = await supabase
        .from('app_details')
        .update({version: newVersion, last_updated: newDate})
        .eq('package_name', packageName)

    if(error){
        console.error('Error update user: ',  error);
        return;
    }
    console.log('App *' + packageName + '* was updated');
}

async function addAppData(app){
    const { data , error } = await supabase
        .from('app_details')
        .insert([
            {
                name: app.name,
                package_name: app.packageName,
                version: app.version,
                last_updated: app.lastUpdated
            }
        ]);

    if(error) {
        console.error('Database Error: ', error);
        return;
    }
    console.log('App *' + app.name + '* added to database');
}

async function getDbApps(){
    const { data, error } = await supabase
        .from('app_details')
        .select('*');

    if (error) {
        console.error('Error fetching app details: ', error);
        return [];
    }

    return data;
}

async function updateFindApkApps(){
    const findApk_apps = await getFindApkApps(500);
    findApk_apps.map(async app => {
        await checkExistingFindApkApps(app.packageName, async (found) => {
            if(found){
                await updateFindApkAppData(app.packageName, app.versionName);
            } else {
                await addFindApkAppData(app);
            }
        });
    })
}

async function checkExistingFindApkApps(packageName, callback){
    const {data, error} = await supabase
        .from('findapk_details')
        .select('count')
        .eq('package_name', packageName)

    if (error) {
        console.error('Error querying the database: ', error);
        return;
    }

    if (data[0].count > 0){
        console.log('App *' + packageName + '* exists');
        callback(true);
    } else{
        console.log('App *' + packageName + '* DOESNT exist');
        callback(false);
    }
}

async function updateFindApkAppData(packageName, newVersion){
    const { data, error } = await supabase
        .from('findapk_details')
        .update({version: newVersion})
        .eq('package_name', packageName)

    if(error){
        console.error('Error update user: ',  error);
        return;
    }
    console.log('App *' + packageName + '* was updated');
}

async function addFindApkAppData(app){
    const { data , error } = await supabase
        .from('findapk_details')
        .insert([
            {
                name: app.name,
                package_name: app.packageName,
                version: app.versionName,
            }
        ]);

    if(error) {
        console.error('Database Error: ', error);
        return;
    }
    console.log('App *' + app.name + '* added to database');
}

//#endregion

//#region GET Requests
app.get('/update-database', async (req, res) => {
    try{
        updateDatabase().catch(err => console.error("Error in updateDatabase:", err));
        res.json({ success: true, message: "Database update started" });
    } catch (err){
        console.error("Error in search: ", err);
        res.status(500).json({ success: false, message: "Database update ERROR" });
    }
});

app.get('/db-apps', async (req, res) => {
    try{
        const dbApps = await getDbApps();
        res.json({success: true, data: dbApps});
    } catch (err){
        console.error('Error getting db apps: ', err);
        res.status(500).json({success: false, message: 'Couldnt get apps from database'});
    }
});

app.get('/findApk-apps', async (req, res) => {
    try{
        const findApkApps = await getFindApkApps(500);
        res.json({success: true, data: findApkApps});
    } catch (err){
        console.error('Error getting findApk apps: ', err);
        res.status(500).json({success: false, message: 'Couldnt get findApk apps'});
    }
})
//#endregion

//#region POST Requests
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
        res.json(topApps);
    } catch (error) {
        console.log("ERROR: " + error)
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
//#endregion

//#region WEB-SOCKETS
app.get('/db-update-progress', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    clients.push(res);

    req.on('close', () => {
        clients.splice(clients.indexOf(res), 1);
    })
})

function sendProgressUpdate(progress) {
    clients.forEach(client => {
        client.write(`data: ${JSON.stringify(progress)}\n\n`);
    });
}
//#endregion

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});