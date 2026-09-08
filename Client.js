const clients = JSON.parse(localStorage.getItem("clients")) || [];

const content = document.getElementById("contenu");

const form = document.getElementById("clientForm");

// =====================================================
// Afficher UN CLIENT
// =====================================================

function afficherClient() {
  content.innerHTML = "";

  clients.forEach((client) => {
    content.innerHTML += `
        <div class="">
            <div class="d-flex justify-content-between align-items-center m-0">
                <span class="fw-bold text-primary mt-4 fs-5">${client.designation}</span>
                <div class="d-flex gap-4 text-secondary fs-2">
                <i class="bi bi-pen-fill fs-5" onclick="openEditModal(${client.id})"></i>
                <i class="bi bi-trash-fill fs-5" onclick="askDelete(${client.id})"></i>
                </div>
            </div>
            <div class="d-flex flex-column">
                <small>${client.email}</small>
                <small>${client.adress}</small>
            </div>
        </div>`;
  });
}

// =====================================================
// AJOUTER UN CLIENT
// =====================================================

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const designation = document.getElementById("designationClient").value;

  const email = document.getElementById("emailClient").value;

  const localisation = document.getElementById("localisationClient").value;

  const adress = document.getElementById("adressClient").value;

  const description = document.getElementById("descriptionClient").value;

  let id = 0;

  if (clients.length == 0) {
    id = 1;
  } else {
    const dernierId = Math.max(...clients.map((client) => client.id));
    id = dernierId + 1;
  }

  const client = {
    id: id,
    designation: designation,
    email: email,
    localisation: localisation,
    adress: adress,
    description: description,
  };

  clients.push(client);

  localStorage.setItem("clients", JSON.stringify(clients));

  afficherClient();

  form.reset();

  const Offcanvas = document.getElementById("offcanvasCreerClient");
  const bsOffcanvas = new bootstrap.Offcanvas(Offcanvas);

  if (bsOffcanvas) {
    bsOffcanvas.hide();
  }
});

// =====================================================
// MODIFIER UN CLIENT
// =====================================================

function openEditModal(id) {
  const client = clients.find((client) => client.id === Number(id));

  if (!client) {
    console.log("Client introuvable");
    return;
  }

  // Remplir la modale avec les informations de l'article

  document.getElementById("modifierClientId").value = client.id;

  document.getElementById("modifierDesignationClient").value = client.designation;

  document.getElementById("modifierEmailClient").value = client.email;

  document.getElementById("modifierLocalisationClient").value = client.localisation;

  document.getElementById("modifierAdressClient").value = client.adress;

  document.getElementById("modifierDescriptionClient").value = client.description;

  // Garder l'ID du client à modifier

  document
    .getElementById("formModifierClient")
    .setAttribute("data-id", client.id);

  // Ouvrir la offcanvas

  const Offcanvase = document.getElementById("offcanvasModifierClient");
  const bsOffcanvase = new bootstrap.Offcanvas(Offcanvase);

  if (bsOffcanvase) {
    bsOffcanvase.show();
  }
}

// =====================================================
// SAUVEGARDER LES MODIFICATIONS
// =====================================================

function modifierClient() {
  const id = Number(document.getElementById("modifierClientId").value);

  const client = clients.find((client) => client.id === id);

  if (!client) {
    console.log("Client introuvable");
    return;
  }

  client.designation = document.getElementById("modifierDesignationClient").value;

  client.email = document.getElementById("modifierEmailClient").value;

  client.localisation = document.getElementById("modifierLocalisationClient").value;

  client.adress = document.getElementById("modifierAdressClient").value;

  client.description = document.getElementById("modifierDescriptionClient").value;

  localStorage.setItem("clients", JSON.stringify(clients));

  afficherClient();

  const Offcanva = document.getElementById("offcanvasModifierClient");

  const bOffcanvas = new bootstrap.Offcanvas(Offcanva);

  if (bOffcanvas) {
    bOffcanvas.hide();
  }
}

// =====================================================
// PRÉPARER LA SUPPRESSION
// =====================================================

let clientToDelete = null;

function askDelete(id) {
  const client = clients.find((client) => client.id === Number(id));

  if (!client) {
    console.log("Client introuvable");
    return;
  }

  // Garder l'ID de le client à supprimer

  clientToDelete = client.id;

  // Afficher son RFID dans la modale

  document.getElementById("deleteClient").textContent = client.designation;

  // Ouvrir la modale

  const modal = document.getElementById("sprimerClientModal");
  const bsModal = new bootstrap.Modal(modal);

  if (bsModal) {
    bsModal.show();
  }
}

// =====================================================
// CONFIRMER LA SUPPRESSION
// =====================================================

document
  .getElementById("confirmDeleteClient")
  .addEventListener("click", () => {
    if (clientToDelete === null) {
      return;
    }

    // Trouver la position de le client

    const index = clients.findIndex(
      (client) => client.id === clientToDelete,
    );

    if (index === -1) {
      return;
    }

    // Supprimer le client

    clients.splice(index, 1);

    // Sauvegarder

    localStorage.setItem("clients", JSON.stringify(clients));

    // Réafficher

    afficherClient();

    // Fermer la modale

    const modal = document.getElementById("sprimerClientModal");
    const bsModal = new bootstrap.Modal(modal);

    if (bsModal) {
      bsModal.hide();
    }

    // Réinitialiser

    articleToDelete = null;

    alert("Client supprimé avec succés");
  });

afficherClient();
