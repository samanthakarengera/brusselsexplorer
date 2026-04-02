const apiUrl = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/parcs_et_jardins_publics/records?limit=20";
const locationsContainer = document.getElementById("locationsContainer");
const searchInput = document.getElementById("searchInput");
const filterType = document.getElementById("filterType");

let locations = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// Fetch data
async function fetchLocations() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        locations = data.records.map(record => record.fields);
        populateFilter();
        displayLocations(locations);
    } catch (error) {
        console.error("Fout bij ophalen data:", error);
    }
}

// Display locations
function displayLocations(data) {
    locationsContainer.innerHTML = "";
    data.forEach(loc => {
        const card = document.createElement("div");
        card.className = "location-card";
        card.innerHTML = `
            <h3>${loc.name}</h3>
            <p>Type: ${loc.type || "Onbekend"}</p>
            <p>Adres: ${loc.address || "Onbekend"}</p>
            <p>Gemeente: ${loc.city || "Onbekend"}</p>
            <p>Telefoon: ${loc.phone || "Niet beschikbaar"}</p>
            <p><button class="fav-btn">${favorites.includes(loc.name) ? "Verwijder uit favorieten" : "Voeg toe aan favorieten"}</button></p>
        `;
        const favBtn = card.querySelector(".fav-btn");
        favBtn.addEventListener("click", () => toggleFavorite(loc.name, favBtn));
        locationsContainer.appendChild(card);
    });
}

// Populate filter dropdown
function populateFilter() {
    const types = [...new Set(locations.map(loc => loc.type).filter(Boolean))];
    types.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        filterType.appendChild(option);
    });
}

// Filter function
filterType.addEventListener("change", () => {
    const selected = filterType.value;
    const filtered = selected === "all" ? locations : locations.filter(loc => loc.type === selected);
    displayLocations(filtered);
});

// Search function
searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filtered = locations.filter(loc => loc.name.toLowerCase().includes(query));
    displayLocations(filtered);
});

// Favorites toggle
function toggleFavorite(name, button) {
    if (favorites.includes(name)) {
        favorites = favorites.filter(fav => fav !== name);
        button.textContent = "Voeg toe aan favorieten";
    } else {
        favorites.push(name);
        button.textContent = "Verwijder uit favorieten";
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
}

fetchLocations();