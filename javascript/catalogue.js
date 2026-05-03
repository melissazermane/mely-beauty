// catalogue.js - pour gerer la page des produits avec filtres etc
// pas de backend = manipuler le dom nous memes

document.addEventListener('DOMContentLoaded', function () {

  let grille = document.getElementById('grilleProduits');
  let compteur = document.getElementById('nbResultats');
  let msgAucun = document.getElementById('aucunResultat');
  let champRecherche = document.getElementById('rechercheProduit');
  let selectTri = document.getElementById('triSelect');
  let boutonsFiltres = document.querySelectorAll('.btn-filtre');

  let categorieActive = 'Tous';
  let texteRecherche = '';
  let triActuel = 'defaut';

  // on regarde si on arrive depuis l'accueil en cliquant sur une cat dans li'url (ex: ?categorie=Levres)
  let params = new URLSearchParams(window.location.search);
  let categorieURL = params.get('categorie');
  
  if (categorieURL) {
    categorieActive = categorieURL;
    // mettre en surbrillance le bon boutton
    for(let i=0; i<boutonsFiltres.length; i++) {
      boutonsFiltres[i].classList.remove('actif');
      if (boutonsFiltres[i].dataset.categorie === categorieURL) {
        boutonsFiltres[i].classList.add('actif');
      }
    }
  }

  // filtre tous les produits du tableau global 'produits'
  function obtenirProduitsAffiches() {
    let liste = filtrerParCategorie(categorieActive);

    if (texteRecherche.trim() !== '') {
      let temp = [];
      let terme = texteRecherche.toLowerCase();
      // boucle for clasique
      for(let i=0; i<liste.length; i++){
        if(liste[i].nom.toLowerCase().includes(terme) || liste[i].categorie.toLowerCase().includes(terme)) {
          temp.push(liste[i]);
        }
      }
      liste = temp;
    }

    // ptit sort()
    if (triActuel === 'prix-asc') {
      liste.sort((a, b) => a.prix - b.prix);
    } else if (triActuel === 'prix-desc') {
      liste.sort((a, b) => b.prix - a.prix);
    } else if (triActuel === 'note') {
      liste.sort((a, b) => b.note - a.note);
    }

    return liste;
  }

  function afficherProduits() {
    let liste = obtenirProduitsAffiches();
    grille.innerHTML = '';

    if (liste.length === 0) {
      msgAucun.style.display = 'block';
      compteur.textContent = '0';
    } else {
      msgAucun.style.display = 'none';
      let str = "";
      for(let i=0; i<liste.length; i++){
        str += creerCarteProduit(liste[i]);
      }
      grille.innerHTML = str;
      compteur.textContent = liste.length;
    }
  }

  // event les boutons
  for(let i=0; i<boutonsFiltres.length; i++){
    boutonsFiltres[i].addEventListener('click', function () {
      // enveler lint classe pr tout le mnd
      for(let j=0; j<boutonsFiltres.length; j++){
        boutonsFiltres[j].classList.remove('actif');
      }
      boutonsFiltres[i].classList.add('actif');
      
      categorieActive = boutonsFiltres[i].dataset.categorie;
      afficherProduits();
    });
  }

  // debouncing vite fait pr pas lagguer la req
  let timerRecherche;
  champRecherche.addEventListener('keyup', function () {
    clearTimeout(timerRecherche);
    timerRecherche = setTimeout(function () {
      texteRecherche = champRecherche.value;
      afficherProduits();
    }, 300);
  });

  selectTri.addEventListener('change', function () {
    triActuel = selectTri.value;
    afficherProduits();
  });

  let hamburger = document.getElementById('hamburger');
  let navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('ouvert');
    });
  }

  let userStr = localStorage.getItem('melyBeautyUser');
  let lien = document.getElementById('lienConnexion');
  if (userStr && lien) {
    let user = JSON.parse(userStr);
    lien.textContent = '[Profile] ' + user.prenom;
  }

  // afficher les prod on load pg
  afficherProduits();

});
