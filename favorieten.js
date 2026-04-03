// DOM
const container = document.getElementById("favorietenContainer");

// data
let favorieten = JSON.parse(localStorage.getItem("favorieten")) || [];

// json ophalen
fetch("parcs.json")
    .then(res => res.json())
    .then(data => {

        const lijst = data.filter(item => favorieten.includes(item.name_nl));

        lijst.forEach(loc => {
            const div = document.createElement("div");
            div.className = "favItem";

            div.innerHTML = `
                <span>${loc.name_nl}</span>
                <button>❌</button>
            `;

            div.querySelector("button").addEventListener("click", () => {
                favorieten = favorieten.filter(f => f !== loc.name_nl);
                localStorage.setItem("favorieten", JSON.stringify(favorieten));
                location.reload(); // refresh pagina
            });

            container.appendChild(div);
        });

    });