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

const languageCodes = [
    "aa", "ab", "af", "ak", "sq", "am", "an", "ar", "hy", "as", "av", "ae", "ay", "az", "bm", "bn", "bh", "bi", "bs", "br", "bg", "my", "ca", "ch", "ce", "ny", "zh", "cv", "kw", "co", "cr", "hr", "cs", "da", "dv", "nl", "dz", "en", "eo", "et", "ee", "fo", "fj", "fi", "fr", "ff", "de", "ga", "gl", "gv", "ka", "de", "el", "gu", "ht", "ha", "he", "hi", "ho", "hu", "hy", "is", "ia", "id", "iu", "ga", "it", "ja", "jw", "kn", "km", "ko", "la", "lv", "lt", "lb", "mk", "ml", "mr", "mi", "mr", "ms", "mt", "my", "ne", "no", "pl", "ps", "pt", "qu", "ro", "ru", "sr", "si", "sk", "sl", "es", "su", "sw", "sv", "tl", "tg", "ta", "te", "th", "tr", "uk", "ur", "vi", "cy", "xh", "yi", "zu"
];

const countryCodes = [
    "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AR", "AS", "AT", "AU", "AW", "AX", "AZ", "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ", "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN", "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH", "ER", "ES", "ET", "FI", "FJ", "FM", "FO", "FR", "GA", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GT", "GU", "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS", "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB", "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML", "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF", "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN", "PR", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TC", "TD", "TF", "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TZ", "UA", "UG", "US", "UY", "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "YE", "YT", "ZA", "ZM", "ZW"
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