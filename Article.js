const articles = JSON.parse(localStorage.getItem("articles")) || [];

const tbody = document.getElementById("listeArticles");

const form = document.getElementById("articleForm");


// =====================================================
// Afficher UN ARTICLE
// =====================================================

function afficherArticle() {
    
    tbody.innerHTML = "";

    articles.forEach((article) => {
        
        tbody.innerHTML += `
        <tr>
            <th scope="row">${article.designation}</th>
            <td>${article.type}</td>
            <td>${article.unite}</td>
            <td>${article.prix}</td>
            <td>${article.taxe} %</td>
            <td>
                <div class="d-flex gap-4">
                    <i class="bi bi-pen-fill fs-5" onclick="openEditModal(${article.id})"></i>
                    <i class="bi bi-trash-fill fs-5" onclick="askDelete(${article.id})"></i>
                </div>
            </td>
        </tr>`;
    });

}


// =====================================================
// AJOUTER UN ARTICLE
// =====================================================

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const designation = document.getElementById("designation").value;

    const type = document.getElementById("typeArticle").value;

    const unite = document.getElementById("uniteArticle").value;

    const prix = Number(document.getElementById("prixArticle").value);

    const taxe = Number(document.getElementById("taxeArticle").value);

    const description = document.getElementById("descriptionArticle").value;

    let id = 0;

    if (articles.length == 0) {
        id = 1
    } else {
        const dernierId = Math.max(...articles.map((article) => article.id));
        id = dernierId + 1
    }


    const article = {
        id: id,
        designation: designation,
        type: type,
        unite: unite,
        prix: prix,
        taxe: taxe,
        description: description
    };

    articles.push(article);

    localStorage.setItem("articles", JSON.stringify(articles));

    afficherArticle();

    form.reset();

    const Offcanvas = document.getElementById("offcanvasCreerArticle");
    const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas);

    if (bsOffcanvas) {
        bsOffcanvas.hide();
    }

});


// =====================================================
// MODIFIER UN ARTICLE
// =====================================================

function openEditModal(id) {

    const article = articles.find(
        (article) => article.id === Number(id)
    );


    if (!article) {
        console.log("Article introuvable");
        return;
    }


    // Remplir la modale avec les informations de l'article

    document.getElementById("modifierArticleId").value =
        article.id;

    document.getElementById("modifierDesignation").value =
        article.designation;

    document.getElementById("modifierType").value =
        article.type;

    document.getElementById("modifierUnite").value =
        article.unite;

    document.getElementById("modifierPrix").value =
        article.prix;

    document.getElementById("modifierTaxe").value =
        article.taxe;

    document.getElementById("modifierDescription").value =
        article.description;


    // Garder l'ID de l'article à modifier

    document
        .getElementById("formModifierArticle")
        .setAttribute("data-id", article.id);


    // Ouvrir la offcanvas

    const Offcanvase = document.getElementById("offcanvasModifierArticle");
    const bsOffcanvase = new bootstrap.Offcanvas(Offcanvase);

    if (bsOffcanvase) {
        bsOffcanvase.show();
    }

}


// =====================================================
// SAUVEGARDER LES MODIFICATIONS
// =====================================================

function modifierArticle() {

    const id = Number(
        document.getElementById("modifierArticleId").value
    );

    const article = articles.find(
        (article) => article.id === id
    );

    if (!article) {
        console.log("Article introuvable");
        return;
    }

    article.designation =
        document.getElementById("modifierDesignation").value;

    article.type =
        document.getElementById("modifierType").value;

    article.unite =
        document.getElementById("modifierUnite").value;

    article.prix =
        Number(document.getElementById("modifierPrix").value);

    article.taxe =
        Number(document.getElementById("modifierTaxe").value);

    article.description =
        document.getElementById("modifierDescription").value;

    localStorage.setItem(
        "articles",
        JSON.stringify(articles)
    );

    afficherArticle();

    const Offcanva =
        document.getElementById("offcanvasModifierArticle");

    const bOffcanvas =
        new bootstrap.Offcanvas(Offcanva);

    if (bOffcanvas) {
        bOffcanvas.hide();
    }    

}

// =====================================================
// PRÉPARER LA SUPPRESSION
// =====================================================

let articleToDelete = null;

function askDelete(id) {

    const article = articles.find(
        (article) => article.id === Number(id)
    );

    if (!article) {
        console.log("Article introuvable");
        return;
    }

    // Garder l'ID de l'article à supprimer

    articleToDelete = article.id;

    // Afficher son RFID dans la modale

    document.getElementById("deleteArticle").textContent =
        article.designation;

    // Ouvrir la modale

    const modal = document.getElementById("sprimerModal");
    const bsModal = new bootstrap.Modal(modal);

    if (bsModal) {
        bsModal.show();
    }

}


// =====================================================
// CONFIRMER LA SUPPRESSION
// =====================================================

document
    .getElementById("confirmDeleteArticle")
    .addEventListener("click", () => {


        if (articleToDelete === null) {
            return;
        }

        // Trouver la position de l'article

        const index = articles.findIndex(
            (article) => article.id === articleToDelete
        );

        if (index === -1) {
            return;
        }

        // Supprimer l'article

        articles.splice(index, 1);

        // Sauvegarder

        localStorage.setItem(
            "articles",
            JSON.stringify(articles)
        );

        // Réafficher

        afficherArticle();

        // Fermer la modale

        const modal = document.getElementById("sprimerModal");
        const bsModal = new bootstrap.Modal(modal);

        if (bsModal) {
            bsModal.hide();
        }

        // Réinitialiser

        articleToDelete = null;

        alert("Article supprimé avec succés");
});

afficherArticle();