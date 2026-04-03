Dynamic web Projectweek 2026 - Laure-Grace Lokiyo & Samantha Karengera
# BrusselsExplorer

BrusselsExplorer is een interactieve webapplicatie waarmee gebruikers interessante openbare parken en tuinen in Brussel kunnen ontdekken met behulp van open data van de opendata.brussels API.

De applicatie biedt functies zoals het bekijken van locaties (coordinaten), zoeken, filteren, sorteren en het opslaan van favorieten voor een gepersonaliseerde ervaring.

---

##  Team / Taakverdeling

- **Laure-Grace Lokiyo** – Projectopzet, JavaScript, API-integratie, userstories/backlog 
- **Samantha Karengera** – Projectopzet, HTML-structuur, CSS en README



## Technische vereisten

| Concept | Waar toegepast / Uitleg | Regel / Functie |
|---------|------------------------|----------------|
| Elementen selecteren | `document.getElementById` voor alle inputs en containers | script.js, r.8-14 |
| Elementen manipuleren | `innerHTML`, `appendChild` voor kaarten en favorieten | script.js, r.56-72, r.91-101 |
| Events koppelen | `addEventListener` op zoek, filter, sorteer, weergave, knoppen | script.js, r.104-108 |
| Constanten | `const` gebruikt voor apiUrl en DOM elementen | script.js, r.1-7 |
| Template literals | Voor kaarten en favorieten HTML | script.js, r.62-71 |
| Iteratie over arrays | `.forEach` voor kaarten en favorieten | script.js, r.56, r.91 |
| Array methodes | `.map` bij ophalen data, `.filter` bij zoeken/filter/favorieten | script.js, r.20, r.41, r.95 |
| Arrow functions | Gebruikt in `.forEach` en event handlers | script.js, r.56, r.93, r.104-108 |
| Conditional / ternary | Favoriet knop tekst `favoriet` of `verwijder` | script.js, r.67 |
| Callback functions | Functies als parameter bij events en `forEach` | script.js, r.57, r.94, r.105 |
| Promises | `fetch()` gebruikt + `.json()` | script.js, r.17 |
| Async / Await | `haalDataOp` is async met await fetch | script.js, r.16-20 |
| Fetch | `fetch(apiUrl)` | script.js, r.17 |
| JSON manipuleren | `res.json()` + `.map` | script.js, r.18-20 |
| Formulier validatie | trim() bij zoekinput | script.js, r.36 |
| LocalStorage | `localStorage.setItem` en `getItem` | script.js, r.79, r.8 |
| Basis HTML layout | Flexbox header, CSS grid kaarten | style.css, r.6-20, r.24-29 |
| Basis CSS | Achtergrond, knoppen, borders | style.css, r.1-49 |
| Gebruiksvriendelijke elementen | Knoppen, dropdowns, duidelijk grid | script.js + style.css, r.56-72, r.91-101 |

## API

Link : https://opendata.brussels.be/explore/dataset/parcs_et_jardins_publics/information/?sort=-type&refine.type_txt=%3E+3+ha&refine.source=Ville+de+Bruxelles+-+D%C3%A9veloppement+Urbain+-+Planification+et+D%C3%A9veloppement&q.timerange.last_update=last_update:%5B2024-01-01+TO+2026-04-03%5D

## Bronnen
 AI chatlog hier nog toevoegen

## Screenshot
nog toe te voegen