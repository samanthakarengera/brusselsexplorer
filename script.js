const apiUrl = "parcs.json";

// DOM
const kaartenContainer = document.getElementById("kaartenContainer");
const zoekInput = document.getElementById("zoekInput");
const filterOpties = document.getElementById("filterOpties");
const sorteerOpties = document.getElementById("sorteerOpties");
const weergave = document.getElementById("weergave");
const favorietenContainer = document.getElementById("favorietenContainer");

let locaties = [];
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || [];

// data ophalen
async function haalDataOp() {
    const res = await fetch(apiUrl);
    const data = await res.json();

    locaties = data.map(item => ({
        naam: item.name_nl || "",
        postcode: item.postalcode,
        gemeente: item.municipality_nl,
        grootte: item.type_txt,
        lat: item.geo_point_2d?.lat,
        lon: item.geo_point_2d?.lon,
        foto: "https://source.unsplash.com/300x150/?park"
    }));

    vulFilter();
    updateWeergave();
}

// filter vullen
function vulFilter() {
    const postcodes = [...new Set(locaties.map(l => l.postcode))];

    const fav = document.createElement("option");
    fav.value = "favorieten";
    fav.textContent = "⭐ Favorieten";
    filterOpties.appendChild(fav);

    postcodes.forEach(pc => {
        const option = document.createElement("option");
        option.value = pc;
        option.textContent = "Postcode " + pc;
        filterOpties.appendChild(option);
    });
}

// 🔥 centrale functie
function updateWeergave() {
    let lijst = [...locaties];

    // 🔥 FIX zoekfunctie
    const zoek = zoekInput.value.toLowerCase().trim();

    if (zoek !== "") {
        lijst = lijst.filter(l =>
            (l.naam || "").toLowerCase().trim().startsWith(zoek)
        );
    }

    // filter
    if (filterOpties.value === "favorieten") {
        lijst = lijst.filter(l => favorieten.includes(l.naam));
    } else if (filterOpties.value !== "alles") {
        lijst = lijst.filter(l => l.postcode == filterOpties.value);
    }

    // 🔥 FIX alfabetisch
    if (sorteerOpties.value === "alfabet") {
        lijst.sort((a, b) => a.naam.localeCompare(b.naam));
    }

    if (sorteerOpties.value === "klein") {
        lijst.sort((a, b) => a.grootte.localeCompare(b.grootte));
    }

    if (sorteerOpties.value === "groot") {
        lijst.sort((a, b) => b.grootte.localeCompare(a.grootte));
    }

    toonKaarten(lijst);
}

// kaarten tonen
function toonKaarten(data) {
    kaartenContainer.innerHTML = "";

    data.forEach(loc => {
        const div = document.createElement("div");
        div.className = "kaart";

        div.innerHTML = `
            <img src="${loc.foto}">
            <div class="inhoud">
                <h3>${loc.naam}</h3>
                <p>Postcode: ${loc.postcode}</p>
                <p>Gemeente: ${loc.gemeente}</p>
                <p>Grootte: ${loc.grootte}</p>
                <p>Coord.: ${loc.lat}, ${loc.lon}</p>
                <button>${favorieten.includes(loc.naam) ? "Verwijder" : "Favoriet"}</button>
            </div>
        `;

        const knop = div.querySelector("button");

        knop.addEventListener("click", () => {
            toggleFavoriet(loc.naam);
        });

        kaartenContainer.appendChild(div);
    });
}

// 🔥 FIX: geen refresh bug meer
function toggleFavoriet(naam) {
    if (favorieten.includes(naam)) {
        favorieten = favorieten.filter(f => f !== naam);
    } else {
        favorieten.push(naam);
    }

    localStorage.setItem("favorieten", JSON.stringify(favorieten));

    updateWeergave(); // geen page reset
    toonFavorieten();
}

// favorieten lijst
function toonFavorieten() {
    favorietenContainer.innerHTML = "";

    const lijst = locaties.filter(l => favorieten.includes(l.naam));

    lijst.forEach(loc => {
        const div = document.createElement("div");
        div.className = "favItem";

        div.innerHTML = `
            <span>${loc.naam}</span>
            <button>❌</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            toggleFavoriet(loc.naam);
        });

        favorietenContainer.appendChild(div);
    });
}

// events
zoekInput.addEventListener("input", updateWeergave);
filterOpties.addEventListener("change", updateWeergave);
sorteerOpties.addEventListener("change", updateWeergave);

// view switch
weergave.addEventListener("change", () => {
    if (weergave.value === "favorieten") {
        kaartenContainer.innerHTML = "";
        toonFavorieten();
    } else {
        favorietenContainer.innerHTML = "";
        updateWeergave();
    }
});

// start
haalDataOp();