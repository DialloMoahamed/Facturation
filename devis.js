const devis = JSON.parse(localStorage.getItem("devis")) || [];

const clients = JSON.parse(localStorage.getItem("clients")) || [];

const articles = JSON.parse(localStorage.getItem("articles")) || [];

const articlesDuDevis = [];

const selectClient =
    document.getElementById("clientDevis");

const selectArticle =
    document.getElementById("articleDevis");

const quantiteArticleDevis =
    document.getElementById("quantiteArticleDevis");

const conteneurArticlesDevis =
    document.getElementById("conteneurArticlesDevis");

const totalHTDevis =
    document.getElementById("totalHTDevis");

const totalTVADevis =
    document.getElementById("totalTVADevis");

const totalTTCDevis =
    document.getElementById("totalTTCDevis");

const nomClientPreview =
    document.getElementById("nomClientPreview");

const adresseClientPreview =
    document.getElementById("adresseClientPreview");

const localisationClientPreview =
    document.getElementById("localisationClientPreview");

const listeArticlesDevis =
    document.getElementById("listeArticlesDevis");

const ajouterArticleDevis =
    document.getElementById("ajouterArticleDevis");

const sauvegarde = document.getElementById("sauvegarde");  

if (selectClient) {
    clients.forEach((client) => {
        const option = document.createElement("option");

        option.value = client.id;

        option.textContent = client.designation;

        selectClient.appendChild(option);
    });

    selectClient.addEventListener("change", () => {

        const clientId = Number(selectClient.value);

        const client = clients.find(
            (client) => client.id === clientId
        );

        if (!client) {

            nomClientPreview.textContent = "Nom du client";
            adresseClientPreview.textContent = "Adresse du client";
            localisationClientPreview.textContent =
                "Localisation du client";

            return;
        }

        nomClientPreview.textContent = client.designation;

        adresseClientPreview.textContent = client.adress;

        localisationClientPreview.textContent =
            client.localisation;
    });
}

if (selectArticle) {

    articles.forEach((article) => {
    const option = document.createElement("option");

    option.value = article.id;

    option.textContent = article.designation;

    selectArticle.appendChild(option);

    });

    ajouterArticleDevis.addEventListener("click", () => {

    const articleId = Number(selectArticle.value);

    const article = articles.find(
        (article) => article.id === articleId
    );

    if (!article) {

        alert("Veuillez sélectionner un article");

        return;
    }

    const quantite = Number(
        quantiteArticleDevis.value
    );

    if (quantite <= 0) {

        alert("Veuillez saisir une quantité valide");

        return;
    }

    const articleDevis = {

        articleId: article.id,

        designation: article.designation,

        description: article.description,

        type: article.type,

        unite: article.unite,

        quantite: quantite,

        prixHT: article.prix,

        taxe: article.taxe,

        montantHT: article.prix * quantite

    };

    articlesDuDevis.push(articleDevis);

    afficherArticlesDevis();

    afficherCartesArticles();

    selectArticle.value = "";

    quantiteArticleDevis.value = 1;

    });
}


function afficherArticlesDevis() {

    listeArticlesDevis.innerHTML = "";

    articlesDuDevis.forEach((article, index) => {

        const montantTTC =
            article.montantHT +
            (article.montantHT * article.taxe / 100);

        listeArticlesDevis.innerHTML += `
            <tr>

                <td>${index + 1}</td>

                <td>
                    <strong>${article.designation}</strong><br>
                    ${article.description}
                </td>

                <td class="text-center">
                    ${article.unite}
                </td>

                <td class="text-center">
                    ${article.quantite}
                </td>

                <td class="text-center">
                    ${article.prixHT}
                </td>

                <td class="text-center">
                    ${article.taxe}%
                </td>

                <td class="text-center">
                    ${article.montantHT}
                </td>

                <td class="text-center">
                    ${montantTTC}
                </td>

                <td class="text-center">
                    <button
                        type="button"
                        class="btn btn-sm text-danger"
                        onclick="supprimerArticleDevis(${index})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>

            </tr>
        `;
    });

    calculerTotauxDevis();
}

function afficherCartesArticles() {

    conteneurArticlesDevis.innerHTML = "";

    articlesDuDevis.forEach((article, index) => {

        conteneurArticlesDevis.innerHTML += `

            <div class="border border-primary rounded-4 p-3 mb-3">

                <!-- HEADER -->

                <div class="d-flex justify-content-between align-items-center mb-3">

                    <small class="fw-bold text-secondary">

                        #${index + 1} ${article.designation}

                    </small>

                    <div class="d-flex gap-3">

                        <i
                            id="chevronArticle${index}"
                            class="bi bi-chevron-up text-secondary"
                            style="cursor:pointer;"
                            onclick="toggleArticleDevis(${index})">
                        </i>

                        <i
                            class="bi bi-trash text-danger"
                            style="cursor:pointer;"
                            onclick="supprimerArticleDevis(${index})">
                        </i>

                    </div>

                </div>


                <!-- DÉSIGNATION -->

                <div class="mb-3">

                    <label class="fw-bold small mb-2">
                        Désignation *
                    </label>

                    <input
                        type="text"
                        class="form-control"
                        value="${article.designation}"
                        readonly
                        style="height:42px; border-radius:12px;">

                </div>

                <div id="contenuArticle${index}">
                <!-- DESCRIPTION -->

                <div class="mb-3">

                    <label class="fw-bold small mb-2">
                        Description
                    </label>

                    <textarea
                        class="form-control rounded-4"
                        rows="4"
                        readonly>${article.description}</textarea>

                </div>


                <!-- TYPE -->

                <div class="mb-3">

                    <label class="fw-bold small mb-2">
                        Type de l'article *
                    </label>

                    <input
                        type="text"
                        class="form-control"
                        value="${article.type}"
                        readonly
                        style="height:42px; border-radius:12px;">

                </div>


                <!-- UNITÉ / PRIX / TVA / QUANTITÉ -->

                <div class="row g-2">

                    <div class="col-md-3">

                        <label class="fw-bold small mb-2">
                            Unité
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            value="${article.unite}"
                            readonly
                            style="height:42px; border-radius:12px;">

                    </div>


                    <div class="col-md-3">

                        <label class="fw-bold small mb-2">
                            Prix HT
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            value="${article.prixHT}"
                            readonly
                            style="height:42px; border-radius:12px;">

                    </div>


                    <div class="col-md-3">

                        <label class="fw-bold small mb-2">
                            Taxe
                        </label>

                        <input
                            type="text"
                            class="form-control"
                            value="${article.taxe}%"
                            readonly
                            style="height:42px; border-radius:12px;">

                    </div>


                    <div class="col-md-3">

                        <label class="fw-bold small mb-2">
                            Quantité *
                        </label>

                        <input
                            type="number"
                            class="form-control quantiteDevis"
                            value="${article.quantite}"
                            data-index="${index}"
                            min="1"
                            style="height:42px; border-radius:12px;">

                    </div>

                </div>

            </div>
            </div>

        `;

    });

    const quantiteAll = conteneurArticlesDevis.querySelectorAll(".quantiteDevis");

        quantiteAll.forEach((input) => {

            input.addEventListener("change", () => {

                const index = Number(input.dataset.index);

                const quantite = Number(input.value);

                articlesDuDevis[index].quantite = quantite;

                const prixHT = articlesDuDevis[index].prixHT

                articlesDuDevis[index].montantHT = prixHT * quantite

                afficherArticlesDevis();
            })
        });


}

function calculerTotauxDevis() {

    let totalHT = 0;
    let totalTVA = 0;

    articlesDuDevis.forEach((article) => {

        totalHT += article.montantHT;

        totalTVA +=
            article.montantHT * article.taxe / 100;
    });

    const totalTTC = totalHT + totalTVA;

    totalHTDevis.textContent = totalHT.toLocaleString("fr-FR");
    totalTVADevis.textContent = totalTVA.toLocaleString("fr-FR");
    totalTTCDevis.textContent = totalTTC.toLocaleString("fr-FR");
}

function supprimerArticleDevis(index) {

    articlesDuDevis.splice(index, 1);

    afficherArticlesDevis();

    afficherCartesArticles();

}

function toggleArticleDevis(index) {

    const contenu = document.getElementById(
        `contenuArticle${index}`
    );

    const chevron = document.getElementById(
        `chevronArticle${index}`
    );

    if (!contenu || !chevron) {
        return;
    }

    if (contenu.style.display === "none") {

        contenu.style.display = "block";

        chevron.classList.remove("bi-chevron-down");
        chevron.classList.add("bi-chevron-up");

    } else {

        contenu.style.display = "none";

        chevron.classList.remove("bi-chevron-up");
        chevron.classList.add("bi-chevron-down");

    }
}

if (selectClient && selectArticle) {
    sauvegarde.addEventListener("click", () => {

    if (selectClient.value === "" || articlesDuDevis.length === 0) {
        
        alert("Aucun clent ou article n'a été sélectionner");

        return;
    };

    const clientId2 = Number(selectClient.value);

    const client2 = clients.find(
        (client) => client.id === clientId2
    );

    let totalHT = 0;
    let totalTVA = 0;
    let totalTTC = 0;

    articlesDuDevis.forEach((article) => {

        totalHT += article.montantHT;

        totalTVA += article.montantHT * article.taxe / 100;

    });

    totalTTC = totalHT + totalTVA;

    let numero = "D-";

    const numeDevis = (devis.length + 1).toString();
    let str = numeDevis.padStart(5, "0");
    const date = new Date().getFullYear();

    numero += date + "-" + str;

    console.log(numero);
    
    const nouveauDevis = {
        clientId2,
        client2,
        articlesDuDevis,
        totalHT,
        totalTVA,
        totalTTC,
        numero,
        date,
        status: "signé"

    };

    devis.push(nouveauDevis);

    localStorage.setItem("devis", JSON.stringify(devis));


    console.log(devis);
    
});
}



let tbody2 = document.getElementById("listeDevis");
console.log(tbody2);


function afficherDevis() {

    tbody2.innerHTML = "";

    devis.forEach((devi) => {

        tbody2.innerHTML += `
        <tr data-id="${devi.numero}">
            <td scope="row">
            <div class="d-flex flex-column">
                <span>${devi.numero}</span>
                <small class="text-primary">${devi.client2.designation}</small>
                <small><i class="bi bi-clock"></i> ${devi.date} </small>
            </div>
            </td>
            <td><span class="text-primary fw-bold"
                style="background-color: #89C7F4 !important; padding: 6px 15px !important; border-radius: 15px;">${devi.status}</span>
            </td>
            <td>${devi.totalHT}</td>
            <td>${devi.totalTTC}</td>
        </tr>
    `
    });

    const allListe = document.querySelectorAll("#listeDevis tr");

    allListe.forEach((liste) => {

        liste.addEventListener("click", () => {

            const numeroDevis = liste.dataset.id;

            const devisSelectionne = devis.find((devi) => {
                return devi.numero === numeroDevis;
            });

            document.getElementById("numeroDevisOffcanvas").textContent =
            devisSelectionne.numero;
            console.log(devisSelectionne);

        });
    });
    
}

if (tbody2) {
    afficherDevis();
}