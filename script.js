// api bestand
const apiUrl = "parcs.json";

// alle HTML elementen die ik nodig heb
const container = document.getElementById("kaartenContainer"); 
const zoekInput = document.getElementById("zoekInput");
const filterOpties = document.getElementById("filterOpties"); 
const sorteerOpties = document.getElementById("sorteerOpties");

// aanmaak arrays 
let locaties = []; // alle parken 
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || []; // de favorieten uit localStorage anders gwn lege array

// data uit json 
async function haalDataOp() {

    const res = await fetch(apiUrl); // promise:fetch haalt het bestand op
    const data = await res.json();  // json -> js

    locaties = data.map(item => ({
        naam: item.name_nl, 
        postcode: item.postalcode, 
        gemeente: item.municipality_nl, 
        grootte: item.type_txt, 
        lat: item.geo_point_2d?.lat,
        lon: item.geo_point_2d?.lon 
    }));

    vulFilter(); //filter dropdown met postcodes
    update(); // nu zie je da
}

//de filter dropdown
function vulFilter() {

    // alle postcodes uniek maken
    const pcs = [...new Set(locaties.map(l => l.postcode))];
    // elke postcode aparte optie 
    pcs.forEach(pc => {
        const opt = document.createElement("option"); // nieuwe option
        opt.value = pc; // waarde
        opt.textContent = "Postcode " + pc; // tekst zichtbaar
        filterOpties.appendChild(opt); // toevoegen aan dropdown
    });
}

//(zoek + filter + sorteer)
function update() {

    let lijst = [...locaties]; 
    
    // zoek
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

    if (sorteerOpties.value === "klein") { // van klein naar groot 
        lijst.sort((a, b) => a.grootte.localeCompare(b.grootte));
    }

    if (sorteerOpties.value === "groot") { // van groot naar klein
        lijst.sort((a, b) => b.grootte.localeCompare(a.grootte));
    }

    toon(lijst);
}

// de kaarten op de pagina
function toon(data) {

    container.innerHTML = ""; 
    // eerst leegmaken zo is er geen dubbel

    data.forEach(loc => {

        const div = document.createElement("div"); // nieuw
        div.className = "kaart"; // css class

        //aanmaak html
        div.innerHTML = `
            <h3>${loc.naam}</h3>
            <p>Postcode: ${loc.postcode}</p>
            <p>Gemeente: ${loc.gemeente}</p>
            <p>Grootte: ${loc.grootte}</p>
            <p>Coord.: ${loc.lat}, ${loc.lon}</p>
            <button>${favorieten.includes(loc.naam) ? "Verwijder" : "Favoriet"}</button>
        `;

        // als ik op knop druk
        div.querySelector("button").addEventListener("click", () => {
            editFavoriet(loc.naam);
        });

        container.appendChild(div); // kaart toevoegen aan pagina
    });
}

// fav toevoegen of verwijderen
function editFavoriet(naam) {

    if (favorieten.includes(naam)) {
        favorieten = favorieten.filter(f => f !== naam); // als het al bestaat → verwijderen
    } else {
        favorieten.push(naam); // anders toevoegen
    }

    // opslaan in localStorage zodat bewaard blijft
    localStorage.setItem("favorieten", JSON.stringify(favorieten));

    update(); // pagina opnieuw tonen
}

// events koppelen aan inputs
zoekInput.addEventListener("input", update); // zoeken
filterOpties.addEventListener("change", update); // filter
sorteerOpties.addEventListener("change", update); // sorteren

// start van de app
haalDataOp(); // data ophalen bij laden