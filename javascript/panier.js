// gestion du panier localstorage
// on utilise ça pour éviter d'avoir besoin du backend

function obtenirPanier() {
  const data = localStorage.getItem('panierMely');
  // console.log("data panier", data); // test
  if (data) {
    return JSON.parse(data);
  } else {
    return [];
  }
}

function sauvegarderPanier(p) {
  localStorage.setItem('panierMely', JSON.stringify(p));
}

function ajouterAuPanier(idProduit) {
  const produit = produits.find(function(p) {
    return p.id === idProduit;
  });
  
  if (!produit) {
    console.error("produit non trouvé id:", idProduit)
    return;
  }

  let panier = obtenirPanier();
  // on cherche si il est deja dedans
  let isExist = false;
  
  for (let i = 0; i < panier.length; i++) {
    if (panier[i].id === idProduit) {
      panier[i].quantite += 1;
      isExist = true;
      break;
    }
  }

  if (!isExist) {
    panier.push({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.image,
      categorie: produit.categorie,
      quantite: 1
    });
  }

  sauvegarderPanier(panier);
  mettreAJourBadgePanier();
  
  // on affiche juste une alerte simple pour faire simple
  alert(produit.nom + " a été ajouté au panier !");
}

function supprimerDuPanier(id) {
  let panier = obtenirPanier();
  panier = panier.filter(item => item.id !== id);
  sauvegarderPanier(panier);
  mettreAJourBadgePanier();
}

function modifierQuantite(id, nouvelleQuantite) {
  if (nouvelleQuantite <= 0) {
    supprimerDuPanier(id);
    return;
  }
  let panier = obtenirPanier();
  for (let i = 0; i < panier.length; i++) {
    if (panier[i].id === id) {
      panier[i].quantite = nouvelleQuantite;
    }
  }
  sauvegarderPanier(panier);
  mettreAJourBadgePanier();
}

function calculerTotal() {
  let panier = obtenirPanier();
  let tot = 0;
  for (let i = 0; i < panier.length; i++) {
    tot += panier[i].prix * panier[i].quantite;
  }
  return tot;
}

function compterArticles() {
  let panier = obtenirPanier();
  let count = 0;
  for (let i = 0; i < panier.length; i++) {
    count += panier[i].quantite;
  }
  return count;
}

function mettreAJourBadgePanier() {
  let badge = document.getElementById('badgePanier');
  if (badge) {
    let c = compterArticles();
    badge.innerHTML = c;
    if(c > 0) {
      badge.style.display = 'flex'; // display flex pour centrer
    } else {
      badge.style.display = 'none';
    }
  }
}

// executer ça quand le doc est prèt
document.addEventListener('DOMContentLoaded', function () {
  mettreAJourBadgePanier();
});
