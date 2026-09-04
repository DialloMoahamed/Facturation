const articles = JSON.parse(localStorage.getItem("articles")) || [];

const tbody = document.getElementById("listeArticles");

const form = document.getElementById("articleForm");


function preparerCreation() {
    
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
                    <i class="bi bi-pen-fill fs-5"></i>
                    <i class="bi bi-trash-fill fs-5"></i>
                </div>
            </td>
        </tr>`;
    });

}

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

    preparerCreation();

    form.reset();

    const Offcanvas = document.getElementById("offcanvasCreerArticle");
    const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas);


    bsOffcanvas.hide();
    
});


// =====================================================
// MODIFIER UN ANIMAL
// =====================================================

function openEditModal(id) {

    const article = articles.find(
        (article) => article.id === Number(id)
    );


    if (!article) {
        console.log("Article introuvable");
        return;
    }


    // Remplir la modale avec les informations de l'animal

    document.getElementById("modifierArticleId").value =
        animal.id;

    document.getElementById("modifierDesignation").value =
        animal.designation;

    document.getElementById("modifierType").value =
        animal.type;

    document.getElementById("modifierUnite").value =
        animal.unite;

    document.getElementById("modifierPrix").value =
        animal.prix;

    document.getElementById("modifierTaxe").value =
        animal.taxe;

    document.getElementById("modifierDescription").value =
        animal.description;


    // Garder l'ID de l'animal à modifier

    document
        .getElementById("formModifierArticle")
        .setAttribute("data-id", article.id);


    // Ouvrir la offcanvas

    const Offcanvas = document.getElementById("offcanvasModifierArticleLabel");
    const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas);


    bsOffcanvas.show();

}


// =====================================================
// SAUVEGARDER LES MODIFICATIONS
// =====================================================

document
    .getElementById("formModifierArticle")
    .addEventListener("submit", (e) => {

        e.preventDefault();

        // Récupérer l'ID de l'animal

        const id = Number(
            e.target.getAttribute("data-id")
        );

        // Rechercher l'animal

        const article = articles.find(
            (article) => article.id === id
        );

        if (!article) {
            console.log("Article introuvable");
            return;
        }

        // Modifier ses informations

        animal.id =
            document.getElementById("modifierArticleId").value;

        animal.designation =
            document.getElementById("modifierDesignation").value;

        animal.type =
            document.getElementById("modifierType").value;

        animal.unite =
            document.getElementById("modifierUnite").value;

        animal.prix =
            document.getElementById("modifierPrix").value;

        // Sauvegarder dans localStorage

        localStorage.setItem(
            "articles",
            JSON.stringify(articles)
        );

        // Réafficher le tableau

        afficherAnimaux();

        // Fermer la modale

        const Offcanvas = document.getElementById("offcanvasModifierArticleLabel");
        const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas);


        bsOffcanvas.show();

        console.log("Animal modifié :", animal);
});

preparerCreation();