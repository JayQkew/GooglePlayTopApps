import express from 'express';
import cors from 'cors';
import gplay from "google-play-scraper";
import xl from 'xlsx';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post("/download", async (req, res) => {
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
                fullDetail: 'true'
            }
        );

        const excelData = topApps.map(app => ({
            Title: app.title,
            appID: app.appId,
            Version: app.version,
            Updated: app.updated,
            Installs: app.installs,
            URL: app.url
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

app.post('/search', async (req, res) => {
    try{
        const {searchValue, lang, country} = req.body;
        console.log("Searching: "+ searchValue);

        const searchResults = await gplay.search(
            {
                term: searchValue,
                lang: lang,
                country: country,
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

function generateExcel(data) {
    const ws = xl.utils.json_to_sheet(data);

    const range = xl.utils.decode_range(ws['!ref']);
    for (let row = range.s.r + 1; row <= range.e.r; row++) { 
        const cellRef = xl.utils.encode_cell({ r: row, c: 3 });
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
