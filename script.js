// URL van JSON bestand API
const apiUrl = "parcs.json";

// DOM elementen selecteren 
const kaartenContainer = document.getElementById("kaartenContainer"); // Grid voor kaarten
const zoekInput = document.getElementById("zoekInput"); // Zoekbalk input
const filterOpties = document.getElementById("filterOpties"); // Dropdown filter
const sorteerOpties = document.getElementById("sorteerOpties"); // Dropdown sorteer
const weergave = document.getElementById("weergave"); // Dropdown voor alles/favorieten
const favorietenContainer = document.getElementById("favorietenContainer"); // Favorieten lijst

// Data arrays
let locaties = []; // Alle locaties
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || []; // Favorieten ophalen of leeg

// Asynchrone functie om data op te halen (async/await + fetch + promises)
async function haalDataOp() {
    const res = await fetch(apiUrl); // Fetch van JSON bestand
    const data = await res.json(); // JSON omzetten naar objecten

    // Iteratie over JSON array en array methodes (.map)
    locaties = data.map(item => ({
        naam: item.name_nl || "", // Naam van park
        postcode: item.postalcode, // Postcode
        gemeente: item.municipality_nl, // Gemeente
        grootte: item.type_txt, // Grootte van park
        lat: item.geo_point_2d?.lat, // Latitude (optioneel chaining)
        lon: item.geo_point_2d?.lon, // Longitude
        foto: "https://source.unsplash.com/300x150/?park" // Placeholder afbeelding
    }));

    vulFilter(); // Callback functie om filter te vullen
    updateWeergave(); // Toon kaarten
}

// Filter dropdown vullen met unieke postcodes + favorieten
function vulFilter() {
    const postcodes = [...new Set(locaties.map(l => l.postcode))]; // Unieke postcodes via set

    // Favorieten optie toevoegen
    const fav = document.createElement("option");
    fav.value = "favorieten";
    fav.textContent = "⭐ Favorieten";
    filterOpties.appendChild(fav);

    // Postcode opties toevoegen
    postcodes.forEach(pc => {
        const option = document.createElement("option");
        option.value = pc;
        option.textContent = "Postcode " + pc;
        filterOpties.appendChild(option);
    });
}

// Centrale functie: zoek + filter + sorteer
function updateWeergave() {
    let lijst = [...locaties]; // Kopie van originele array

    // Zoekfunctie (startsWith voor begin van naam)
    const zoek = zoekInput.value.toLowerCase().trim(); // Kleine letters + trim
    if (zoek !== "") {
        lijst = lijst.filter(l => (l.naam || "").toLowerCase().trim().startsWith(zoek));
    }

    // Filteren
    if (filterOpties.value === "favorieten") { // Favorieten filter
        lijst = lijst.filter(l => favorieten.includes(l.naam));
    } else if (filterOpties.value !== "alles") { // Postcode filter
        lijst = lijst.filter(l => l.postcode == filterOpties.value);
    }

    // Sorteren
    if (sorteerOpties.value === "alfabet") { // Alfabetisch
        lijst.sort((a, b) => a.naam.localeCompare(b.naam)); // Arrow function + localeCompare
    }
    if (sorteerOpties.value === "klein") { // Klein naar groot
        lijst.sort((a, b) => a.grootte.localeCompare(b.grootte));
    }
    if (sorteerOpties.value === "groot") { // Groot naar klein
        lijst.sort((a, b) => b.grootte.localeCompare(a.grootte));
    }

    toonKaarten(lijst); // Callback functie om kaarten te tonen
}

// Kaarten tonen op pagina
function toonKaarten(data) {
    kaartenContainer.innerHTML = ""; // Oude kaarten leegmaken

    data.forEach(loc => { // Itereren over array
        const div = document.createElement("div"); // Nieuw element
        div.className = "kaart"; // CSS class

        // Template literals
        div.innerHTML = `
            <img src="${loc.foto}">
            <div class="inhoud">
                <h3>${loc.naam}</h3>
                <p>Postcode: ${loc.postcode}</p>
                <p>Gemeente: ${loc.gemeente}</p>
                <p>Grootte: ${loc.grootte}</p>
                <p>Coord.: ${loc.lat}, ${loc.lon}</p>
                <button>${favorieten.includes(loc.naam) ? "Verwijder" : "Favoriet"}</button> <!-- Ternary operator -->
            </div>
        `;

        // Event listener voor favoriet knop (callback function)
        const knop = div.querySelector("button");
        knop.addEventListener("click", () => { toggleFavoriet(loc.naam); });

        kaartenContainer.appendChild(div); // Element toevoegen aan DOM
    });
}

// Favorieten toggle functie
function toggleFavoriet(naam) {
    // Conditional ternary style via if
    if (favorieten.includes(naam)) {
        favorieten = favorieten.filter(f => f !== naam); // Array methode filter
    } else {
        favorieten.push(naam); // Push naar array
    }

    // LocalStorage opslaan
    localStorage.setItem("favorieten", JSON.stringify(favorieten));

    updateWeergave(); // Kaarten updaten
    toonFavorieten(); // Favorieten updaten
}

// Favorieten lijst tonen
function toonFavorieten() {
    favorietenContainer.innerHTML = ""; // Oude items verwijderen
    const lijst = locaties.filter(l => favorieten.includes(l.naam)); // Filteren array

    lijst.forEach(loc => {
        const div = document.createElement("div");
        div.className = "favItem";
        div.innerHTML = `
            <span>${loc.naam}</span>
            <button>❌</button>
        `;
        div.querySelector("button").addEventListener("click", () => { toggleFavoriet(loc.naam); }); // Callback
        favorietenContainer.appendChild(div); // Toevoegen
    });
}

// Events koppelen
zoekInput.addEventListener("input", updateWeergave); // Zoek event
filterOpties.addEventListener("change", updateWeergave); // Filter event
sorteerOpties.addEventListener("change", updateWeergave); // Sort event
weergave.addEventListener("change", () => { // Weergave event
    if (weergave.value === "favorieten") {
        kaartenContainer.innerHTML = "";
        toonFavorieten();
    } else {
        favorietenContainer.innerHTML = "";
        updateWeergave();
    }
});

// Start app
haalDataOp(); // Async functie oproepen