export const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "Chinese" },
    { code: "aa", name: "Afar" },
    { code: "ab", name: "Abkhazian" },
    { code: "af", name: "Afrikaans" },
    { code: "ak", name: "Akan" },
    { code: "sq", name: "Albanian" },
    { code: "am", name: "Amharic" },
    { code: "ar", name: "Arabic" },
    { code: "hy", name: "Armenian" },
    { code: "as", name: "Assamese" },
    { code: "az", name: "Azerbaijani" },
    { code: "bm", name: "Bambara" },
    { code: "eu", name: "Basque" },
    { code: "be", name: "Belarusian" },
    { code: "bn", name: "Bengali" },
    { code: "bs", name: "Bosnian" },
    { code: "bg", name: "Bulgarian" },
    { code: "my", name: "Burmese" },
    { code: "ca", name: "Catalan" },
    { code: "hr", name: "Croatian" },
    { code: "cs", name: "Czech" },
    { code: "da", name: "Danish" },
    { code: "nl", name: "Dutch" },
    { code: "eo", name: "Esperanto" },
    { code: "et", name: "Estonian" },
    { code: "fi", name: "Finnish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "el", name: "Greek" },
    { code: "gu", name: "Gujarati" },
    { code: "he", name: "Hebrew" },
    { code: "hi", name: "Hindi" },
    { code: "hu", name: "Hungarian" },
    { code: "is", name: "Icelandic" },
    { code: "id", name: "Indonesian" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "kn", name: "Kannada" },
    { code: "ko", name: "Korean" },
    { code: "lv", name: "Latvian" },
    { code: "lt", name: "Lithuanian" },
    { code: "mk", name: "Macedonian" },
    { code: "ml", name: "Malayalam" },
    { code: "ms", name: "Malay" },
    { code: "mr", name: "Marathi" },
    { code: "ne", name: "Nepali" },
    { code: "no", name: "Norwegian" },
    { code: "fa", name: "Persian" },
    { code: "pl", name: "Polish" },
    { code: "pt", name: "Portuguese" },
    { code: "ro", name: "Romanian" },
    { code: "ru", name: "Russian" },
    { code: "sr", name: "Serbian" },
    { code: "sk", name: "Slovak" },
    { code: "sl", name: "Slovenian" },
    { code: "es", name: "Spanish" },
    { code: "sv", name: "Swedish" },
    { code: "ta", name: "Tamil" },
    { code: "te", name: "Telugu" },
    { code: "th", name: "Thai" },
    { code: "tr", name: "Turkish" },
    { code: "uk", name: "Ukrainian" },
    { code: "ur", name: "Urdu" },
    { code: "vi", name: "Vietnamese" },
    { code: "cy", name: "Welsh" },
    { code: "xh", name: "Xhosa" },
    { code: "yi", name: "Yiddish" },
    { code: "zu", name: "Zulu" }
];

export const countries = [
    { code: "US", name: "United States" },
    { code: "GB", name: "United Kingdom" },
    { code: "CA", name: "Canada" },
    { code: "AU", name: "Australia" },
    { code: "IN", name: "India" },
    { code: "ZA", name: "South Africa" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
    { code: "IT", name: "Italy" },
    { code: "ES", name: "Spain" },
    { code: "BR", name: "Brazil" },
    { code: "MX", name: "Mexico" },
    { code: "RU", name: "Russia" },
    { code: "CN", name: "China" },
    { code: "JP", name: "Japan" },
    { code: "KR", name: "South Korea" },
    { code: "NL", name: "Netherlands" },
    { code: "SE", name: "Sweden" },
    { code: "NO", name: "Norway" },
    { code: "FI", name: "Finland" },
    { code: "DK", name: "Denmark" },
    { code: "IE", name: "Ireland" },
    { code: "NZ", name: "New Zealand" },
    { code: "SG", name: "Singapore" },
    { code: "MY", name: "Malaysia" },
    { code: "PH", name: "Philippines" },
    { code: "TH", name: "Thailand" },
    { code: "VN", name: "Vietnam" },
    { code: "ID", name: "Indonesia" },
    { code: "PK", name: "Pakistan" },
    { code: "SA", name: "Saudi Arabia" },
    { code: "AE", name: "United Arab Emirates" },
    { code: "EG", name: "Egypt" },
    { code: "NG", name: "Nigeria" },
    { code: "KE", name: "Kenya" },
    { code: "AR", name: "Argentina" },
    { code: "CL", name: "Chile" },
    { code: "CO", name: "Colombia" },
    { code: "PE", name: "Peru" },
    { code: "VE", name: "Venezuela" },
    { code: "CH", name: "Switzerland" },
    { code: "BE", name: "Belgium" },
    { code: "AT", name: "Austria" },
    { code: "PT", name: "Portugal" },
    { code: "GR", name: "Greece" },
    { code: "PL", name: "Poland" },
    { code: "CZ", name: "Czech Republic" },
    { code: "HU", name: "Hungary" },
    { code: "RO", name: "Romania" },
    { code: "BG", name: "Bulgaria" },
    { code: "TR", name: "Turkey" },
    { code: "UA", name: "Ukraine" },
    { code: "IL", name: "Israel" },
    { code: "HK", name: "Hong Kong" },
    { code: "TW", name: "Taiwan" },
    { code: "BD", name: "Bangladesh" },
    { code: "LK", name: "Sri Lanka" },
    { code: "NP", name: "Nepal" },
    { code: "MM", name: "Myanmar" }
];

const appSearchBar = document.getElementById('app-search-bar');

appSearchBar.addEventListener('search', function(event) {
    event.preventDefault();
    const appDetailContainer = document.querySelector('.app-detail-container');
    appDetailContainer.innerHTML = '';
    submitSearch();
})

async function submitSearch(){
    const searchData = getSearchData();

    try{
        const res = await fetch( '/search',{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchData)
        });

        if(!res.ok){
            throw new Error('Failed to search for app');
        }

        const searchResult = await res.json();
        console.log('Search Results: '+ searchResult)

        const appDetailContainer = document.querySelector('.app-detail-container');
        searchResult.map(app => {
            appDetailContainer.innerHTML += createAppDetailElement(app);
            console.log(app.title);
        })
        // pop all the results here

    } catch (error){
        console.log('Error searching for app: ', error);
        return null;
    }
}

function createAppDetailElement(appDetail){
    const timeStamp = new Date(appDetail.updated);
    const appUpdate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    }).format(timeStamp);

    return `
        <article class="app-detail">
        <h1>${appDetail.title}</h1>
        <section class="details-container-head">
            <img src="${appDetail.icon}" alt="app icon" class="app-icon">
            <div class="lvl-1-detail-info">
                <p>Version: <span>${appDetail.version}</span></p>
                <p>Updated: <span>${appUpdate}</span></p>
                <p>App ID: <span>${appDetail.appId}</span></p>
                <p>App Page: <a href="${appDetail.url}" target="_blank">Link</a></p>
            </div>
        </section>
        <section class="details-container">
            <h2>Installs</h2>
            <p>installs: <span>${appDetail.installs}</span></p>
            <p>minimum installs: <span>${appDetail.minInstalls}</span></p>
            <p>maximum installs: <span>${appDetail.maxInstalls}</span></p>
        </section>
        <section class="details-container">
            <h2>Ratings & Reviews</h2>
            <p>score: <span>${appDetail.scoreText}</span></p>
            <p>ratings: <span>${appDetail.ratings}</span></p>
            <p>reviews: <span>${appDetail.rerviews}</span></p>
        </section>
        <section class="details-container">
            <h2>Developer Details</h2>
            <p>developer: <span>${appDetail.developer}</span></p>
            <p>developer ID: <span>${appDetail.developerId}</span></p>
            <p>developer email: <span>${appDetail.developerEmail}</span></p>
            <p>developer website: <a href="${appDetail.developerWebsite}" target="_blank">Website</a></p>
            <p>developer address: <span>${appDetail.developerAddress}</span></p>
            <p>developer legal name: <span>${appDetail.developerLegalName}</span></p>
            <p>developer legal email: <span>${appDetail.developerLegalEmail}</span></p>
            <p>developer legal address: <span>${appDetail.developerLegalAddress}</span></p>
            <p>developer legal phone number: <span>${appDetail.developerLegalPhoneNumber}</span></p>
            <p>developer internal ID: <span>${appDetail.developerInternalID}</span></p>
        </section>
        <section class="details-container">
            <h2>App Details</h2>
            <p>version: <span>${appDetail.version}</span></p>
            <p>updated: <span>${appUpdate}</span></p>
            <p>recent changes: <span>${appDetail.recentChanges}</span></p>
            <p>app ID: <span>${appDetail.appId}</span></p>
            <p>app page: <a href="${appDetail.url}" target="_blank">Link</a></p>
        </section>
    </article>
    `
}

function getSearchData(){
    const searchValue = document.getElementById('app-search-bar').value;
    const language = document.getElementById('language').value;
    const country = document.getElementById('country').value;

    return { searchValue, language, country };
}

function createAllLanguages(){
    const langugeSelect = document.getElementById('language');

    languages.map(language => {
        const display = language.name;

        const option = `
            <option value="${language.code}">${display}</option>
        `

        langugeSelect.innerHTML += option;
    })
}

function createAllCountries(){
    const countrySelect = document.getElementById('country');

    countries.map(country => {
        const option = `
            <option value="${country.code}">${country.name}</option>
        `

        countrySelect.innerHTML += option;
    })    
}

createAllCountries();
createAllLanguages();