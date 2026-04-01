const API_URL = "https://opendata.brussels.be/api/explore/v2.1/catalog/datasets/brussels-parks/records?limit=20";

let data = [];

// DATA ophalen
async function fetchData() {
    const response = await fetch(API_URL);
    const result = await response.json();

    data = result.results;
    showData(data);
}

// DATA tonen
function showData(items) {
    const list = document.getElementById("list");
    list.innerHTML = "";

    items.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${item.name || "Geen naam"}</h3>
            <p>${item.address || "Geen adres"}</p>
            <button onclick="addFavorite('${item.name}')">⭐</button>
        `;

        list.appendChild(div);
    });
}

// Zoekfunctie
document.getElementById("search").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    const filtered = data.filter(item =>
        (item.name || "").toLowerCase().includes(value)
    );

    showData(filtered);
});

// Favorieten opslaan
function addFavorite(name) {
    let favs = JSON.parse(localStorage.getItem("favs")) || [];

    favs.push(name);

    localStorage.setItem("favs", JSON.stringify(favs));

    alert("Toegevoegd aan favorieten!");
}

// Start
fetchData();