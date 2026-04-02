// API van jouw gekozen dataset
const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20";

// globale variabele om data te bewaren
let data = [];


// DATA OPHALEN
async function fetchData() {
    const response = await fetch(API_URL); // API oproep
    const result = await response.json(); // JSON maken

    data = result.results; // data opslaan

    displayData(data); // tonen
}


// DATA TONEN ALS KAARTEN
function displayData(items) {
    const container = document.getElementById("results"); // selecteer html
    container.innerHTML = ""; // leegmaken

    items.forEach(item => { // loop door data

        const div = document.createElement("div"); // kaart maken
        div.classList.add("card"); // class toevoegen

        div.innerHTML = `
            <img src="https://source.unsplash.com/300x200/?park" /> 
            <!-- fake afbeelding -->

            <h3>${item.nom || "Geen naam"}</h3> 
            <!-- naam -->

            <p>${item.adresse || "Geen adres"}</p> 
            <!-- adres -->

            <p>${item.commune || "Onbekend"}</p> 
            <!-- gemeente -->

            <button onclick="addFavorite('${item.nom}')">Opslaan</button>
            <!-- favoriet knop -->
        `;

        container.appendChild(div); // toevoegen
    });
}


// ZOEK + FILTER
function filterData() {
    const search = document.getElementById("search").value.toLowerCase(); // input
    const gemeente = document.getElementById("gemeente").value.toLowerCase(); // input

    const filtered = data.filter(item => { // filter functie

        return (item.nom || "").toLowerCase().includes(search) &&
               (item.commune || "").toLowerCase().includes(gemeente);
    });

    displayData(filtered); // opnieuw tonen
}


// SORTEREN
document.getElementById("sort").addEventListener("click", () => {

    const sorted = [...data].sort((a, b) => 
        (a.nom || "").localeCompare(b.nom || "")
    );

    displayData(sorted);
});


// FAVORIETEN OPSLAAN
function addFavorite(name) {
    let favs = JSON.parse(localStorage.getItem("favs")) || []; // ophalen

    if (!favs.includes(name)) {
        favs.push(name); // toevoegen
    }

    localStorage.setItem("favs", JSON.stringify(favs)); // opslaan

    showFavorites(); // tonen
}


// FAVORIETEN TONEN
function showFavorites() {
    const list = document.getElementById("favorites");
    list.innerHTML = "";

    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    favs.forEach(f => {
        const li = document.createElement("li");
        li.textContent = f;

        list.appendChild(li);
    });
}


// EVENTS (interactie)
document.getElementById("search").addEventListener("input", filterData);
document.getElementById("gemeente").addEventListener("input", filterData);


// START
fetchData();
showFavorites();