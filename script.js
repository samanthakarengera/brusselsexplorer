// json bestand
const apiUrl = "parcs.json";

// DOM elementen
const container = document.getElementById("kaartenContainer");
const zoekInput = document.getElementById("zoekInput");
const filterOpties = document.getElementById("filterOpties");
const sorteerOpties = document.getElementById("sorteerOpties");

// arrays
let locaties = [];
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || [];

// data ophalen
async function haalDataOp() {
    const res = await fetch(apiUrl); // fetch json
    const data = await res.json(); // json naar object

    // data omzetten
    locaties = data.map(item => ({
        naam: item.name_nl,
        postcode: item.postalcode,
        gemeente: item.municipality_nl,
        grootte: item.type_txt,
        lat: item.geo_point_2d?.lat,
        lon: item.geo_point_2d?.lon
    }));

    vulFilter();
    update();
}

// filter vullen
function vulFilter() {
    const pcs = [...new Set(locaties.map(l => l.postcode))];

    pcs.forEach(pc => {
        const opt = document.createElement("option");
        opt.value = pc;
        opt.textContent = "Postcode " + pc;
        filterOpties.appendChild(opt);
    });
}

// centrale functie
function update() {
    let lijst = [...locaties];

    // zoeken
    const zoek = zoekInput.value.toLowerCase().trim();
    if (zoek !== "") {
        lijst = lijst.filter(l => l.naam.toLowerCase().startsWith(zoek));
    }

    // filter
    if (filterOpties.value !== "alles") {
        lijst = lijst.filter(l => l.postcode == filterOpties.value);
    }

    // sorteren
    if (sorteerOpties.value === "alfabet") {
        lijst.sort((a, b) => a.naam.localeCompare(b.naam));
    }

    if (sorteerOpties.value === "klein") {
        lijst.sort((a, b) => a.grootte.localeCompare(b.grootte));
    }

    if (sorteerOpties.value === "groot") {
        lijst.sort((a, b) => b.grootte.localeCompare(a.grootte));
    }

    toon(lijst);
}

// tonen
function toon(data) {
    container.innerHTML = "";

    data.forEach(loc => {
        const div = document.createElement("div");
        div.className = "kaart";

        div.innerHTML = `
            <h3>${loc.naam}</h3>
            <p>Postcode: ${loc.postcode}</p>
            <p>Gemeente: ${loc.gemeente}</p>
            <p>Grootte: ${loc.grootte}</p>
            <p>Coord.: ${loc.lat}, ${loc.lon}</p>
            <button>${favorieten.includes(loc.naam) ? "Verwijder" : "Favoriet"}</button>
        `;

        div.querySelector("button").addEventListener("click", () => {
            toggleFavoriet(loc.naam);
        });

        container.appendChild(div);
    });
}

// favorieten toggle
function toggleFavoriet(naam) {
    if (favorieten.includes(naam)) {
        favorieten = favorieten.filter(f => f !== naam);
    } else {
        favorieten.push(naam);
    }

    localStorage.setItem("favorieten", JSON.stringify(favorieten));
    update();
}

// events
zoekInput.addEventListener("input", update);
filterOpties.addEventListener("change", update);
sorteerOpties.addEventListener("change", update);

// start
haalDataOp();