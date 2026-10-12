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

const devisAModifier =
    JSON.parse(localStorage.getItem("devisAModifier"));

let pageActuelle = 1;
let lignesParPage = 25; 

const ligneParPageElement = document.getElementById("lignesParPage");
const compteurDevis = document.getElementById("compteurDevis");
const numeroPage = document.getElementById("numeroPage");
const pagePrecedente = document.getElementById("pagePrecedente");
const pageSuivante = document.getElementById("pageSuivante");
 

if (devisAModifier) {

    devisAModifier.articlesDuDevis.forEach((article) => {

        articlesDuDevis.push(article);

    });

    afficherArticlesDevis();
    afficherCartesArticles();

}

if (selectClient) {
    clientsDevis.forEach((client) => {
        const option = document.createElement("option");

        option.value = client.id;

        option.textContent = client.designation;

        selectClient.appendChild(option);
});

    if (devisAModifier) {
        selectClient.value = devisAModifier.clientId2;
        selectClient.dispatchEvent(new Event("change"));
    }

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

    if (listeArticlesDevis) {
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
    }


    calculerTotauxDevis();
}

function afficherCartesArticles() {

    if (conteneurArticlesDevis) {
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

    if (totalHTDevis && totalTVADevis && totalTTCDevis) {

        totalHTDevis.textContent = totalHT.toLocaleString("fr-FR");
        totalTVADevis.textContent = totalTVA.toLocaleString("fr-FR");
        totalTTCDevis.textContent = totalTTC.toLocaleString("fr-FR");
    }

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

function modifierDevis() {

    const devisSelectionne = devis.find((devi) => {
        return devi.numero === numeroDevisActuel;
    });

    if (!devisSelectionne) {
        return;
    }

    localStorage.setItem(
        "devisAModifier",
        JSON.stringify(devisSelectionne)
    );

    window.location.href = "CreerDevis.html";


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

        numero: devisAModifier ? devisAModifier.numero : numero,

        dateEmission: inputDateEmission.value,

        validite: Number(inputDateValidite.value),

        status: devisAModifier ? devisAModifier.status : "signé"

    };

    if (devisAModifier) {

    const indexDevis = devis.findIndex(
        (devi) => devi.numero === devisAModifier.numero
    );

    devis[indexDevis] = nouveauDevis;

    } else {

        devis.push(nouveauDevis);

    }

    localStorage.setItem("devis", JSON.stringify(devis));
    localStorage.removeItem("devisAModifier");

    window.location.href = "facturation.html";

    console.log(devis);
    
});
}



let tbody2 = document.getElementById("listeDevis");
let numeroDevisActuel = null;
const rechercheDevis = document.getElementById("rechercheDevis");
const clientSelectionne = document.getElementById("clientSelectionne");
const toutLesClients = document.getElementById("toutLesClients");
let clientActuel = null;

function NomClient() {

    const listeCl = document.getElementById("listeClientsDevis");

    clientsDevis.forEach((client) => {
        const liste2 = document.createElement("li");
        const button = document.createElement("button");
        button.classList.add("dropdown-item");

        button.addEventListener("click", () => {
            clientSelectionne.innerText = client.designation;

            clientActuel = client;
            pageActuelle = 1;
            afficherDevis();

        });

        button.innerHTML = client.designation;
        liste2.appendChild(button);

        listeCl.appendChild(liste2);
    });

     toutLesClients.addEventListener("click", () => {
            clientSelectionne.innerText = "Clients";
            clientActuel = null;
            pageActuelle = 1;
            afficherDevis();
        });
};

NomClient();

if (rechercheDevis) {
    rechercheDevis.addEventListener("input", () => {
        pageActuelle = 1;
        afficherDevis();
    });
}


function afficherDevis(listeDevis = devis) {

    tbody2.innerHTML = "";

    const textRecherche = rechercheDevis.value.toLowerCase();

    const devisFilter = listeDevis.filter((devi) => {

        return (
            (clientActuel === null || devi.client2.designation === clientActuel.designation ) &&
            (devi.numero.toLowerCase().includes(textRecherche) ||
            devi.client2.designation.toLowerCase().includes(textRecherche))
        );
    });

    const nombreTotalDevis = devisFilter.length;
    const nombreTotalPages = calculerNombrePages(nombreTotalDevis);

    if (pageActuelle > nombreTotalPages && nombreTotalPages > 0) {
        pageActuelle = nombreTotalPages;
    };

    const debut = (pageActuelle - 1) * lignesParPage;
    const fin = debut + lignesParPage;

    const devisPage = devisFilter.slice(debut, fin);

    const debutAffichage = nombreTotalDevis === 0 ? 0 : debut + 1;
    const finAffichage = Math.min(fin, nombreTotalDevis);

    compteurDevis.innerText = `${debutAffichage}-${finAffichage} de ${nombreTotalDevis}`;

    numeroPage.innerText = pageActuelle;

    if (pageActuelle === 1) {
        pagePrecedente.style.display = "none";
    } else {
        pagePrecedente.style.display = "inline";
    }

    if (pageActuelle === nombreTotalPages) {
        pageSuivante.style.display = "none";
    } else {
        pageSuivante.style.display = "inline";
    }

    devisPage.forEach((devi) => {

        tbody2.innerHTML += `
        <tr data-id="${devi.numero}">
            <td scope="row">
            <div class="d-flex flex-column">
                <span>${devi.numero}</span>
                <small class="text-primary">${devi.client2.designation}</small>
                <small><i class="bi bi-clock"></i> ${devi.dateEmission} </small>
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

    calculerTotauxParStatus();

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
            devisSelectionne.dateEmission;

            document.getElementById("dateEmissionDocument").textContent = 
            devisSelectionne.dateEmission;

            document.getElementById("dateValiditeDocument").textContent =
            devisSelectionne.validite + " jours";

            document.getElementById("dateValiditeDocument2").textContent =
            devisSelectionne.validite + " jours";

            document.getElementById("numeroDocument").textContent = 
            devisSelectionne.numero

            document.getElementById("statutDevisOffcanvas").textContent = 
            devisSelectionne.status;

            afficherArticlesOffcanvas(devisSelectionne.articlesDuDevis);

            afficherRelationsDevis(devisSelectionne.numero);

            document.getElementById("clientNomDocument").textContent =
            devisSelectionne.client2.designation;

            document.getElementById("clientAdresseDocument").textContent =
            devisSelectionne.client2.adress;

            document.getElementById("clientLocalisationDocument").textContent =
            devisSelectionne.client2.localisation;
            

            // document.getElementById("devise4").innerText = 
            // deviseValue.value;

            // document.getElementById("devise5").innerText = 
            // deviseValue.value;

            // document.getElementById("devise6").innerText = 
            // deviseValue.value;
            
            console.log(devisSelectionne);
            // console.log("Devise :", deviseValue.value);

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
    
};

function CreerAcompte() {
    window.location.href = `CreerAcompte.html?devis=${encodeURIComponent(numeroDevisActuel)}`;
}

// ======================================================
// OUVRIR UN DEVIS DEPUIS L'URL
// ======================================================

function ouvrirDevisDepuisURL() {

    const parametres =
        new URLSearchParams(window.location.search);

    const numeroDevisURL =
        parametres.get("devis");

    const onglet =
        parametres.get("onglet");


    // Aucun devis demandé dans l'URL
    if (!numeroDevisURL) {
        return;
    }


    // Rechercher le devis
    const devisSelectionne =
        devis.find((devi) => {

            return devi.numero === numeroDevisURL;

        });


    if (!devisSelectionne) {
        return;
    }


    // Mémoriser le devis actuel
    numeroDevisActuel =
        devisSelectionne.numero;


    // ==================================================
    // REMPLIR L'OFFCANVAS
    // ==================================================

    document.getElementById(
        "numeroDevisOffcanvas"
    ).textContent =
        devisSelectionne.numero;


    document.getElementById(
        "nomClientOffcanvas"
    ).textContent =
        devisSelectionne.client2.designation;


    document.getElementById(
        "totalHTOffcanvas"
    ).textContent =
        devisSelectionne.totalHT;


    document.getElementById(
        "totalTTCOffcanvas"
    ).textContent =
        devisSelectionne.totalTTC;


    document.getElementById(
        "dateDevisOffcanvas"
    ).textContent =
        devisSelectionne.dateEmission;


    document.getElementById(
        "statutDevisOffcanvas"
    ).textContent =
        devisSelectionne.status;


    document.getElementById(
        "dateEmissionDocument"
    ).textContent =
        devisSelectionne.dateEmission;


    document.getElementById(
        "dateValiditeDocument"
    ).textContent =
        devisSelectionne.validite + " jours";


    document.getElementById(
        "dateValiditeDocument2"
    ).textContent =
        devisSelectionne.validite + " jours";


    document.getElementById(
        "numeroDocument"
    ).textContent =
        devisSelectionne.numero;


    document.getElementById(
        "clientNomDocument"
    ).textContent =
        devisSelectionne.client2.designation;


    document.getElementById(
        "clientAdresseDocument"
    ).textContent =
        devisSelectionne.client2.adress;


    document.getElementById(
        "clientLocalisationDocument"
    ).textContent =
        devisSelectionne.client2.localisation;


    document.getElementById(
        "totalTVAOffcanvas"
    ).textContent =
        devisSelectionne.totalTVA;


    // Articles
    afficherArticlesOffcanvas(
        devisSelectionne.articlesDuDevis
    );


    // Relations
    afficherRelationsDevis(
        devisSelectionne.numero
    );


    // ==================================================
    // OUVRIR L'OFFCANVAS
    // ==================================================

    const offcanvasElement =
        document.getElementById("offcanvasdevis");

    const offcanvas =
        bootstrap.Offcanvas.getOrCreateInstance(
            offcanvasElement
        );

    offcanvas.show();


    // ==================================================
    // OUVRIR L'ONGLET DEMANDÉ
    // ==================================================

    if (onglet === "relation") {

        const relationTab =
            document.getElementById("relation-tab");

        if (relationTab) {

            const tab =
                bootstrap.Tab.getOrCreateInstance(
                    relationTab
                );

            tab.show();

        }

    }

}

function supprimerDevis() {
    const confirmation = confirm("Voulez vous vraiment supprimer ce devis ?");

    if (!confirmation) return ;
    

    const devisSelectionne = devis.find((devi) => {
        return devi.numero === numeroDevisActuel;
    });

    if (!devisSelectionne) return;

    const nouvelListeDevis = devis.filter((devi) => {
        return devi.numero !== numeroDevisActuel; 
    });

    devis.length = 0;
    devis.push(...nouvelListeDevis);

    localStorage.setItem("devis", JSON.stringify(devis));

    afficherDevis();

    const offcanvasElement = document.getElementById("offcanvasdevis");
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);

    if (offcanvas) {
        offcanvas.hide();
    }
}

const choixLignesParPage = document.querySelectorAll("[data-lignes]");

choixLignesParPage.forEach((bouton) => {
    bouton.addEventListener("click", () => {
        lignesParPage = Number(bouton.dataset.lignes);
        pageActuelle = 1;
        afficherDevis();
    });
});

pageSuivante.addEventListener("click", () => {
    const devisFilters = obtenirDevisFiltres(); 
    const nombreTotalPages = calculerNombrePages(devisFilters.length);

    if (pageActuelle < nombreTotalPages) {
        pageActuelle++;
        afficherDevis();
    }
});

pagePrecedente.addEventListener("click", () => {
    if (pageActuelle > 1) {
        pageActuelle--;
        afficherDevis();
    }
})

function calculerNombrePages(nombreDevis) {
    return Math.ceil(nombreDevis / lignesParPage);
};

function obtenirDevisFiltres() {
    const texteRecherche = rechercheDevis.value.toLowerCase();

    return devis.filter((devi) => {
        return (
            (clientActuel === null ||
                devi.client2.designation === clientActuel.designation) &&
            (
                devi.numero.toLowerCase().includes(texteRecherche) ||
                devi.client2.designation.toLowerCase().includes(texteRecherche)
            )
        );
    });
}

function calculerTotauxParStatus() {
    
    const totalHTSigne = document.getElementById("totalSigneHT");
    let totalHTSigneValue = 0;

    const totalTTCSigne = document.getElementById("totalSigneTTC");
    let totalTTCSigneValue = 0;

    const totalHTFinalise = document.getElementById("totalFinaliseHT");
    let totalHTFinaliseValue = 0;

    const totalTTCFinalise = document.getElementById("totalFinaliseTTC");
    let totalTTCFinaliseValue = 0;

    const totalHTRefuse = document.getElementById("totalRefuseHT");
    let totalHTRefuseValue = 0;

    const totalTTCRefuse = document.getElementById("totalRefuseTTC");
    let totalTTCRefuseValue = 0;

    devis.forEach((devi) => {

        if (devi.status === "signé") {

            totalHTSigneValue += devi.totalHT;
            totalTTCSigneValue += devi.totalTTC; 

        } else if (devi.status === "finalisé") {

            totalHTFinaliseValue += devi.totalHT;
            totalTTCFinaliseValue += devi.totalTTC;

        } else if (devi.status === "refusé") {

            totalHTRefuseValue += devi.totalHT;
            totalTTCRefuseValue += devi.totalTTC;
        }
    });

    totalHTSigne.innerText = totalHTSigneValue;
    totalTTCSigne.innerText = totalTTCSigneValue;

    totalHTFinalise.innerText = totalHTFinaliseValue;
    totalTTCFinalise.innerText = totalTTCFinaliseValue;

    totalHTRefuse.innerText = totalHTRefuseValue;
    totalTTCRefuse.innerText = totalTTCRefuseValue;
};

// ======================================================
// AFFICHER LES RELATIONS DU DEVIS
// ======================================================

function afficherRelationsDevis(numeroDevis) {

    // Récupérer les acomptes
    const acomptes =
        JSON.parse(localStorage.getItem("acomptes")) || [];

    // Récupérer les factures
    const factures =
        JSON.parse(localStorage.getItem("factures")) || [];


    // ==================================================
    // ACOMPTES DU DEVIS
    // ==================================================

    const acomptesDuDevis = acomptes.filter((acompte) => {

        return acompte.devisNumero === numeroDevis;

    });


    // ==================================================
    // FACTURES DU DEVIS
    // ==================================================

    const facturesDuDevis = factures.filter((facture) => {

        return facture.devisNumero === numeroDevis;

    });


    // ==================================================
    // ÉLÉMENTS HTML
    // ==================================================

    const listeAcomptes =
        document.getElementById("listeAcomptesRelation");

    const nombreAcomptes =
        document.getElementById("nombreAcomptesRelation");

    const listeFactures =
        document.getElementById("listeFacturesRelation");

    const nombreFactures =
        document.getElementById("nombreFacturesRelation");


    // ==================================================
    // NOMBRE D'ACOMPTES
    // ==================================================

    nombreAcomptes.textContent =
        acomptesDuDevis.length;


    // ==================================================
    // AFFICHER LES ACOMPTES
    // ==================================================

    if (acomptesDuDevis.length === 0) {

        listeAcomptes.innerHTML = `
            <small class="text-muted">
                Aucun acompte lié à ce devis.
            </small>
        `;

    } else {

        listeAcomptes.innerHTML = "";

        acomptesDuDevis.forEach((acompte) => {

            listeAcomptes.innerHTML += `

                <div class="border rounded-3 p-3 mb-2">

                    <div class="d-flex justify-content-between align-items-center">

                        <div>

                            <strong class="text-primary">
                                ${acompte.numero}
                            </strong>

                            <br>

                            <small class="text-muted">
                                ${acompte.designation || "Acompte"}
                            </small>

                        </div>

                        <span class="badge bg-light text-secondary">
                            ${acompte.status}
                        </span>

                    </div>


                    <div class="row mt-3">

                        <div class="col-md-4">

                            <small class="text-muted">
                                Calcul
                            </small>

                            <div class="fw-bold">

                                ${
                                    acompte.typeCalcul === "pourcentage"
                                        ? `${acompte.pourcentage} %`
                                        : `${acompte.montantHTSaisi} fcfa`
                                }

                            </div>

                        </div>


                        <div class="col-md-4">

                            <small class="text-muted">
                                Montant HT
                            </small>

                            <div class="fw-bold">
                                ${acompte.montantHT} fcfa
                            </div>

                        </div>


                        <div class="col-md-4">

                            <small class="text-muted">
                                Montant TTC
                            </small>

                            <div class="fw-bold">
                                ${acompte.montantTTC} fcfa
                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

    }


    // ==================================================
    // NOMBRE DE FACTURES
    // ==================================================

    nombreFactures.textContent =
        facturesDuDevis.length;


    // ==================================================
    // AFFICHER LES FACTURES
    // ==================================================

    if (facturesDuDevis.length === 0) {

        listeFactures.innerHTML = `
            <small class="text-muted">
                Aucune facture liée à ce devis.
            </small>
        `;

    } else {

        listeFactures.innerHTML = "";

        facturesDuDevis.forEach((facture) => {

            listeFactures.innerHTML += `

                <div class="border rounded-3 p-3 mb-2">

                    <div class="d-flex justify-content-between align-items-center">

                        <div>

                            <strong class="text-primary">
                                ${facture.numero}
                            </strong>

                            <br>

                            <small class="text-muted">
                                ${facture.designation || "Facture"}
                            </small>

                        </div>

                        <span class="badge bg-light text-secondary">
                            ${facture.status || "En attente"}
                        </span>

                    </div>


                    <div class="row mt-3">

                        <div class="col-md-6">

                            <small class="text-muted">
                                Total HT
                            </small>

                            <div class="fw-bold">
                                ${facture.totalHT || 0} fcfa
                            </div>

                        </div>


                        <div class="col-md-6">

                            <small class="text-muted">
                                Total TTC
                            </small>

                            <div class="fw-bold">
                                ${facture.totalTTC || 0} fcfa
                            </div>

                        </div>

                    </div>

                </div>

            `;

        });

    }

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

if (devisAModifier) {
    if (inputDateEmission && inputDateValidite) {
        inputDateEmission.value = devisAModifier.dateEmission;
        inputDateValidite.value = devisAModifier.validite;
    }
}

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


function creerFactureDepuisDevis() {
    if (!numeroDevisActuel) {
        alert("Sélectionne d'abord un devis.");
        return;
    }

    window.location.href =
        `CreerFacture.html?devis=${encodeURIComponent(numeroDevisActuel)}`;
}

if (tbody2) {
    afficherDevis();
    ouvrirDevisDepuisURL();
}