// gestion de la page commande et panier view

document.addEventListener('DOMContentLoaded', function () {

  let conteneurListe = document.getElementById('listeArticles');
  let msgVide = document.getElementById('panierVide');
  let conteneurResume = document.getElementById('resumePanier');
  
  let sousTotalEl = document.getElementById('sousTotal');
  let fraisLivraisonEl = document.getElementById('fraisLivraison');
  let totalCommandeEl = document.getElementById('totalCommande');
  let infoLivraisonEl = document.getElementById('infoLivraison');
  let selectWilaya = document.getElementById('cmdWilaya');

  // exemple de prix de livraison
  let tarifsLivraison = {
    "Alger": 300,
    "Oran": 500,
    "Constantine": 500,
    "Annaba": 600,
    "Blida": 400,
    "Tlemcen": 600,
    "Sétif": 500,
    "Batna": 550,
    "Béjaïa": 500,
    "Tizi Ouzou": 500,
    "Autre": 800
  };

  let SEUIL_LIVRAISON_GRATUITE = 3000;

  // func pour dessiner le panier
  function renduPanier() {
    let panier = obtenirPanier();

    if (panier.length === 0) {
      msgVide.style.display = 'block';
      conteneurListe.innerHTML = '';
      conteneurResume.style.display = 'none';
      document.getElementById('btnCommanderBtn').disabled = true;
    } else {
      msgVide.style.display = 'none';
      conteneurResume.style.display = 'block';
      document.getElementById('btnCommanderBtn').disabled = false;
      
      let str = "";
      for(let i=0; i<panier.length; i++) {
        let item = panier[i];
        str += `
          <div class="article-panier" data-id="${item.id}">
            <img src="${item.image}" alt="${item.nom}" class="article-img" onerror="this.src='../images/produit-defaut.jpg'" />
            <div class="article-info">
              <span class="article-categorie">[${item.categorie}]</span>
              <h3 class="article-nom">${item.nom}</h3>
              <p class="article-prix">${item.prix} DA</p>
              <div class="controle-quantite">
                <button class="btn-quantite moins" onclick="changerQuantite(${item.id}, ${item.quantite - 1})">-</button>
                <span class="valeur-quantite">${item.quantite}</span>
                <button class="btn-quantite plus" onclick="changerQuantite(${item.id}, ${item.quantite + 1})">+</button>
              </div>
            </div>
            <button class="btn-supprimer" onclick="retirerArticle(${item.id})">Supprimer X</button>
          </div>
        `;
      }
      conteneurListe.innerHTML = str;
    }

    calculerTotaux();
  }

  // trucs globaux quon appele du html
  window.changerQuantite = function(id, qte) {
    modifierQuantite(id, qte);
    renduPanier();
  };

  window.retirerArticle = function(id) {
    if (confirm("Supprimer cet article ?")) {
      supprimerDuPanier(id);
      renduPanier();
    }
  };


  function calculerTotaux() {
    let sousTotal = calculerTotal(); 
    let fraisLivraison = 0;
    
    let wilayaChoisie = selectWilaya.value;
    if (wilayaChoisie !== "") {
      if(tarifsLivraison[wilayaChoisie]) {
        fraisLivraison = tarifsLivraison[wilayaChoisie];
      } else {
        fraisLivraison = tarifsLivraison["Autre"];
      }
    } else {
      fraisLivraison = 500; // prix de base
    }

    let isGratuit = false;
    if (sousTotal >= SEUIL_LIVRAISON_GRATUITE) {
      fraisLivraison = 0;
      isGratuit = true;
    }

    let totFinal = sousTotal + fraisLivraison;

    sousTotalEl.textContent = sousTotal + ' DA';
    
    if (isGratuit) {
      fraisLivraisonEl.textContent = 'Gratuite!';
      fraisLivraisonEl.style.color = 'green';
      infoLivraisonEl.textContent = 'Livraison gratuite atteinte.';
    } else {
      fraisLivraisonEl.textContent = fraisLivraison + ' DA';
      fraisLivraisonEl.style.color = 'black';
      let reste = SEUIL_LIVRAISON_GRATUITE - sousTotal;
      infoLivraisonEl.textContent = `Plus que ${reste} DA pour la livraison gratuite.`;
    }

    totalCommandeEl.textContent = totFinal + ' DA';
  }

  selectWilaya.addEventListener('change', calculerTotaux);


  // autoload du formulaire
  let sessionUser = localStorage.getItem('melyBeautyUser');
  if (sessionUser) {
    let user = JSON.parse(sessionUser);
    
    if(document.getElementById('cmdPrenom')) document.getElementById('cmdPrenom').value = user.prenom;
    if(document.getElementById('cmdNom'))    document.getElementById('cmdNom').value = user.nom;
    if(document.getElementById('cmdEmail'))  document.getElementById('cmdEmail').value = user.email;

    let lienConnexion = document.getElementById('lienConnexion');
    if (lienConnexion) {
      lienConnexion.textContent = '[Profile] ' + user.prenom;
    }
  }


  // form sub
  let formCmd = document.getElementById('formCommande');

  let REGEX = {
    email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
    telephone: /^(05|06|07)[0-9]{8}$/,
    nomPrenom: /^[a-zA-ZÀ-ÿ\-\s]{2,}$/
  };

  function displayErr(id, msg, inp) {
    if(document.getElementById(id)) document.getElementById(id).textContent = msg;
    if(inp) {
      if(msg) inp.style.borderColor = 'red';
      else inp.style.borderColor = 'green';
    }
  }

  document.getElementById('btnCommanderBtn').addEventListener('click', function(e) {
    e.preventDefault();

    let prenom = document.getElementById('cmdPrenom');
    let nom = document.getElementById('cmdNom');
    let email = document.getElementById('cmdEmail');
    let telephone = document.getElementById('cmdTelephone');
    let wilaya = document.getElementById('cmdWilaya');
    let adresse = document.getElementById('cmdAdresse');

    let ok = true;

    if (!REGEX.nomPrenom.test(prenom.value.trim())) { displayErr('err-cmdPrenom', 'Prénom invalide.', prenom); ok = false; } 
    else { displayErr('err-cmdPrenom', '', prenom); }

    if (!REGEX.nomPrenom.test(nom.value.trim())) { displayErr('err-cmdNom', 'Nom invalide.', nom); ok = false; } 
    else { displayErr('err-cmdNom', '', nom); }

    if (!REGEX.email.test(email.value.trim())) { displayErr('err-cmdEmail', 'Email invalide.', email); ok = false; } 
    else { displayErr('err-cmdEmail', '', email); }

    if (!REGEX.telephone.test(telephone.value.trim())) { displayErr('err-cmdTelephone', 'ex: 05XXXXXXXX.', telephone); ok = false; } 
    else { displayErr('err-cmdTelephone', '', telephone); }

    if (wilaya.value === "") { displayErr('err-cmdWilaya', 'Wilaya vide.', wilaya); ok = false; } 
    else { displayErr('err-cmdWilaya', '', wilaya); }

    if (adresse.value.trim().length < 5) { displayErr('err-cmdAdresse', 'Adresse trop courte.', adresse); ok = false; } 
    else { displayErr('err-cmdAdresse', '', adresse); }

    if (!ok) return;

    let btnCommander = document.getElementById('btnCommanderBtn');
    btnCommander.textContent = "Traitement...";
    btnCommander.disabled = true;

    // ptit faux delai pr faire realiste
    setTimeout(() => {
      localStorage.removeItem('panierMely');
      mettreAJourBadgePanier();

      document.getElementById('msgSuccesCmd').style.display = 'block';
      formCmd.style.display = 'none';
      conteneurListe.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
          <h3>Merci pour votre commande !</h3>
          <p>Un email a été envoyé à ${email.value}.</p>
        </div>
      `;
      conteneurResume.style.display = 'none';
      
      window.scrollTo(0, 0);
    }, 1500);

  });

  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('ouvert');
    });
  }

  renduPanier();

});
