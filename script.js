const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/brussels-parks/records?limit=20"; 
// const = constante waarde (modern JS) | API link

let allData = []; 
// array om data op te slaan

let map; 
// variabele voor kaart

// DATA OPHALEN
async function fetchData() { 
// async = wachten op API (modern JS)

    const response = await fetch(API_URL); 
    // fetch = API call | await = wachten | promise

    const data = await response.json(); 
    // JSON omzetten naar object

    allData = data.results; 
    // data opslaan in array

    showData(allData); 
    // functie oproepen (callback idee)

    initMap(allData); 
    // kaart maken

    loadFavorites(); 
    // localStorage laden
}


// DATA TONEN
function showData(items) { 
// functie met parameter

    displayTable(items); 
    // tabel tonen

    displayCards(items); 
    // cards tonen
}


// TABEL MAKEN
function displayTable(items) {

    const tableBody = document.getElementById("tableBody"); 
    // DOM selecteren

    tableBody.innerHTML = ""; 
    // DOM manipuleren (leegmaken)

    items.forEach(item => { 
    // iteratie over array

        const row = document.createElement("tr"); 
        // element maken

        row.innerHTML = ` 
            <td>${item.name || "-"}</td> 
            <!-- template literal | ternary -->
            <td>${item.address || "-"}</td>
            <td>${item.municipality || "-"}</td>
            <td>${item.type || "-"}</td>
            <td>${item.surface_area || "-"}</td>
            <td><button onclick="addFavorite('${item.name}')">+</button></td>
            <!-- event koppelen -->
        `;

        tableBody.appendChild(row); 
        // element toevoegen (DOM)
    });
}


// CARDS
function displayCards(items) {

    const container = document.getElementById("cards"); 
    // selecteren

    container.innerHTML = ""; 
    // leegmaken

    items.forEach(item => { 
    // loop

        const div = document.createElement("div"); 
        // element maken

        div.classList.add("card"); 
        // class toevoegen

        div.innerHTML = `
            <h3>${item.name}</h3> 
            <!-- template literal -->
            <p>${item.address || "-"}</p>
        `;

        container.appendChild(div); 
        // toevoegen
    });
}


// FILTER
function filterData() {

    const name = document.getElementById("searchName").value.toLowerCase(); 
    // input lezen | DOM

    const gemeente = document.getElementById("filterGemeente").value.toLowerCase(); 
    // tweede filter

    const filtered = allData.filter(item => { 
    // array methode filter

        return (item.name || "").toLowerCase().includes(name) &&
               (item.municipality || "").toLowerCase().includes(gemeente);
        // condition + includes
    });

    showData(filtered); 
    // callback / functie hergebruik
}


// SORTEREN
document.getElementById("sortAZ").addEventListener("click", () => { 
// event listener | arrow function

    const sorted = [...allData].sort((a, b) => 
    // kopie array | sort methode

        (a.name || "").localeCompare(b.name || "") 
        // vergelijken strings
    );

    showData(sorted); 
    // tonen
});


// FAVORIETEN TOEVOEGEN
function addFavorite(name) {

    let favs = JSON.parse(localStorage.getItem("favs")) || []; 
    // localStorage lezen | JSON parse

    if (!favs.includes(name)) { 
    // check (condition)

        favs.push(name); 
        // toevoegen aan array
    }

    localStorage.setItem("favs", JSON.stringify(favs)); 
    // opslaan in localStorage

    loadFavorites(); 
    // opnieuw tonen
}


// FAVORIETEN TONEN
function loadFavorites() {

    const list = document.getElementById("favoritesList"); 
    // DOM selecteren

    list.innerHTML = ""; 
    // leegmaken

    let favs = JSON.parse(localStorage.getItem("favs")) || []; 
    // ophalen

    favs.forEach(fav => { 
    // loop

        const li = document.createElement("li"); 
        // element

        li.textContent = fav; 
        // tekst toevoegen

        const btn = document.createElement("button"); 
        // knop maken

        btn.textContent = "x"; 
        // tekst

        btn.onclick = () => removeFavorite(fav); 
        // event + arrow function

        li.appendChild(btn); 
        // toevoegen

        list.appendChild(li); 
        // tonen
    });
}


// VERWIJDEREN
function removeFavorite(name) {

    let favs = JSON.parse(localStorage.getItem("favs")) || []; 
    // ophalen

    favs = favs.filter(f => f !== name); 
    // filter array

    localStorage.setItem("favs", JSON.stringify(favs)); 
    // opslaan

    loadFavorites(); 
    // refresh
}


// KAART (Leaflet)
function initMap(items) {

    map = L.map('map').setView([50.85, 4.35], 11); 
    // kaart maken

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); 
    // kaart tiles

    items.forEach(item => { 
    // loop

        if (item.geo_point_2d) { 
        // check locatie

            L.marker([
                item.geo_point_2d.lat,
                item.geo_point_2d.lon
            ])
            .addTo(map)
            .bindPopup(item.name); 
            // marker + popup
        }
    });
}


// EVENTS
document.getElementById("searchName").addEventListener("input", filterData); 
// event input

document.getElementById("filterGemeente").addEventListener("input", filterData); 
// event input


// START
fetchData(); 
// app starten