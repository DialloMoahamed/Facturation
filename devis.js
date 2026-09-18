const devis = JSON.parse(localStorage.getItem("devis")) || [];

const clientsDevis = JSON.parse(localStorage.getItem("clients")) || [];

const articlesDevis = JSON.parse(localStorage.getItem("articles")) || [];

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
    clientsDevis.forEach((client) => {
        const option = document.createElement("option");

        option.value = client.id;

        option.textContent = client.designation;

        selectClient.appendChild(option);
    });

    selectClient.addEventListener("change", () => {

        const clientId = Number(selectClient.value);

        const client = clientsDevis.find(
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

    articlesDevis.forEach((article) => {
    const option = document.createElement("option");

    option.value = article.id;

    option.textContent = article.designation;

    selectArticle.appendChild(option);

    });

    ajouterArticleDevis.addEventListener("click", () => {

    const articleId = Number(selectArticle.value);

    const article = articlesDevis.find(
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

function changerStatutDevis(nouveauStatut) {

    const devisSelectionne = devis.find((devi) => {
        return devi.numero === numeroDevisActuel;
    });

    if (!devisSelectionne) {
        return;
    }

    devisSelectionne.status = nouveauStatut;

    localStorage.setItem("devis", JSON.stringify(devis));

    document.getElementById("statutDevisOffcanvas").textContent =
        nouveauStatut;

    afficherDevis();

}

if (selectClient && selectArticle) {
    sauvegarde.addEventListener("click", () => {

    if (selectClient.value === "" || articlesDuDevis.length === 0) {
        
        alert("Aucun clent ou article n'a été sélectionner");

        return;
    };

    const clientId2 = Number(selectClient.value);

    const client2 = clientsDevis.find(
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
    dateEmission: inputDateEmission.value,
    validite: Number(inputDateValidite.value),
    status: "signé"
};

    devis.push(nouveauDevis);

    localStorage.setItem("devis", JSON.stringify(devis));


    console.log(devis);
    
});
}



let tbody2 = document.getElementById("listeDevis");
let numeroDevisActuel = null;


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

            numeroDevisActuel = numeroDevis;

            document.getElementById("numeroDevisOffcanvas").textContent =
            devisSelectionne.numero;

            document.getElementById("nomClientOffcanvas").textContent =
            devisSelectionne.client2.designation;

            document.getElementById("totalHTOffcanvas").textContent = 
            devisSelectionne.totalHT;

            document.getElementById("totalTTCOffcanvas").textContent = 
            devisSelectionne.totalTTC;

            document.getElementById("dateDevisOffcanvas").textContent = 
            devisSelectionne.date;

            document.getElementById("statutDevisOffcanvas").textContent = 
            devisSelectionne.status;

            afficherArticlesOffcanvas(devisSelectionne.articlesDuDevis);

            document.getElementById("clientNomDocument").textContent =
            devisSelectionne.client2.designation;

            document.getElementById("clientAdresseDocument").textContent =
            devisSelectionne.client2.adress;

            document.getElementById("clientLocalisationDocument").textContent =
            devisSelectionne.client2.localisation;
            
            console.log(devisSelectionne);

            const offcanvas = new bootstrap.Offcanvas(
                document.getElementById("offcanvasdevis")
            );

            offcanvas.show();

            document.getElementById("totalHTOffcanvas").textContent =
            devisSelectionne.totalHT;

            document.getElementById("totalTVAOffcanvas").textContent =
            devisSelectionne.totalTVA;

            document.getElementById("totalTTCOffcanvas").textContent =
            devisSelectionne.totalTTC;


        });
    });
    
}

function afficherArticlesOffcanvas(articles) {

    console.log("Articles reçus :", articles);

    const tbody = document.getElementById("articlesDevisOffcanvas");

    console.log("Tbody :", tbody);

    tbody.innerHTML = "";

    articles.forEach((article, index) => {

        console.log("Article affiché :", article);

        const montantTTC =
            article.montantHT +
            (article.montantHT * article.taxe / 100);

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>

                <td>
                    <strong>${article.designation}</strong>
                    <br>
                    ${article.description || ""}
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
            </tr>
        `;
        console.log("HTML du tableau :", tbody.innerHTML);
    });
}

const inputDateEmission = document.getElementById("dateEmission");
const inputDateValidite = document.getElementById("dateValidite");

const textDateEmission = document.getElementById("emission");
const textDateValidite = document.getElementById("validité");

// inputDateEmission.addEventListener("change", () => {

//     textDateEmission.innerText = inputDateEmission.value;
//     document.getElementById("emission2").innerText = inputDateEmission.value;

//     console.log("Date d'emmission" ,textDateEmission);
                
// });

if (inputDateEmission) {

    inputDateEmission.addEventListener("change", () => {

    textDateEmission.innerText = inputDateEmission.value;
    document.getElementById("emission2").innerText = inputDateEmission.value
});
}

if (inputDateValidite) {

    inputDateValidite.addEventListener("change", () => {

    const dateValidite = inputDateValidite.value;

    textDateValidite.innerText = dateValidite + " jours";

    document.getElementById("validité2").innerText = dateValidite + " jours";

    document.getElementById("delai").innerText = dateValidite + " jours";

    console.log("Date de validité", textDateValidite);

});
}



// inputDateValidite.addEventListener("change", () => {

//     const nombreJours = inputDateValidite.value;

//     textDateValidite.innerText = nombreJours + " jours";

//     document.getElementById("validité2").innerText =
//         nombreJours + " jours";

// });

const deviseValue = document.getElementById("deviseValue");

if (deviseValue) {
    
    deviseValue.addEventListener("change", () => {

    const devise1 = document.getElementById("devise1");
    devise1.innerText = deviseValue.value;

    const devise2 = document.getElementById("devise2");
    devise2.innerText = deviseValue.value;

    const devise3 = document.getElementById("devise3");
    devise3.innerText = deviseValue.value;

    const devisActuelle = document.getElementById("deviseA");
    devisActuelle.innerText = deviseValue.value;
    console.log(deviseValue.value);
    
});
}


if (tbody2) {
    afficherDevis();
}