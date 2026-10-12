const devisFacture =
    JSON.parse(localStorage.getItem("devis")) || [];

const acomptesFacture =
    JSON.parse(localStorage.getItem("acomptes")) || [];

let facturesFacture =
    JSON.parse(localStorage.getItem("factures")) || [];

// Variables utilisées dans la liste des factures.
let numeroFactureActuelle = null;
let pageActuelleFacture = 1;
let facturesParPage = 25;
let nombrePagesFacture = 1;
let statutFiltreFacture = "";
let rechercheFacture = "";
let clientFiltreFacture = "";


/* =========================================================
   OUTILS GÉNÉRAUX
   ========================================================= */

function elementFacture(id) {
    return document.getElementById(id);
}

function montantNombre(valeur) {
    const nombre = Number(valeur);
    return Number.isFinite(nombre) ? nombre : 0;
}

function formaterMontant(valeur) {
    return montantNombre(valeur).toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " FCFA";
}

function formaterDate(valeur) {
    if (!valeur) return "Non renseignée";

    const date = new Date(valeur + "T00:00:00");

    if (Number.isNaN(date.getTime())) {
        return valeur;
    }

    return date.toLocaleDateString("fr-FR");
}

function formaterNombre(valeur) {
    return montantNombre(valeur).toLocaleString("fr-FR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    });
}

function afficherTexte(id, valeur) {
    const element = elementFacture(id);

    if (element) {
        element.textContent = valeur ?? "";
    }
}

function enregistrerFactures() {
    localStorage.setItem(
        "factures",
        JSON.stringify(facturesFacture)
    );
}

function echapperHTML(valeur) {
    return String(valeur ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[caractere]);
}

function trouverDevis(numero) {
    return devisFacture.find(devi => devi.numero === numero);
}

function trouverFacture(numero) {
    return facturesFacture.find(
        facture => facture.numero === numero
    );
}

function trouverAcomptesDuDevis(numeroDevis) {
    return acomptesFacture.filter(
        acompte => acompte.devisNumero === numeroDevis
    );
}


/* =========================================================
   NUMÉRO DE FACTURE
   Format : F-AAAA-NNNNN
   ========================================================= */

function genererNumeroFacture() {
    const annee = new Date().getFullYear();
    let dernierNumero = 0;

    facturesFacture.forEach(facture => {
        const correspondance =
            facture.numero?.match(/^F-\d{4}-(\d+)$/);

        if (correspondance) {
            dernierNumero = Math.max(
                dernierNumero,
                Number(correspondance[1])
            );
        }
    });

    return `F-${annee}-${String(dernierNumero + 1).padStart(5, "0")}`;
}


/* =========================================================
   CALCULS

   La facture correspond au reste du devis après déduction
   de tous les acomptes enregistrés pour ce devis.
   ========================================================= */

function calculerMontantsFacture(devi) {
    const totalDevisHT = montantNombre(devi.totalHT);
    const totalDevisTVA = montantNombre(devi.totalTVA);
    const totalDevisTTC = montantNombre(
        devi.totalTTC || totalDevisHT + totalDevisTVA
    );

    const acomptes = trouverAcomptesDuDevis(devi.numero);

    const totalAcomptesHT = acomptes.reduce(
        (total, acompte) => total + montantNombre(acompte.montantHT),
        0
    );

    const totalAcomptesTVA = acomptes.reduce(
        (total, acompte) => total + montantNombre(acompte.montantTVA),
        0
    );

    const totalAcomptesTTC = acomptes.reduce(
        (total, acompte) => total + montantNombre(acompte.montantTTC),
        0
    );

    const resteHT = Math.max(0, totalDevisHT - totalAcomptesHT);
    const resteTVA = Math.max(0, totalDevisTVA - totalAcomptesTVA);

    // On utilise les totaux du devis et des acomptes enregistrés.
    const resteTTC = Math.max(
        0,
        totalDevisTTC - totalAcomptesTTC
    );

    return {
        totalDevisHT,
        totalDevisTVA,
        totalDevisTTC,
        totalAcomptesHT,
        totalAcomptesTVA,
        totalAcomptesTTC,
        resteHT,
        resteTVA,
        resteTTC,
        acomptes
    };
}


/* =========================================================
   STATUT AUTOMATIQUE
   ========================================================= */

function actualiserStatutFacture(facture) {
    if (facture.status === "payé") {
        return facture.status;
    }

    if (!facture.dateValidite) {
        facture.status = "en attente";
        return facture.status;
    }

    const aujourdHui = new Date();
    aujourdHui.setHours(0, 0, 0, 0);

    const dateLimite = new Date(
        facture.dateValidite + "T00:00:00"
    );

    if (dateLimite < aujourdHui) {
        facture.status = "en retard";
    } else {
        facture.status = "en attente";
    }

    return facture.status;
}

function actualiserTousLesStatutsFacture() {
    facturesFacture.forEach(facture => {
        actualiserStatutFacture(facture);
    });

    enregistrerFactures();
}


/* =========================================================
   PAGE DE CRÉATION / MODIFICATION
   CreerFacture.html
   ========================================================= */

function initialiserCreationFacture() {
    const boutonSauvegarder = elementFacture("sauvegardeFacture");

    // Cet élément n'existe que sur la page de création.
    if (!boutonSauvegarder) return;

    const parametres = new URLSearchParams(window.location.search);
    const numeroDevisURL = parametres.get("devis");

    let factureAModifier = null;

    try {
        factureAModifier = JSON.parse(
            localStorage.getItem("factureAModifier")
        );
    } catch (erreur) {
        console.error("Impossible de lire la facture à modifier.", erreur);
    }

    // En modification, on reprend le devis de la facture existante.
    const numeroDevis = factureAModifier
        ? factureAModifier.devisNumero
        : numeroDevisURL;

    const devisSelectionne = trouverDevis(numeroDevis);

    if (!devisSelectionne) {
        const relations = elementFacture("relationsFacture");

        if (relations) {
            relations.innerHTML = `
                <div class="alert alert-warning">
                    Aucun devis valide n'a été sélectionné.
                    Ouvre un devis puis choisis « Créer une facture ».
                </div>
            `;
        }

        boutonSauvegarder.disabled = true;
        return;
    }

    const calculs = calculerMontantsFacture(devisSelectionne);
    const client = devisSelectionne.client2 || {};

    // Informations du client dans le formulaire.
    afficherTexte(
        "designationClientFacture",
        client.designation || "Client non renseigné"
    );

    afficherTexte(
        "mailClientFacture",
        client.mail || client.email || "Non renseigné"
    );

    afficherTexte(
        "boitePostaleClientFacture",
        client.adress || client.adresse || "Non renseignée"
    );

    afficherTexte(
        "localisationClientFacture",
        client.localisation || "Non renseignée"
    );

    // Informations du devis et des acomptes liés.
    afficherRelationsCreationFacture(
        devisSelectionne,
        calculs
    );

    // Préremplir les dates lors d'une modification.
    const dateEmission = elementFacture("dateEmission");
    const dateValidite = elementFacture("dateValidite");

    if (dateEmission && !dateEmission.value) {
        dateEmission.value =
            factureAModifier?.dateEmission ||
            new Date().toISOString().slice(0, 10);
    }

    if (dateValidite && !dateValidite.value) {
        dateValidite.value =
            factureAModifier?.dateValidite || "";
    }

    // Le numéro affiché dans l'aperçu.
    afficherTexte(
        "previewNumeroFacture",
        factureAModifier?.numero || genererNumeroFacture()
    );

    // Actualiser les dates et l'aperçu dès qu'elles changent.
    if (dateEmission) {
        dateEmission.addEventListener("input", mettreAJourApercuFacture);
        dateEmission.addEventListener("change", mettreAJourApercuFacture);
    }

    if (dateValidite) {
        dateValidite.addEventListener("input", mettreAJourApercuFacture);
        dateValidite.addEventListener("change", mettreAJourApercuFacture);
    }

    mettreAJourApercuFacture();

    boutonSauvegarder.addEventListener("click", function (evenement) {
        evenement.preventDefault();

        const emission = dateEmission?.value || "";
        const validite = dateValidite?.value || "";

        if (!emission || !validite) {
            alert("Renseigne la date d'émission et la date de validité.");
            return;
        }

        if (validite < emission) {
            alert("La date de validité ne peut pas précéder la date d'émission.");
            return;
        }

        const calculsActuels =
            calculerMontantsFacture(devisSelectionne);

        if (calculsActuels.resteHT <= 0) {
            alert(
                "Ce devis est déjà entièrement couvert par les acomptes. " +
                "Il ne reste aucun montant HT à facturer."
            );
            return;
        }

        const numeroFacture = factureAModifier
            ? factureAModifier.numero
            : genererNumeroFacture();

        const designationElement = elementFacture("designationFacture");

        const designation = designationElement?.value?.trim()
            || `Solde du devis ${devisSelectionne.numero}`;

        const nouvelleFacture = {
            id: factureAModifier?.id || Date.now(),
            numero: numeroFacture,

            devisNumero: devisSelectionne.numero,
            devisId: devisSelectionne.id || null,

            clientId: devisSelectionne.clientId2 ?? null,
            client: client,

            designation: designation,

            // On conserve les informations du devis associé.
            devis: {
                numero: devisSelectionne.numero,
                totalHT: calculsActuels.totalDevisHT,
                totalTVA: calculsActuels.totalDevisTVA,
                totalTTC: calculsActuels.totalDevisTTC
            },

            // Numéros de tous les acomptes associés au devis.
            acomptesNumeros: calculsActuels.acomptes.map(
                acompte => acompte.numero
            ),

            totalHT: calculsActuels.resteHT,
            totalTVA: calculsActuels.resteTVA,
            totalTTC: calculsActuels.resteTTC,

            totalAcomptesHT: calculsActuels.totalAcomptesHT,
            totalAcomptesTTC: calculsActuels.totalAcomptesTTC,

            dateCreation:
                factureAModifier?.dateCreation ||
                new Date().toISOString(),

            dateEmission: emission,
            dateValidite: validite,

            status: factureAModifier?.status || "en attente"
        };

        actualiserStatutFacture(nouvelleFacture);

        if (factureAModifier) {
            const index = facturesFacture.findIndex(
                facture => facture.numero === factureAModifier.numero
            );

            if (index !== -1) {
                facturesFacture[index] = nouvelleFacture;
            } else {
                facturesFacture.push(nouvelleFacture);
            }
        } else {
            facturesFacture.push(nouvelleFacture);
        }

        enregistrerFactures();

        localStorage.removeItem("factureAModifier");

        alert(
            factureAModifier
                ? `Facture ${numeroFacture} modifiée avec succès.`
                : `Facture ${numeroFacture} créée avec succès.`
        );

        window.location.href = "facturation.html";
    });
}


/* =========================================================
   AFFICHAGE DU DEVIS ET DES ACOMPTES DANS LA CRÉATION
   ========================================================= */

function afficherRelationsCreationFacture(devi, calculs) {
    const conteneur = elementFacture("relationsFacture");

    if (!conteneur) return;

    let html = `
        <div class="border rounded-3 p-3 mb-3">
            <div class="d-flex justify-content-between">
                <strong>Devis lié</strong>
                <span class="text-primary">
                    ${echapperHTML(devi.numero)}
                </span>
            </div>

            <div class="mt-2">
                Total HT : <strong>${formaterMontant(calculs.totalDevisHT)}</strong>
            </div>
            <div>
                Total TTC : <strong>${formaterMontant(calculs.totalDevisTTC)}</strong>
            </div>
        </div>

        <div class="border rounded-3 p-3 mb-3">
            <div class="d-flex justify-content-between">
                <strong>Acomptes liés</strong>
                <span>${calculs.acomptes.length}</span>
            </div>
    `;

    if (calculs.acomptes.length === 0) {
        html += `
            <p class="text-muted small mb-0 mt-2">
                Aucun acompte enregistré pour ce devis.
            </p>
        `;
    } else {
        calculs.acomptes.forEach(acompte => {
            html += `
                <div class="border-top mt-3 pt-3">
                    <div class="d-flex justify-content-between">
                        <strong>${echapperHTML(acompte.numero)}</strong>
                        <span>${echapperHTML(acompte.status || "Brouillon")}</span>
                    </div>
                    <div class="small text-muted mt-1">
                        HT : ${formaterMontant(acompte.montantHT)}
                        · TTC : ${formaterMontant(acompte.montantTTC)}
                    </div>
                </div>
            `;
        });
    }

    html += `
        </div>

        <div class="alert alert-light border">
            <div class="d-flex justify-content-between">
                <span>Total des acomptes HT</span>
                <strong>${formaterMontant(calculs.totalAcomptesHT)}</strong>
            </div>
            <div class="d-flex justify-content-between mt-2">
                <span>Reste à facturer HT</span>
                <strong>${formaterMontant(calculs.resteHT)}</strong>
            </div>
            <div class="d-flex justify-content-between mt-2">
                <span>Reste à facturer TTC</span>
                <strong>${formaterMontant(calculs.resteTTC)}</strong>
            </div>
        </div>
    `;

    conteneur.innerHTML = html;
}


/* =========================================================
   APERÇU DE LA FACTURE
   ========================================================= */

function mettreAJourApercuFacture() {
    const parametres = new URLSearchParams(window.location.search);

    let factureAModifier = null;

    try {
        factureAModifier = JSON.parse(
            localStorage.getItem("factureAModifier")
        );
    } catch (erreur) {
        // Rien à faire si aucune facture n'est en modification.
    }

    const numeroDevis = factureAModifier
        ? factureAModifier.devisNumero
        : parametres.get("devis");

    const devi = trouverDevis(numeroDevis);

    if (!devi) return;

    const calculs = calculerMontantsFacture(devi);
    const client = devi.client2 || {};

    afficherTexte(
        "previewNomClient",
        client.designation || "Client"
    );

    afficherTexte(
        "previewBoitePostale",
        client.adress || client.adresse || "Non renseignée"
    );

    afficherTexte(
        "previewLocalisation",
        client.localisation || "Non renseignée"
    );

    const dateEmission = elementFacture("dateEmission")?.value;
    const dateValidite = elementFacture("dateValidite")?.value;

    afficherTexte(
        "previewDateEmission",
        formaterDate(dateEmission)
    );

    afficherTexte(
        "previewDateValidite",
        formaterDate(dateValidite)
    );

    afficherTexte(
        "previewNumeroDevis",
        devi.numero
    );

    afficherTexte(
        "previewTotalDevisHT",
        formaterMontant(calculs.totalDevisHT)
    );

    afficherTexte(
        "previewTVADevis",
        formaterMontant(calculs.totalDevisTVA)
    );

    afficherTexte(
        "previewTotalDevisTTC",
        formaterMontant(calculs.totalDevisTTC)
    );

    afficherTexte(
        "previewNumeroAcomptes",
        calculs.acomptes.length
            ? calculs.acomptes.map(a => a.numero).join(", ")
            : "Aucun acompte"
    );

    afficherTexte(
        "previewTotalAcomptesHT",
        formaterMontant(calculs.totalAcomptesHT)
    );

    afficherTexte(
        "previewTotalAcomptesTTC",
        formaterMontant(calculs.totalAcomptesTTC)
    );

    afficherTexte(
        "previewResteHT",
        formaterMontant(calculs.resteHT)
    );

    afficherTexte(
        "previewResteTTC",
        formaterMontant(calculs.resteTTC)
    );

    // Articles du devis : le détail reste lié au devis original.
    const tbody = elementFacture("previewFactureBody");

    if (tbody) {
        const articles = devi.articlesDuDevis || [];

        if (articles.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-muted">
                        Aucun article enregistré sur ce devis.
                    </td>
                </tr>
            `;
        } else {
            tbody.innerHTML = articles.map(article => {
                const quantite = montantNombre(article.quantite);
                const prixHT = montantNombre(article.prixHT);
                const montantHT = montantNombre(
                    article.montantHT || prixHT * quantite
                );

                return `
                    <tr>
                        <td>
                            ${echapperHTML(
                                article.designation ||
                                article.nom ||
                                article.libelle ||
                                "Article"
                            )}
                        </td>
                        <td class="text-end">${quantite}</td>
                        <td class="text-end">${formaterMontant(prixHT)}</td>
                        <td class="text-end">${montantNombre(article.taxe)} %</td>
                        <td class="text-end">${formaterMontant(montantHT)}</td>
                    </tr>
                `;
            }).join("");
        }
    }

    afficherTexte(
        "previewDelaiPaiement",
        dateValidite ? formaterDate(dateValidite) : "À préciser"
    );

    const moyenPaiement = elementFacture("moyenPaiement");

    afficherTexte(
        "previewMoyenPaiement",
        moyenPaiement?.value || "À préciser"
    );
}


/* =========================================================
   LISTE DES FACTURES
   facturation.html — même présentation que la liste des devis
   ========================================================= */

function afficherFactures() {
    const tbody = elementFacture("listeFactures");

    if (!tbody) return;

    actualiserTousLesStatutsFacture();

    const facturesFiltrees = facturesFacture.filter(facture => {
        const client = facture.client || {};

        const correspondRecherche =
            !rechercheFacture ||
            String(facture.numero || "").toLowerCase().includes(rechercheFacture) ||
            String(client.designation || "").toLowerCase().includes(rechercheFacture) ||
            String(facture.devisNumero || "").toLowerCase().includes(rechercheFacture);

        const correspondClient =
            !clientFiltreFacture ||
            String(facture.clientId ?? client.id ?? client.designation) ===
            String(clientFiltreFacture);

        const correspondStatut =
            !statutFiltreFacture ||
            facture.status === statutFiltreFacture;

        return correspondRecherche && correspondClient && correspondStatut;
    });

    nombrePagesFacture = Math.max(
        1,
        Math.ceil(facturesFiltrees.length / facturesParPage)
    );

    if (pageActuelleFacture > nombrePagesFacture) {
        pageActuelleFacture = nombrePagesFacture;
    }

    const debut = (pageActuelleFacture - 1) * facturesParPage;

    const facturesPage = facturesFiltrees.slice(
        debut,
        debut + facturesParPage
    );

    if (facturesPage.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-4">
                    Aucune facture trouvée.
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = facturesPage.map(facture => {
            const client = facture.client || {};

            return `
                <tr data-numero="${echapperHTML(facture.numero)}"
                    role="button"
                    style="cursor:pointer">

                    <td>
                        <div class="d-flex flex-column">
                            <span class="fw-semibold">
                                ${echapperHTML(facture.numero)}
                            </span>
                            <small class="text-primary">
                                ${echapperHTML(client.designation || "Client inconnu")}
                            </small>
                            <small class="text-muted">
                                <i class="bi bi-clock"></i> ${formaterDate(facture.dateEmission)}
                            </small>
                        </div>
                    </td>

                    <td>
                        <span class="fw-bold ${classeStatutFacture(facture.status)}"
                            style="${styleBadgeFacture(facture.status)}">${echapperHTML(facture.status)}</span>
                    </td>

                    <td>${formaterMontant(facture.totalHT)}</td>
                    <td>${formaterMontant(facture.totalTTC)}</td>
                </tr>
            `;
        }).join("");
    }

    afficherStatistiquesFactures();

    const premier = facturesFiltrees.length === 0 ? 0 : debut + 1;
    const dernier = Math.min(debut + facturesParPage, facturesFiltrees.length);

    afficherTexte(
        "compteurFactures",
        `${premier}-${dernier} de ${facturesFiltrees.length}`
    );

    afficherTexte("numeroPageFacture", pageActuelleFacture);
    afficherTexte("lignesParPageFacture", `Ligne par page ${facturesParPage}`);

    const precedent = elementFacture("pagePrecedenteFacture");
    const suivant = elementFacture("pageSuivanteFacture");

    if (precedent) {
        precedent.style.display = pageActuelleFacture <= 1 ? "none" : "inline";
    }

    if (suivant) {
        suivant.style.display =
            pageActuelleFacture >= nombrePagesFacture ? "none" : "inline";
    }

    afficherFiltresClientsFacture();

    tbody.querySelectorAll("tr[data-numero]").forEach(ligne => {
        ligne.addEventListener("click", () => {
            ouvrirDetailsFacture(ligne.dataset.numero);
        });
    });
}

function classeStatutFacture(status) {
    if (status === "payé") return "text-success";
    if (status === "en retard") return "text-danger";
    return "text-primary";
}

function styleBadgeFacture(status) {
    let fond = "#89C7F4";

    if (status === "payé") fond = "#A9E5BC";
    if (status === "en retard") fond = "#F5B5B5";

    return `background-color: ${fond} !important; padding: 6px 15px !important; border-radius: 15px;`;
}


/* =========================================================
   STATISTIQUES DES FACTURES
   ========================================================= */

function afficherStatistiquesFactures() {
    const statistiques = [
        {
            statut: "en attente",
            nombre: "nombreFacturesAttente",
            ht: "totalFacturesAttenteHT",
            ttc: "totalFacturesAttenteTTC"
        },
        {
            statut: "payé",
            nombre: "nombreFacturesPayees",
            ht: "totalFacturesPayeesHT",
            ttc: "totalFacturesPayeesTTC"
        },
        {
            statut: "en retard",
            nombre: "nombreFacturesRetard",
            ht: "totalFacturesRetardHT",
            ttc: "totalFacturesRetardTTC"
        }
    ];

    statistiques.forEach(stat => {
        const groupe = facturesFacture.filter(
            facture => facture.status === stat.statut
        );

        const totalHT = groupe.reduce(
            (somme, facture) => somme + montantNombre(facture.totalHT),
            0
        );

        const totalTTC = groupe.reduce(
            (somme, facture) => somme + montantNombre(facture.totalTTC),
            0
        );

        afficherTexte(stat.nombre, groupe.length);
        afficherTexte(stat.ht, formaterNombre(totalHT));
        afficherTexte(stat.ttc, formaterNombre(totalTTC));
    });
}


/* =========================================================
   FILTRE DES CLIENTS
   ========================================================= */

function afficherFiltresClientsFacture() {
    const liste = elementFacture("listeClientsFacture");

    if (!liste) return;

    const clients = [];

    facturesFacture.forEach(facture => {
        const client = facture.client;

        if (!client) return;

        const id = facture.clientId ?? client.id ?? client.designation;

        if (!clients.some(c => String(c.id) === String(id))) {
            clients.push({
                id,
                designation: client.designation || "Client"
            });
        }
    });

    liste.innerHTML = `
        <li>
            <button type="button" class="dropdown-item" data-client="">
                Tous les clients
            </button>
        </li>
        ${clients.map(client => `
            <li>
                <button type="button" class="dropdown-item"
                    data-client="${echapperHTML(client.id)}">
                    ${echapperHTML(client.designation)}
                </button>
            </li>
        `).join("")}
    `;

    const selectionne = clients.find(
        c => String(c.id) === String(clientFiltreFacture)
    );

    afficherTexte(
        "clientSelectionneFacture",
        selectionne ? selectionne.designation : "Clients"
    );

    liste.querySelectorAll("[data-client]").forEach(bouton => {
        bouton.addEventListener("click", () => {
            clientFiltreFacture = bouton.dataset.client;
            pageActuelleFacture = 1;
            afficherFactures();
        });
    });
}


/* =========================================================
   DÉTAILS D'UNE FACTURE : OFFCANVAS
   ========================================================= */

function ouvrirDetailsFacture(numero) {
    const facture = trouverFacture(numero);

    if (!facture) return;

    numeroFactureActuelle = facture.numero;

    actualiserStatutFacture(facture);
    enregistrerFactures();

    const client = facture.client || {};
    const devi = trouverDevis(facture.devisNumero);
    const acomptes = trouverAcomptesDuDevis(facture.devisNumero);

    // En-tête
    afficherTexte("numeroFactureOffcanvas", facture.numero);
    afficherTexte(
        "nomClientFactureOffcanvas",
        client.designation || "Client inconnu"
    );
    afficherTexte(
        "prixFactureOffcanvas",
        `${formaterNombre(facture.totalHT)} fcfa HT`
    );
    afficherTexte(
        "ttcFactureOffcanvas",
        `${formaterNombre(facture.totalTTC)} fcfa TTC`
    );

    const dateEntete = elementFacture("dateFactureOffcanvas");

    if (dateEntete) {
        dateEntete.innerHTML = `
            <i class="bi bi-calendar4-event"></i>
            ${echapperHTML(formaterDate(facture.dateEmission))}
        `;
    }

    const statut = elementFacture("statutFactureOffcanvas");

    if (statut) {
        statut.textContent = facture.status;
        statut.className = `fw-bold ${classeStatutFacture(facture.status)}`;
    }

    // Document : client
    afficherTexte(
        "clientNomFactureDocument",
        client.designation || "Client inconnu"
    );
    afficherTexte(
        "clientAdresseFactureDocument",
        client.adress || client.adresse || "Non renseignée"
    );
    afficherTexte(
        "clientLocalisationFactureDocument",
        client.localisation || "Non renseignée"
    );

    // Document : références et dates
    afficherTexte("numeroDocumentFacture", facture.numero);
    afficherTexte("numeroDevisFactureDocument", facture.devisNumero || "-");
    afficherTexte(
        "dateEmissionFactureDocument",
        formaterDate(facture.dateEmission)
    );
    afficherTexte(
        "dateValiditeFactureDocument",
        formaterDate(facture.dateValidite)
    );
    afficherTexte(
        "delaiPaiementFactureDocument",
        facture.dateValidite ? formaterDate(facture.dateValidite) : "Illimité"
    );

    // Document : articles
    const tbody = elementFacture("articlesFactureOffcanvas");

    if (tbody) {
        const articles = devi?.articlesDuDevis || [];

        tbody.innerHTML = articles.length
            ? articles.map((article, index) => {
                const quantite = montantNombre(article.quantite);
                const prixHT = montantNombre(article.prixHT);
                const taxe = montantNombre(article.taxe);
                const montantHT = montantNombre(
                    article.montantHT || prixHT * quantite
                );
                const montantTTC = montantHT * (1 + taxe / 100);

                return `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            ${echapperHTML(
                                article.designation ||
                                article.nom ||
                                article.libelle ||
                                "Article"
                            )}
                            ${article.description
                                ? `<br><small class="text-muted">${echapperHTML(article.description)}</small>`
                                : ""}
                        </td>
                        <td>${echapperHTML(article.unite || "-")}</td>
                        <td>${quantite}</td>
                        <td>${formaterNombre(prixHT)}</td>
                        <td>${taxe} %</td>
                        <td>${formaterNombre(montantHT)}</td>
                        <td>${formaterNombre(montantTTC)}</td>
                    </tr>
                `;
            }).join("")
            : `
                <tr>
                    <td colspan="8" class="text-center text-muted">
                        Aucun article disponible.
                    </td>
                </tr>
            `;
    }

    // Document : totaux
    const totalDevisHT = devi
        ? devi.totalHT
        : facture.devis?.totalHT;

    afficherTexte(
        "totalDevisHTFactureDocument",
        formaterMontant(totalDevisHT)
    );
    afficherTexte(
        "totalAcomptesHTFactureDocument",
        formaterMontant(facture.totalAcomptesHT)
    );
    afficherTexte("totalHTFactureOffcanvas", formaterMontant(facture.totalHT));
    afficherTexte("totalTVAFactureOffcanvas", formaterMontant(facture.totalTVA));
    afficherTexte("totalTTCFactureOffcanvas", formaterMontant(facture.totalTTC));

    // Relations
    afficherTexte(
        "devisRelationFacture",
        devi
            ? `${devi.numero} — HT : ${formaterMontant(devi.totalHT)} — TTC : ${formaterMontant(devi.totalTTC)}`
            : facture.devisNumero || "Devis non retrouvé"
    );

    const listeAcomptes = elementFacture("listeAcomptesFacture");

    afficherTexte("nombreAcomptesFacture", acomptes.length);

    if (listeAcomptes) {
        listeAcomptes.innerHTML = acomptes.length
            ? acomptes.map(acompte => `
                <div class="border rounded-3 p-3 mb-2">

                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong class="text-primary">
                                ${echapperHTML(acompte.numero)}
                            </strong>
                            <br>
                            <small class="text-muted">
                                ${echapperHTML(acompte.designation || "Acompte")}
                            </small>
                        </div>

                        <span class="badge bg-light text-secondary">
                            ${echapperHTML(acompte.status || "Brouillon")}
                        </span>
                    </div>

                    <div class="row mt-3">
                        <div class="col-md-4">
                            <small class="text-muted">Calcul</small>
                            <div class="fw-bold">
                                ${acompte.typeCalcul === "pourcentage"
                                    ? `${echapperHTML(acompte.pourcentage)} %`
                                    : `${formaterNombre(acompte.montantHTSaisi ?? acompte.montantHT)} fcfa`}
                            </div>
                        </div>

                        <div class="col-md-4">
                            <small class="text-muted">Montant HT</small>
                            <div class="fw-bold">
                                ${formaterNombre(acompte.montantHT)} fcfa
                            </div>
                        </div>

                        <div class="col-md-4">
                            <small class="text-muted">Montant TTC</small>
                            <div class="fw-bold">
                                ${formaterNombre(acompte.montantTTC)} fcfa
                            </div>
                        </div>
                    </div>

                </div>
            `).join("")
            : `<small class="text-muted">Aucun acompte lié à ce devis.</small>`;
    }

    const boutonPayer = elementFacture("marquerFacturePayee");

    if (boutonPayer) {
        boutonPayer.disabled = facture.status === "payé";
        boutonPayer.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            ${facture.status === "payé" ? "Facture déjà payée" : "Marquer comme payé"}
        `;
    }

    const cible = elementFacture("offcanvasfacture");

    if (cible && window.bootstrap?.Offcanvas) {
        window.bootstrap.Offcanvas
            .getOrCreateInstance(cible)
            .show();
    }
}



/* =========================================================
   MARQUER UNE FACTURE COMME PAYÉE
   ========================================================= */

function marquerFacturePayee() {
    const facture = trouverFacture(numeroFactureActuelle);

    if (!facture) {
        alert("Aucune facture sélectionnée.");
        return;
    }

    facture.status = "payé";
    facture.datePaiement = new Date().toISOString();

    enregistrerFactures();
    afficherFactures();
    ouvrirDetailsFacture(facture.numero);
}


/* =========================================================
   SUPPRIMER UNE FACTURE
   ========================================================= */

function supprimerFactureSelectionnee() {
    const facture = trouverFacture(numeroFactureActuelle);

    if (!facture) {
        alert("Aucune facture sélectionnée.");
        return;
    }

    const confirmation = confirm(
        `Veux-tu vraiment supprimer la facture ${facture.numero} ?`
    );

    if (!confirmation) return;

    facturesFacture = facturesFacture.filter(
        element => element.numero !== facture.numero
    );

    enregistrerFactures();

    const cible = elementFacture("offcanvasfacture");

    if (cible && window.bootstrap?.Offcanvas) {
        window.bootstrap.Offcanvas
            .getOrCreateInstance(cible)
            .hide();
    }

    numeroFactureActuelle = null;
    afficherFactures();
}


/* =========================================================
   MODIFIER UNE FACTURE
   ========================================================= */

function modifierFactureSelectionnee() {
    const facture = trouverFacture(numeroFactureActuelle);

    if (!facture) {
        alert("Aucune facture sélectionnée.");
        return;
    }

    localStorage.setItem(
        "factureAModifier",
        JSON.stringify(facture)
    );

    window.location.href = "CreerFacture.html";
}


/* =========================================================
   INITIALISATION DE LA LISTE ET DES BOUTONS
   ========================================================= */

function initialiserListeFactures() {
    if (!elementFacture("listeFactures")) return;

    actualiserTousLesStatutsFacture();
    afficherFactures();

    const recherche = elementFacture("rechercheFacture");

    if (recherche) {
        recherche.addEventListener("input", () => {
            rechercheFacture = recherche.value.trim().toLowerCase();
            pageActuelleFacture = 1;
            afficherFactures();
        });
    }

    // Filtre par statut
    document
        .querySelectorAll("#listeStatutFacture [data-statut]")
        .forEach(bouton => {
            bouton.addEventListener("click", () => {
                statutFiltreFacture = bouton.dataset.statut;

                afficherTexte(
                    "statutSelectionneFacture",
                    statutFiltreFacture
                        ? bouton.textContent.trim()
                        : "Statut"
                );

                pageActuelleFacture = 1;
                afficherFactures();
            });
        });

    // Nombre de lignes par page
    document
        .querySelectorAll("#listeLignesFacture [data-lignes-facture]")
        .forEach(bouton => {
            bouton.addEventListener("click", () => {
                facturesParPage = Number(bouton.dataset.lignesFacture) || 25;
                pageActuelleFacture = 1;
                afficherFactures();
            });
        });

    const precedent = elementFacture("pagePrecedenteFacture");
    const suivant = elementFacture("pageSuivanteFacture");

    if (precedent) {
        precedent.addEventListener("click", () => {
            if (pageActuelleFacture > 1) {
                pageActuelleFacture--;
                afficherFactures();
            }
        });
    }

    if (suivant) {
        suivant.addEventListener("click", () => {
            if (pageActuelleFacture < nombrePagesFacture) {
                pageActuelleFacture++;
                afficherFactures();
            }
        });
    }

    const boutonPayer = elementFacture("marquerFacturePayee");

    if (boutonPayer) {
        boutonPayer.addEventListener("click", marquerFacturePayee);
    }

    const boutonSupprimer = elementFacture("supprimerFacture");

    if (boutonSupprimer) {
        boutonSupprimer.addEventListener(
            "click",
            supprimerFactureSelectionnee
        );
    }

    const boutonModifier = elementFacture("modifierFacture");

    if (boutonModifier) {
        boutonModifier.addEventListener(
            "click",
            modifierFactureSelectionnee
        );
    }

    // Ouvrir une facture si son numéro est présent dans l'URL.
    const parametres = new URLSearchParams(window.location.search);
    const numeroURL = parametres.get("facture");

    if (numeroURL && trouverFacture(numeroURL)) {
        ouvrirDetailsFacture(numeroURL);
    }
}



/* =========================================================
   DÉMARRAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initialiserCreationFacture();
    initialiserListeFactures();
});