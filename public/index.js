const allCategories = [
    'APPLICATION',
    'ANDROID_WEAR',
    'ART_AND_DESIGN',
    'AUTO_AND_VEHICLES',
    'BEAUTY',
    'BOOKS_AND_REFERENCE',
    'BUSINESS',
    'COMICS',
    'COMMUNICATION',
    'DATING',
    'EDUCATION',
    'ENTERTAINMENT',
    'EVENTS',
    'FINANCE',
    'FOOD_AND_DRINK',
    'HEALTH_AND_FITNESS',
    'HOUSE_AND_HOME',
    'LIBRARIES_AND_DEMO',
    'LIFESTYLE',
    'MAPS_AND_NAVIGATION',
    'MEDICAL',
    'MUSIC_AND_AUDIO',
    'NEWS_AND_MAGAZINES',
    'PARENTING',
    'PERSONALIZATION',
    'PHOTOGRAPHY',
    'PRODUCTIVITY',
    'SHOPPING',
    'SOCIAL',
    'SPORTS',
    'TOOLS',
    'TRAVEL_AND_LOCAL',
    'VIDEO_PLAYERS',
    'WATCH_FACE',
    'WEATHER',
    'GAME',
    'GAME_ACTION',
    'GAME_ADVENTURE',
    'GAME_ARCADE',
    'GAME_BOARD',
    'GAME_CARD',
    'GAME_CASINO',
    'GAME_CASUAL',
    'GAME_EDUCATIONAL',
    'GAME_MUSIC',
    'GAME_PUZZLE',
    'GAME_RACING',
    'GAME_ROLE_PLAYING',
    'GAME_SIMULATION',
    'GAME_SPORTS',
    'GAME_STRATEGY',
    'GAME_TRIVIA',
    'GAME_WORD',
    'FAMILY'
  ];

const languages = [
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

const countries = [
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



document.getElementById('appForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm();
});

async function submitForm() {
    const formData = getFormData();

    try {
        const res = await fetch("/download", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });

        if(!res.ok){
            throw new Error("Failed to download file");
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `top_apps_${Date.now()}.xlsx`
        document.querySelector('main').appendChild(a);
        a.click();

        URL.revokeObjectURL(url);

        console.log("Download started successfully")
    } catch (error) {
        console.error("Error submitting form:", error);
        return null;
    }
}

function createAllCategories(){
    const categorySelect = document.getElementById('category');

    allCategories.map(category => {
        const display = category.replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, (match) => match.toUpperCase())
            .replace(/\bAnd\b/g, '&');

        const option = `
            <option value="${category}">${display}</option>
        `

        categorySelect.innerHTML += option;
    });
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

function getFormData(){
    const category = document.getElementById('category').value;
    const collection = document.getElementById('collection').value;
    const numApps = document.getElementById('numapps').value;
    const language = document.getElementById('language').value;
    const country = document.getElementById('country').value;

    return { category, collection, numApps, language, country };
}

createAllCategories();
createAllLanguages();
createAllCountries();