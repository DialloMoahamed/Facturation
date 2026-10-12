const devis = JSON.parse(localStorage.getItem("devis")) || [];
const acomptes = JSON.parse(localStorage.getItem("acomptes")) || [];

// ======================================================
// RÉCUPÉRER LE NUMÉRO DU DEVIS DANS L'URL
// ======================================================

const parametres = new URLSearchParams(window.location.search);
const numeroDevis = parametres.get("devis");

console.log("Numéro du devis :", numeroDevis);

// ======================================================
// RECHERCHER LE DEVIS
// ======================================================

const devisSelectionne = devis.find((devi) => {
    return devi.numero === numeroDevis;
});

console.log("Devis sélectionné :", devisSelectionne);

// Sécurité si aucun devis n'est trouvé
if (!devisSelectionne) {
    alert("Le devis demandé est introuvable.");
    window.location.href = "devis.html";
    throw new Error("Devis introuvable");
}

// ======================================================
// INFORMATIONS DU DEVIS
// ======================================================

document.getElementById("numeroDevisAcompte").textContent =
    devisSelectionne.numero;

document.getElementById("nomClientAcompt").textContent =
    devisSelectionne.client2.designation;

document.getElementById("statusDevisAcompte").textContent =
    devisSelectionne.status;

document.getElementById("totalTtcDevisAcompte").textContent =
    `${devisSelectionne.totalTTC} fcfa TTC`;

document.getElementById("totalHtDevisAcompte").textContent =
    `${devisSelectionne.totalHT} fcfa HT`;

document.getElementById("designationClientAcompte").textContent =
    devisSelectionne.client2.designation;

document.getElementById("mailClientAcompte").textContent =
    devisSelectionne.client2.email;

document.getElementById("boitePostaleClientAcompte").textContent =
    devisSelectionne.client2.adress;

document.getElementById("localisationClientAcompte").textContent =
    devisSelectionne.client2.localisation;


// ======================================================
// TYPE DE CALCUL
// ======================================================

const typeCalculAcompte =
    document.getElementById("typeCalculAcompte");

const labelValeurAcompte =
    document.getElementById("labelValeurAcompte");

const valeurAcompte =
    document.getElementById("valeurAcompte");

console.log("typeCalculAcompte :", typeCalculAcompte);
console.log("labelValeurAcompte :", labelValeurAcompte);
console.log("valeurAcompte :", valeurAcompte);


// ======================================================
// ÉLÉMENTS DES RÉSULTATS
// ======================================================

const montantHTAcompte =
    document.getElementById("montantHTAcompte");

const resteApayerDevisAcompte =
    document.getElementById("resteApayerDevisAcompte");

const montantAcompteTTC =
    document.getElementById("montantAcompteTTC");

const montantAcompteTVA =
    document.getElementById("montantAcompteTVA");

const montantHTAcompte2 =
    document.getElementById("montantHTAcompte2");


// ======================================================
// DATES
// ======================================================

const dateEmissionAcompte =
    document.getElementById("dateEmissionAcompte");

const dateValiditeAcompte =
    document.getElementById("dateValiditeAcompte");

const texteDateEmissionAcompte =
    document.getElementById("texteDateEmissionAcompte");

const texteDateValiditeAcompte =
    document.getElementById("texteDateValiditeAcompte");


// ======================================================
// PREVIEW
// ======================================================

const previewNumeroAcompte =
    document.getElementById("previewNumeroAcompte");

const previewDateEmission =
    document.getElementById("previewDateEmission");

const previewDateValidite =
    document.getElementById("previewDateValidite");

const previewNomClient =
    document.getElementById("previewNomClient");

const previewAdresseClient =
    document.getElementById("previewAdresseClient");

const previewLocalisationClient =
    document.getElementById("previewLocalisationClient");

const previewAcompteBody =
    document.getElementById("previewAcompteBody");


// ======================================================
// DESCRIPTION
// ======================================================

const designationAcompte =
    document.getElementById("designationAcompte");


// ======================================================
// VÉRIFICATION DU TBODY
// ======================================================

console.log(
    "previewAcompteBody :",
    previewAcompteBody
);

if (!previewAcompteBody) {
    console.error(
        "ERREUR : l'élément #previewAcompteBody est introuvable dans le HTML."
    );
}


// ======================================================
// INFORMATIONS CLIENT DANS LE PREVIEW
// ======================================================

previewNomClient.textContent =
    devisSelectionne.client2.designation;

previewAdresseClient.textContent =
    devisSelectionne.client2.adress;

previewLocalisationClient.textContent =
    devisSelectionne.client2.localisation;


// ======================================================
// TAUX DE TVA DU DEVIS
// ======================================================

const tauxTVA =
    (devisSelectionne.totalTTC - devisSelectionne.totalHT) /
    devisSelectionne.totalHT;

console.log("Taux TVA :", tauxTVA);


// ======================================================
// CALCULER L'ACOMPTE
// ======================================================

function calculerAcompte() {

    let montantHT = 0;

    const typeCalcul =
        typeCalculAcompte.value;

    const valeur =
        Number(valeurAcompte.value);


    // ==================================================
    // CALCUL EN POURCENTAGE
    // ==================================================

    if (typeCalcul === "pourcentage") {

        let pourcentage = valeur;

        if (pourcentage > 100) {

            pourcentage = 100;

            valeurAcompte.value = 100;
        }

        montantHT =
            devisSelectionne.totalHT *
            pourcentage /
            100;
    }


    // ==================================================
    // CALCUL EN DEVISE
    // ==================================================

    else if (typeCalcul === "devise") {

        montantHT = valeur;

        if (
            montantHT >
            devisSelectionne.totalHT
        ) {

            montantHT =
                devisSelectionne.totalHT;

            valeurAcompte.value =
                devisSelectionne.totalHT;
        }
    }


    // ==================================================
    // CALCULS FINAUX
    // ==================================================

    const resteApayer =
        devisSelectionne.totalHT -
        montantHT;

    const montantTVA =
        montantHT * tauxTVA;

    const montantTTC =
        montantHT + montantTVA;


    // ==================================================
    // AFFICHAGE
    // ==================================================

    montantHTAcompte.textContent =
        `${montantHT} fcfa HT`;

    montantHTAcompte2.textContent =
        `${montantHT} fcfa`;

    resteApayerDevisAcompte.textContent =
        `${resteApayer} fcfa HT`;

    montantAcompteTVA.textContent =
        `${montantTVA} fcfa`;

    montantAcompteTTC.textContent =
        `${montantTTC} fcfa`;
}


// ======================================================
// METTRE À JOUR LE PREVIEW
// ======================================================

function mettreAJourPreview() {

    // ==================================================
    // DATE D'ÉMISSION
    // ==================================================

    if (dateEmissionAcompte.value) {

        const date =
            new Date(
                dateEmissionAcompte.value +
                "T00:00:00"
            );

        const dateFormatee =
            date.toLocaleDateString("fr-FR");

        previewDateEmission.textContent =
            dateFormatee;

    } else {

        previewDateEmission.textContent =
            "00/00/0000";
    }


    // ==================================================
    // DATE DE VALIDITÉ
    // ==================================================

    if (dateValiditeAcompte.value) {

        const date =
            new Date(
                dateValiditeAcompte.value +
                "T00:00:00"
            );

        const dateFormatee =
            date.toLocaleDateString("fr-FR");

        previewDateValidite.textContent =
            dateFormatee;

    } else {

        previewDateValidite.textContent =
            "00/00/0000";
    }


    // ==================================================
    // CLIENT
    // ==================================================

    previewNomClient.textContent =
        devisSelectionne.client2.designation;

    previewAdresseClient.textContent =
        devisSelectionne.client2.adress;

    previewLocalisationClient.textContent =
        devisSelectionne.client2.localisation;


    // ==================================================
    // VÉRIFIER QUE LE TBODY EXISTE
    // ==================================================

    if (!previewAcompteBody) {

        console.error(
            "Impossible de mettre à jour le tableau : #previewAcompteBody n'existe pas."
        );

        return;
    }


    // ==================================================
    // VÉRIFIER SI UNE VALEUR EST SAISIE
    // ==================================================

    const valeur =
        Number(valeurAcompte.value);

    if (!valeur || valeur <= 0) {

        previewAcompteBody.innerHTML = "";

        return;
    }


    // ==================================================
    // CALCUL DU MONTANT HT
    // ==================================================

    let montantHT = 0;

    if (
        typeCalculAcompte.value ===
        "pourcentage"
    ) {

        let pourcentage = valeur;

        if (pourcentage > 100) {
            pourcentage = 100;
        }

        montantHT =
            devisSelectionne.totalHT *
            pourcentage /
            100;

    } else {

        montantHT = valeur;

        if (
            montantHT >
            devisSelectionne.totalHT
        ) {

            montantHT =
                devisSelectionne.totalHT;
        }
    }


    // ==================================================
    // TVA / TTC
    // ==================================================

    const montantTVA =
        montantHT * tauxTVA;

    const montantTTC =
        montantHT + montantTVA;


    // ==================================================
    // TYPE DE CALCUL
    // ==================================================

    let calculEn = "";
    let pourcentage = "-";

    if (
        typeCalculAcompte.value ===
        "pourcentage"
    ) {

        calculEn = "Pourcentage";

        pourcentage =
            `${Math.min(valeur, 100)} %`;

    } else {

        calculEn = "Devise";
    }


    // ==================================================
    // DESCRIPTION
    // ==================================================

    const description =
        designationAcompte.value.trim();


    // ==================================================
    // CONSTRUIRE LE TBODY
    // ==================================================

    previewAcompteBody.innerHTML = `

        <tr>

            <td>
                <strong>Acompte</strong>

                ${
                    description
                        ? `<br><small>${description}</small>`
                        : ""
                }
            </td>

            <td class="text-center">
                ${calculEn}
            </td>

            <td class="text-center">
                ${pourcentage}
            </td>

            <td class="text-center">
                ${montantHT.toFixed(2)} fcfa
            </td>

            <td class="text-center">
                ${montantTTC.toFixed(2)} fcfa
            </td>

        </tr>

    `;
}


// ======================================================
// CHANGEMENT POURCENTAGE / DEVISE
// ======================================================

typeCalculAcompte.addEventListener(
    "change",
    () => {

        if (
            typeCalculAcompte.value ===
            "pourcentage"
        ) {

            labelValeurAcompte.textContent =
                "Taux en pourcentage";

            valeurAcompte.placeholder =
                "Ex : 30";

            valeurAcompte.value =
                "";

            valeurAcompte.max =
                100;
        }


        else if (
            typeCalculAcompte.value ===
            "devise"
        ) {

            labelValeurAcompte.textContent =
                "Montant HT";

            valeurAcompte.placeholder =
                "Ex : 25000";

            valeurAcompte.value =
                "";

            valeurAcompte.removeAttribute(
                "max"
            );
        }


        // Remettre les résultats à zéro

        montantHTAcompte.textContent =
            "0 fcfa HT";

        montantHTAcompte2.textContent =
            "0 fcfa";

        resteApayerDevisAcompte.textContent =
            "0 fcfa HT";

        montantAcompteTVA.textContent =
            "0 fcfa";

        montantAcompteTTC.textContent =
            "0 fcfa";


        // Mettre à jour le preview

        mettreAJourPreview();
    }
);


// ======================================================
// SAISIE DE LA VALEUR
// ======================================================

valeurAcompte.addEventListener(
    "input",
    () => {

        calculerAcompte();

        mettreAJourPreview();
    }
);


// ======================================================
// DATE D'ÉMISSION
// ======================================================

dateEmissionAcompte.addEventListener(
    "change",
    () => {

        if (dateEmissionAcompte.value) {

            const date =
                new Date(
                    dateEmissionAcompte.value +
                    "T00:00:00"
                );

            const dateFormatee =
                date.toLocaleDateString("fr-FR");

            texteDateEmissionAcompte.textContent =
                `Date d'émission le ${dateFormatee}`;
        }


        mettreAJourPreview();
    }
);


// ======================================================
// DATE DE VALIDITÉ
// ======================================================

dateValiditeAcompte.addEventListener(
    "change",
    () => {

        if (dateValiditeAcompte.value) {

            const date =
                new Date(
                    dateValiditeAcompte.value +
                    "T00:00:00"
                );

            const dateFormatee =
                date.toLocaleDateString("fr-FR");

            texteDateValiditeAcompte.textContent =
                `Valide jusqu'au ${dateFormatee}`;
        }


        mettreAJourPreview();
    }
);


// ======================================================
// BOUTON CRÉER
// ======================================================

const btnCreerAcompte =
    document.getElementById(
        "btnCreerAcompte"
    );


// ======================================================
// DESCRIPTION
// ======================================================

designationAcompte.value =
    `Description de l'acompte ${devisSelectionne.numero}`;


designationAcompte.addEventListener(
    "input",
    () => {

        mettreAJourPreview();
    }
);


// ======================================================
// OBTENIR LE PROCHAIN NUMÉRO D'ACOMPTE
// ======================================================

function obtenirProchainNumeroAcompte() {

    let dernierNumero = 0;

    acomptes.forEach(
        (acompte) => {

            const match =
                acompte.numero?.match(
                    /^A-\d{4}-(\d+)$/
                );

            if (match) {

                const numero =
                    Number(match[1]);

                if (
                    numero >
                    dernierNumero
                ) {

                    dernierNumero =
                        numero;
                }
            }
        }
    );


    const prochainNumero =
        dernierNumero + 1;


    return (
        `A-${new Date().getFullYear()}-` +
        `${String(prochainNumero).padStart(5, "0")}`
    );
}


// ======================================================
// AFFICHER LE PROCHAIN NUMÉRO DANS LE PREVIEW
// ======================================================

previewNumeroAcompte.textContent =
    obtenirProchainNumeroAcompte();


// ======================================================
// CRÉER / SAUVEGARDER L'ACOMPTE
// ======================================================

btnCreerAcompte.addEventListener(
    "click",
    () => {

        // ==============================================
        // VÉRIFICATIONS
        // ==============================================

        const valeur =
            Number(valeurAcompte.value);

        if (!valeur || valeur <= 0) {

            alert(
                "Veuillez saisir une valeur pour l'acompte."
            );

            valeurAcompte.focus();

            return;
        }


        // ==============================================
        // TYPE DE CALCUL
        // ==============================================

        const typeCalcul =
            typeCalculAcompte.value;


        // ==============================================
        // CALCUL DU MONTANT HT
        // ==============================================

        let montantHT = 0;

        let pourcentage = null;

        let montantHTSaisi = null;


        if (
            typeCalcul ===
            "pourcentage"
        ) {

            pourcentage =
                valeur;

            if (
                pourcentage >
                100
            ) {

                alert(
                    "Le pourcentage ne peut pas dépasser 100 %."
                );

                return;
            }

            montantHT =
                devisSelectionne.totalHT *
                pourcentage /
                100;
        }


        else if (
            typeCalcul ===
            "devise"
        ) {

            montantHT =
                valeur;

            montantHTSaisi =
                valeur;

            if (
                montantHT >
                devisSelectionne.totalHT
            ) {

                alert(
                    "Le montant de l'acompte ne peut pas dépasser le total HT du devis."
                );

                return;
            }
        }


        // ==============================================
        // CALCUL TVA
        // ==============================================

        const montantTVA =
            montantHT * tauxTVA;


        // ==============================================
        // CALCUL TTC
        // ==============================================

        const montantTTC =
            montantHT + montantTVA;


        // ==============================================
        // RESTE À PAYER
        // ==============================================

        const resteApayer =
            devisSelectionne.totalHT -
            montantHT;


        // ==============================================
        // RÉCUPÉRER LES ACOMPTES EXISTANTS
        // ==============================================

        const acomptesExistants =
            JSON.parse(
                localStorage.getItem(
                    "acomptes"
                )
            ) || [];


        // ==============================================
        // GÉNÉRER LE NUMÉRO
        // ==============================================

        const anneeActuelle =
            new Date().getFullYear();

        let dernierNumero = 0;


        acomptesExistants.forEach(
            (acompte) => {

                const match =
                    acompte.numero?.match(
                        /^A-\d{4}-(\d+)$/
                    );

                if (match) {

                    const numero =
                        Number(match[1]);

                    if (
                        numero >
                        dernierNumero
                    ) {

                        dernierNumero =
                            numero;
                    }
                }
            }
        );


        const nouveauNumero =
            dernierNumero + 1;


        const numeroAcompte =
            `A-${anneeActuelle}-${String(
                nouveauNumero
            ).padStart(5, "0")}`;


        // ==============================================
        // CRÉER L'OBJET ACOMPTE
        // ==============================================

        const nouvelAcompte = {

            id:
                Date.now(),

            numero:
                numeroAcompte,

            devisNumero:
                devisSelectionne.numero,

            devisId:
                devisSelectionne.id || null,


            // Client

            clientId:
                devisSelectionne.clientId2,

            client:
                devisSelectionne.client2,


            // Type de calcul

            typeCalcul:
                typeCalcul,

            pourcentage:
                pourcentage,

            montantHTSaisi:
                montantHTSaisi,


            // Montants

            montantHT:
                montantHT,

            montantTVA:
                montantTVA,

            montantTTC:
                montantTTC,

            resteApayer:
                resteApayer,


            // Informations

            designation:
                designationAcompte.value.trim(),


            // Dates

            dateCreation:
                new Date().toISOString(),

            dateEmission:
                dateEmissionAcompte.value ||
                null,

            dateValidite:
                dateValiditeAcompte.value ||
                null,


            // Statut

            status:
                "Brouillon"
        };


        // ==============================================
        // ENREGISTRER
        // ==============================================

        acomptesExistants.push(
            nouvelAcompte
        );


        localStorage.setItem(
            "acomptes",
            JSON.stringify(
                acomptesExistants
            )
        );


        // ==============================================
        // CONFIRMATION
        // ==============================================

        alert(
            `Acompte ${numeroAcompte} créé avec succès.`
        );


        console.log(
            "Nouvel acompte :",
            nouvelAcompte
        );


        // ==============================================
        // REDIRECTION
        // ==============================================

        window.location.href =
            "facturation.html";
    }
);


// ======================================================
// INITIALISATION DU PREVIEW
// ======================================================

mettreAJourPreview();