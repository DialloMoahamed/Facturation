# Guide pratique — Exercices Facturation (3 → 6)

Ce guide sert à refaire les exercices à la maison **sans recopier les solutions**. L’objectif est de retenir la logique et les méthodes JavaScript utilisées.

---

# 🧠 Méthode générale

Pour chacun des exercices, pense toujours dans cet ordre :

1. Stocker les données
2. Créer
3. Afficher dans le tableau
4. Cliquer sur un élément
5. Afficher ses détails
6. Modifier
7. Supprimer
8. Calculer les totaux
9. Gérer les relations entre documents

Avec `localStorage` :

```js
const elements = JSON.parse(localStorage.getItem("elements")) || [];
```

Pour sauvegarder :

```js
localStorage.setItem("elements", JSON.stringify(elements));
```

---

# 🟦 EXERCICE 3 — Gestion des devis

## 1. Structure d'un devis

Un devis doit au minimum contenir :

- numéro
- client
- articles
- totalHT
- totalTVA
- totalTTC
- date
- status

### Numéro

Format :

```text
D-2026-00001
D-2026-00002
D-2026-00003
```

Logique :

```text
préfixe + année + compteur
```

Le compteur correspond au nombre de devis existants + 1.

---

## 2. Relation Devis → Client

Un devis doit être lié à un client.

Logique :

```text
devis
  ↓
clientId
  ↓
clients.find(...)
  ↓
client
```

À retenir :

### `find()`

> Je cherche un seul élément.

Exemple mental :

```text
Trouve-moi le client dont l'ID correspond à celui du devis.
```

---

## 3. Relation Devis → Articles

Un devis peut avoir plusieurs articles :

```text
Devis
 ├── Article 1
 ├── Article 2
 └── Article 3
```

Les articles du devis sont donc stockés dans un tableau.

Pour chaque article, on retrouve notamment :

- prix HT
- quantité
- TVA
- montant HT

### Formules

```text
Montant HT = prix unitaire HT × quantité
```

```text
TVA = montant HT × taux TVA / 100
```

```text
TTC = HT + TVA
```

---

## 4. Afficher les devis

Tu parcours le tableau :

```js
devis.forEach((devi) => {
    // créer la ligne
});
```

Puis tu construis ton `<tr>`.

Pour identifier la ligne :

```html
<tr data-id="${devi.numero}">
```

---

## 5. Récupérer le devis cliqué

La chaîne importante :

```text
clic sur <tr>
      ↓
ligne.dataset.id
      ↓
numeroDevis
      ↓
devis.find(...)
      ↓
devisSelectionne
```

Exemple de logique :

```js
const numeroDevis = ligne.dataset.id;

const devisSelectionne = devis.find(
    (devi) => devi.numero === numeroDevis
);
```

---

## 6. Remplir l'Offcanvas

Au départ, l'offcanvas peut contenir des informations en dur :

```text
D-2023-0112
Nom du client
10 000 FCFA
Finalisé
```

Pour les rendre dynamiques :

### HTML

Donner un `id` aux éléments :

```html
<h2 id="numeroDevisOffcanvas"></h2>
<span id="nomClientOffcanvas"></span>
```

### JavaScript

Puis utiliser :

```text
document.getElementById(...)
        ↓
textContent
        ↓
devisSelectionne.xxx
```

Cette méthode peut être utilisée pour :

- numéro
- client
- adresse
- date
- statut
- HT
- TVA
- TTC
- articles

---

# 🟨 EXERCICE 4 — Gestion des acomptes

## 1. Comprendre la relation

Un acompte appartient à un devis.

Mais un devis peut avoir plusieurs acomptes :

```text
Devis D-2026-00001
       │
       ├── Acompte 1
       ├── Acompte 2
       └── Acompte 3
```

Il faut donc prévoir une relation **un devis → plusieurs acomptes**.

---

## 2. Structure d'un acompte

Réfléchir aux informations nécessaires :

- numéro
- devis associé
- type
- valeur
- montant HT
- montant TTC
- date

Le type peut être :

```text
pourcentage
```

ou :

```text
espèce / montant
```

---

## 3. Acompte en pourcentage

Exemple :

```text
Devis = 100 000 FCFA HT
Acompte = 30 %
```

Calcul :

```text
100 000 × 30 / 100
= 30 000 FCFA
```

---

## 4. Acompte en montant

Exemple :

```text
Devis = 100 000 FCFA
Acompte = 25 000 FCFA
```

Dans ce cas, la valeur saisie correspond directement au montant.

---

## 5. Trouver le devis associé

Même logique que pour les devis :

```text
devisId
   ↓
devis.find(...)
   ↓
devis associé
```

---

## 6. Numéro d'acompte

Format :

```text
A-2026-00001
A-2026-00002
A-2026-00003
```

La logique est la même que pour les devis.

Seul le préfixe change :

```text
D → devis
A → acompte
```

---

## 7. Détails d'un acompte

Quand on clique sur un acompte :

```text
Acompte
   ↓
Devis associé
   ↓
Informations du devis
   ↓
Montant de l'acompte
```

Plus tard, on pourra également afficher les factures associées.

---

# 🟥 EXERCICE 5 — Gestion des factures

Cet exercice rassemble les notions de **devis + acomptes**.

Relation :

```text
             DEVIS
               │
       ┌───────┴────────┐
       ↓                ↓
   Acompte 1        Acompte 2
       │                │
       └───────┬────────┘
               ↓
            FACTURE
```

---

## 1. Une facture appartient à un devis

Lors de la création :

```text
choisir un devis
       ↓
récupérer ses informations
       ↓
récupérer ses acomptes
       ↓
calculer le reste à payer
```

---

## 2. Récupérer tous les acomptes

Ici, tu dois apprendre à utiliser :

```js
filter()
```

### Différence importante

#### `find()`

Cherche **un seul élément** :

```text
Trouve-moi le devis D-2026-00001.
```

#### `filter()`

Cherche **plusieurs éléments** :

```text
Donne-moi tous les acomptes du devis D-2026-00001.
```

---

## 3. Exemple de calcul

Supposons :

```text
Devis : 100 000 FCFA TTC

Acompte 1 : 20 000
Acompte 2 : 15 000
```

Total des acomptes :

```text
20 000 + 15 000
= 35 000
```

Reste à payer :

```text
100 000 - 35 000
= 65 000
```

---

## 4. Reste à payer

### HT

```text
Reste HT =
Montant devis HT - Total acomptes HT
```

### TTC

```text
Reste TTC =
Montant devis TTC - Total acomptes TTC
```

---

## 5. Statuts d'une facture

Une facture peut avoir :

```text
en attente
payé
en retard
```

Lors de sa création :

```text
status = "en attente"
```

Si l'utilisateur la paie :

```text
status = "payé"
```

---

## 6. Détecter "en retard"

Comparer :

```text
date actuelle
      ↓
date d'expiration
```

Si :

```text
date actuelle > date expiration
```

et que la facture n'est pas payée :

```text
status = "en retard"
```

### Ordre logique

```text
Est-elle payée ?
      ↓
    OUI → payé
      ↓
    NON
      ↓
Date dépassée ?
      ↓
    OUI → en retard
      ↓
    NON → en attente
```

Une facture déjà payée ne doit pas devenir "en retard".

---

# 🟩 EXERCICE 6 — Gestion de la pagination

À faire **après avoir terminé les CRUD**.

## 1. Le problème

Exemple :

```text
100 devis
```

Au lieu de tout afficher :

```text
Afficher : [10 ▼]

< 1 2 3 4 5 6 7 8 9 10 >
```

---

## 2. Les variables importantes

Il faut gérer :

```text
nombre d'éléments par page
page actuelle
nombre total de pages
```

Exemple :

```text
47 devis
10 par page
```

Calcul :

```text
47 / 10 = 4,7
```

Il faut arrondir vers le haut :

```text
5 pages
```

---

## 3. `slice()`

La méthode importante ici :

```js
slice()
```

Exemple mental :

```text
Page 1 → éléments 1 à 10
Page 2 → éléments 11 à 20
Page 3 → éléments 21 à 30
```

Tu vas utiliser `slice()` pour afficher uniquement la partie du tableau correspondant à la page actuelle.

---

# ⭐ Les méthodes JavaScript à maîtriser

À la fin des exercices, tu dois vraiment connaître ces trois méthodes :

| Méthode | Utilisation |
|---|---|
| `find()` | trouver **un** élément |
| `filter()` | trouver **plusieurs** éléments |
| `slice()` | prendre une partie d'un tableau |

### À retenir

```text
find()
→ "Trouve-moi ce devis."

filter()
→ "Donne-moi tous les acomptes de ce devis."

slice()
→ "Donne-moi les 10 éléments de cette page."
```

---

# 🧠 Plan de travail à la maison

## Jour 1 — Devis

- [ ] Créer un devis
- [ ] Générer `D-YYYY-NNNNN`
- [ ] Choisir un client
- [ ] Ajouter des articles
- [ ] Calculer HT
- [ ] Calculer TVA
- [ ] Calculer TTC
- [ ] Afficher dans le tableau
- [ ] Cliquer sur un devis
- [ ] Afficher l'offcanvas
- [ ] Modifier
- [ ] Supprimer

## Jour 2 — Acomptes

- [ ] Créer un acompte
- [ ] Sélectionner un devis
- [ ] Acompte en %
- [ ] Acompte en montant
- [ ] Calculer le montant
- [ ] Générer `A-YYYY-NNNNN`
- [ ] Afficher les acomptes
- [ ] Afficher le détail
- [ ] Modifier
- [ ] Supprimer

## Jour 3 — Factures

- [ ] Créer une facture
- [ ] Sélectionner un devis
- [ ] Récupérer ses acomptes
- [ ] Calculer le total des acomptes
- [ ] Calculer le reste HT
- [ ] Calculer le reste TTC
- [ ] Statut "en attente"
- [ ] Statut "payé"
- [ ] Détecter "en retard"
- [ ] Afficher les factures
- [ ] Modifier
- [ ] Supprimer

## Jour 4 — Pagination

- [ ] Choisir 10 / 20 / 50 éléments
- [ ] Calculer le nombre de pages
- [ ] Afficher la page actuelle
- [ ] Bouton précédent
- [ ] Bouton suivant
- [ ] Cliquer sur une page
- [ ] Utiliser `slice()`

---

# 🔥 La fiche à mémoriser

```text
LOCALSTORAGE
     ↓
JSON.parse()
     ↓
TABLEAU
     ↓
CRUD
     ↓
forEach()
     ↓
HTML dynamique
     ↓
data-id
     ↓
dataset.id
     ↓
find()
     ↓
offcanvas / modal
     ↓
filter()
     ↓
calculs
     ↓
slice()
     ↓
pagination
```

## La question à se poser quand tu bloques

> **Quelle donnée je possède, et quelle donnée je cherche à récupérer ?**

C'est cette logique qui est la plus importante.

Par exemple :

```text
J'ai le numéro du devis
        ↓
Je cherche le devis
        ↓
find()
```

Ou :

```text
J'ai l'ID du devis
        ↓
Je cherche tous ses acomptes
        ↓
filter()
```

Ou :

```text
J'ai 47 éléments
        ↓
Je veux afficher seulement 10
        ↓
slice()
```

**Objectif : comprendre la logique, pas mémoriser les lignes de code.**
