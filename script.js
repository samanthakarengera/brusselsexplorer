// =====================================================
// Brussels Explorer - script.js
// Data van de API: Parcs et Jardins Publics (Open Data Brussels)
// API link: https://opendata.brussels.be/explore/dataset/parcs_et_jardins_publics/api/
// =====================================================

// 1️⃣ API URL (20 records ophalen)
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20";

// 2️⃣ Globale variabele om data tijdelijk op te slaan
let data = [];

// =====================================================
// 3️⃣ DATA OPHALEN VAN DE API
// async/await wordt hier gebruikt omdat fetch een Promise teruggeeft
// =====================================================
async function fetchData() {
    try {
        const response = await fetch(API_URL); // oproep naar API
        const result = await response.json();  // omzetten naar JSON
        
        // result.results bevat alle records, elk record heeft een 'fields' object
        data = result.results; 
        
        console.log("API data geladen:", data); // handig voor debuggen
        
        displayData(data); // tonen van de kaarten
    } catch (error) {
        console.error("Fout bij ophalen data:", error);
    }
}

// =====================================================
// 4️⃣ DATA TONEN ALS KAARTEN
// =====================================================
function displayData(items) {
    const container = document.getElementById("results"); 
    container.innerHTML = ""; // eerst leegmaken

    items.forEach(item => {
        const park = item.fields; // 🔑 de API data zit in 'fields'

        // Maak een kaart voor elk park
        const div = document.createElement("div"); 
        div.classList.add("card"); 

        // innerHTML met template literals
        div.innerHTML = `
            <!-- Afbeelding (fake via Unsplash) -->
            <img src="https://source.unsplash.com/300x200/?park" alt="Afbeelding van ${park.nom_du_parc || 'park'}">

            <!-- Parknaam -->
            <h3>${park.nom_du_parc || "Geen naam"}</h3>

            <!-- Adres -->
            <p><strong>Adres:</strong> ${park.adresse || "Geen adres"}</p>

            <!-- Gemeente -->
            <p><strong>Gemeente:</strong> ${park.commune || "Onbekend"}</p>

            <!-- Oppervlakte (extra veld) -->
            <p><strong>Oppervlakte:</strong> ${park.superficie || "Onbekend"} m²</p>

            <!-- Favoriet knop -->
            <button onclick="addFavorite('${park.nom_du_parc}')">Opslaan</button>
        `;

        container.appendChild(div); // toevoegen aan de pagina
    });
}

// =====================================================
// 5️⃣ FILTER + ZOEK FUNCTIONALITEIT
// =====================================================
function filterData() {
    const search = document.getElementById("search").value.toLowerCase();
    const gemeente = document.getElementById("gemeente").value.toLowerCase();

    // Filter over data, let op: veldnamen zitten in 'fields'
    const filtered = data.filter(item => {
        const park = item.fields;
        return (park.nom_du_parc || "").toLowerCase().includes(search) &&
               (park.commune || "").toLowerCase().includes(gemeente);
    });

    displayData(filtered); // toon gefilterde resultaten
}

// =====================================================
// 6️⃣ SORTEREN A-Z OP NAAM
// =====================================================
document.getElementById("sort").addEventListener("click", () => {
    // Kopie van data maken met spread (...) en sorteren
    const sorted = [...data].sort((a, b) => 
        (a.fields.nom_du_parc || "").localeCompare(b.fields.nom_du_parc || "")
    );

    displayData(sorted); // tonen van gesorteerde resultaten
});

// =====================================================
// 7️⃣ FAVORIETEN OPSLAAN (localStorage)
// =====================================================
function addFavorite(name) {
    let favs = JSON.parse(localStorage.getItem("favs")) || []; // ophalen uit localStorage

    if (!favs.includes(name)) {
        favs.push(name); // toevoegen aan lijst
    }

    localStorage.setItem("favs", JSON.stringify(favs)); // opslaan
    showFavorites(); // meteen tonen
}

// =====================================================
// 8️⃣ FAVORIETEN TONEN
// =====================================================
function showFavorites() {
    const list = document.getElementById("favorites");
    list.innerHTML = ""; // eerst leegmaken

    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    favs.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;
        list.appendChild(li);
    });
}

// =====================================================
// 9️⃣ EVENTS KOPPELEN
// =====================================================
document.getElementById("search").addEventListener("input", filterData);
document.getElementById("gemeente").addEventListener("input", filterData);

// =====================================================
// 🔟 START DE APP
// =====================================================
fetchData(); // haal data op en toon
showFavorites(); // toon opgeslagen favorieten