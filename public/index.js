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

document.getElementById('appForm').addEventListener('submit', function(event) {
    event.preventDefault();
    submitForm();
});

async function submitForm() {
    const category = document.getElementById('category').value;
    const collection = document.getElementById('collection').value;
    const numApps = document.getElementById('numapps').value;

    const formData = { category, collection, numApps };

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

createAllCategories();