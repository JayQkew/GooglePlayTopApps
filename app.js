import express from 'express';
import cors from 'cors';
import gplay from "google-play-scraper";
import xl from 'xlsx';
import path from 'path';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post("/submit", async (req, res) => {
    try{
        const { category, collection, numApps, language, country } = req.body;

        console.log("Recieved form data: ", req.body);

        const topApps = await gplay.list({
            category: gplay.category[category],
            collection: gplay.collection[collection],
            num: parseInt(numApps),
            lang: language,
            country: country
        });

        const appDetails = await Promise.all(topApps.map(app => getAppDetail(app.appId, language, country)));

        res.json({ success: true, appData: appDetails });

    } catch (error) {
        console.error("Error fetching apps: ", error);
        console.log(req.body)
        res.status(500).json({ success: false, message: "Server error",  body: req.body });
    }
});

app.post("/download", async (req, res) => {
    try {
        const { category, collection, numApps, language, country } = req.body;
        console.log("Received form data:", req.body);

        const topApps = await gplay.list({
            category: gplay.category[category],
            collection: gplay.collection[collection],
            num: parseInt(numApps),
            lang: language,
            country: country
        });

        const appDetails = await Promise.all(topApps.map(app => getAppDetail(app.appId, language, country)));

        const excelData = topApps.map((app, i) => ({
            Title: app.title,
            URL: app.url,
            Installs: appDetails[i].installs,
            Version: appDetails[i].version,
            AndroidVersion: appDetails[i].androidVersion,
            Updated: appDetails[i].updated,
            appID: app.appId
        }));

        const excelBuffer = generateExcel(excelData);

        const fileName = `top_apps_${Date.now()}.xlsx`;
        const filePath = path.join(__dirname, "downloads", fileName);
        fs.writeFileSync(filePath, excelBuffer);

        // Set response headers to trigger a download
        res.json({
            success: true,
            message: "File generated successfully",
            appData: appDetails,
            downloadLink: `/download-file/${fileName}`
        });

    } catch (error) {
        console.error("Error generating Excel file:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

async function getAppDetail(appID, lang, country) {
    return gplay.app({ 
        appId: appID,
        lang: lang,
        country: country
     });
}

function generateExcel(data) {
    const ws = xl.utils.json_to_sheet(data);

    const range = xl.utils.decode_range(ws['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) { 
        const cellRef = xl.utils.encode_cell({ r: row, c: 5 });
        if (ws[cellRef] && typeof ws[cellRef].v === "number") {
            const unixTimestamp = ws[cellRef].v;
            
            // Convert to Excel's date format
            const excelDate = (unixTimestamp / 86400000) + 25569; 
            
            ws[cellRef].v = excelDate;  // Update cell value
            ws[cellRef].t = "n";        // Set cell type to number (date format in Excel)
            ws[cellRef].z = "yyyy-mm-dd"; // Apply Excel date format
        }
    }

    const wb = xl.utils.book_new();
    xl.utils.book_append_sheet(wb, ws, 'Top Apps');

    return xl.write(wb, {bookType: 'xlsx', type: 'buffer'});    
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
