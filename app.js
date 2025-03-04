import express from 'express';
import cors from 'cors';
import gplay from "google-play-scraper";
import xl from 'xlsx';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
                fullDetail: 'true'
            }
        );

        res.json(topApps);
    } catch (error) {
        
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
