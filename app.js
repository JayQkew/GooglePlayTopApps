import express from 'express';
import cors from 'cors';
import gplay from "google-play-scraper";
import xl from 'xlsx';
import fs from 'fs';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post("/submit", async (req, res) => {
    try{
        const {category, collection, numApps} = req.body;

        console.log("Recieved form data: ", req.body);

        const topApps = await gplay.list({
            category: gplay.category[category],
            collection: gplay.collection[collection],
            num: parseInt(numApps)
        });

        const appDetails = await Promise.all(topApps.map(app => getAppDetail(app.appId)));

        const excelData = topApps.map((app, i) => ({
            Title: app.title,
            URL: app.url,
            Installs: appDetails[i].installs
        }));

        const filePath = generateExcel(excelData);

        res.json({ success: true, downloadLink: filePath });

    } catch (error) {
        console.error("Error fetching apps: ", error);
        console.log(req.body)
        res.status(500).json({ success: false, message: "Server error",  body: req.body });
    }
});

async function getAppDetail(appID) {
    return gplay.app({ appId: appID });
}

function generateExcel(data) {
    const ws = xl.utils.json_to_sheet(data);
    const wb = xl.utils.book_new();
    xl.utils.book_append_sheet(wb, ws, 'Top Apps');

    return xl.write(wb, {bookType: 'xlsx', type: 'buffer'});    
}

app.post("/download", async (req, res) => {
    try {
        const { category, collection, numApps } = req.body;
        console.log("Received form data:", req.body);

        const topApps = await gplay.list({
            category: gplay.category[category],
            collection: gplay.collection[collection],
            num: parseInt(numApps)
        });

        const appDetails = await Promise.all(topApps.map(app => getAppDetail(app.appId)));

        const excelData = topApps.map((app, i) => ({
            Title: app.title,
            URL: app.url,
            Installs: appDetails[i].installs
        }));

        const excelBuffer = generateExcel(excelData);

        // Set response headers to trigger a download
        res.setHeader('Content-Disposition', `attachment; filename="top_apps_${Date.now()}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);

    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
