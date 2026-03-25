parliamentContainer = document.getElementById('parliament_container')

async function getData() {
    const url = "https://data.stortinget.no/eksport/dagensrepresentanter?format=JSON";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(error.message);
    }
}

async function drawParliament() {
    // Hent data
    const data = await getData();

    // Sørg for at containeren har row-klasse
    parliamentContainer.classList.add("row", "g-3"); // g-3 = gutter mellom kolonner

    data.dagensrepresentanter_liste.forEach((r) => {
        console.log(`${r.fornavn} ${r.etternavn}`);

        // Card body
        const card_body = document.createElement("div");
        card_body.classList.add("card-body");

        const card_title = document.createElement("h5");
        card_title.classList.add("card-title");
        card_title.textContent = `${r.fornavn} ${r.etternavn}`;

        const card_text = document.createElement("p");
        card_text.classList.add("card-text");
        card_text.textContent = `${r.fylke.navn} | ${calculateAge(r.foedselsdato)} år`;

        card_body.appendChild(card_title);
        card_body.appendChild(card_text);

        // Card
        const card = document.createElement("div");
        card.classList.add("card", "col-6", "col-md-4", "col-lg-2", "m-2");
        if (r.kjoenn == 1) {
            card.classList.add("bg-danger")
        } else if (r.kjoenn == 2) {
            card.classList.add("bg-primary")
        }
        card.appendChild(card_body);

        parliamentContainer.appendChild(card);
    });
}
drawParliament();

function calculateAge(dotNetDateStr) {
    // matcher nå også negative millisekunder
    const match = dotNetDateStr.match(/\/Date\((-?\d+)([+-]\d{4})?\)\//);
    if (!match) return null;

    const birthMs = parseInt(match[1], 10);
    const birthDate = new Date(birthMs);

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Juster hvis fødselsdato i år ikke har kommet ennå
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

// Eksempel:
const str = "/Date(631152000000+0100)/"; // 1. jan 1990
console.log(calculateAge(str)); // f.eks. 36 hvis dagens dato er i 2026