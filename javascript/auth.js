// auth.js - gestion des users
// pour pas avoir de backend on utilise un const au debut

const utilisateursParDefaut = [
  {
    prenom: "Amira",
    nom: "Benali",
    email: "amira@melybeauty.dz",
    telephone: "0555001122",
    motDePasse: "Amira2024!"
  },
  {
    prenom: "Admin",
    nom: "Mely",
    email: "admin@melybeauty.dz",
    telephone: "0666001122",
    motDePasse: "Admin@2024"
  }
];

function initialiserUtilisateurs() {
  if (!localStorage.getItem('melyBeautyUsers')) {
    localStorage.setItem('melyBeautyUsers', JSON.stringify(utilisateursParDefaut));
  }
}

function obtenirUtilisateurs() {
  const data = localStorage.getItem('melyBeautyUsers');
  if(data) {
    return JSON.parse(data);
  }
  return [];
}

// Regex demandées dans l'enoncé
const REGEX = {
  email: /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  telephone: /^(05|06|07)[0-9]{8}$/, // tel algerien
  motDePasse: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&!#])[A-Za-z\d@$!%*?&!#]{8,}$/,
  nomPrenom: /^[a-zA-ZÀ-ÿ\-\s]{2,}$/
};

function afficherErreurChamp(idErreur, message, input) {
  const spanErreur = document.getElementById(idErreur);
  if (spanErreur) {
    spanErreur.textContent = message;
  }
  if (input) {
    if (message) {
      input.style.borderColor = 'red';
    } else {
      input.style.borderColor = 'green';
    }
  }
}

function calculerForceMdp(mdp) {
  let score = 0;
  if (mdp.length >= 8) score++;
  if (/[A-Z]/.test(mdp)) score++;
  if (/[0-9]/.test(mdp)) score++;
  if (/[@$!%*?&!#]/.test(mdp)) score++;
  return score;
}

function mettreAJourForceMdp(mdp) {
  const barre = document.getElementById('barreForceMdp');
  const texte = document.getElementById('texteForceMdp');
  if (!barre || !texte) return;

  const force = calculerForceMdp(mdp);
  const pourcentage = (force / 4) * 100;
  
  // couleurs de force
  let c = 'red';
  let t = 'Faible';
  if (force === 2) { c = 'orange'; t = 'Moyen'; }
  if (force === 3) { c = 'yellowgreen'; t = 'Fort'; }
  if (force === 4) { c = 'green'; t = 'Très fort'; }

  barre.style.width = pourcentage + '%';
  barre.style.backgroundColor = c;
  if(mdp.length > 0){
    texte.textContent = t;
    texte.style.color = c;
  } else {
    texte.textContent = '';
  }
}

// script inscription
const formInscription = document.getElementById('formInscription');

if (formInscription) {
  const inputMdp = document.getElementById('motDePasse');
  if (inputMdp) {
    inputMdp.addEventListener('input', function () {
      mettreAJourForceMdp(inputMdp.value);
    });
  }

  // gerer les boutons oeil mdp
  configurerToggleMdp('toggleMdp1', 'motDePasse');
  configurerToggleMdp('toggleMdp2', 'confirmMdp');

  document.getElementById('btnInscription').addEventListener('click', function (e) {
    const prenom = document.getElementById('prenom');
    const nom = document.getElementById('nom');
    const email = document.getElementById('email');
    const telephone = document.getElementById('telephone');
    const mdp = document.getElementById('motDePasse');
    const confirmMdp = document.getElementById('confirmMdp');
    const conditions = document.getElementById('conditions');

    let estValide = true;

    if (!REGEX.nomPrenom.test(prenom.value.trim())) {
      afficherErreurChamp('err-prenom', 'Prénom invalide (min 2 lettres).', prenom);
      estValide = false;
    } else {
      afficherErreurChamp('err-prenom', '', prenom);
    }

    if (!REGEX.nomPrenom.test(nom.value.trim())) {
      afficherErreurChamp('err-nom', 'Nom invalide.', nom);
      estValide = false;
    } else {
      afficherErreurChamp('err-nom', '', nom);
    }

    if (!REGEX.email.test(email.value.trim())) {
      afficherErreurChamp('err-email', 'Email invalide.', email);
      estValide = false;
    } else {
      afficherErreurChamp('err-email', '', email);
    }

    if (!REGEX.telephone.test(telephone.value.trim())) {
      afficherErreurChamp('err-telephone', 'Tél algérien invalide (ex:05...).', telephone);
      estValide = false;
    } else {
      afficherErreurChamp('err-telephone', '', telephone);
    }

    if (!REGEX.motDePasse.test(mdp.value)) {
      afficherErreurChamp('err-motDePasse', 'Min 8 char, 1 maj, 1 chiffre, 1 spécial.', mdp);
      estValide = false;
    } else {
      afficherErreurChamp('err-motDePasse', '', mdp);
    }

    if (mdp.value !== confirmMdp.value) {
      afficherErreurChamp('err-confirmMdp', 'Les MDP ne correspondent pas.', confirmMdp);
      estValide = false;
    } else {
      afficherErreurChamp('err-confirmMdp', '', confirmMdp);
    }

    if (!conditions.checked) {
      afficherErreurChamp('err-conditions', 'Vous devez accepter les conditions.', null);
      estValide = false;
    } else {
      afficherErreurChamp('err-conditions', '', null);
    }

    if (!estValide) {
      console.log('formulaire invalide');
      return;
    }

    // verif email existe
    let utilisateurs = obtenirUtilisateurs();
    let emailExist = false;
    for(let i=0; i<utilisateurs.length; i++) {
      if(utilisateurs[i].email === email.value.trim().toLowerCase()){
        emailExist = true;
      }
    }

    if (emailExist) {
      document.getElementById('msgErreur').style.display = 'block';
      document.getElementById('msgErreur').textContent = 'Email déjà utilisé.';
      return;
    }

    // save le new user
    utilisateurs.push({
      prenom: prenom.value.trim(),
      nom: nom.value.trim(),
      email: email.value.trim().toLowerCase(),
      telephone: telephone.value.trim(),
      motDePasse: mdp.value
    });
    localStorage.setItem('melyBeautyUsers', JSON.stringify(utilisateurs));

    document.getElementById('msgErreur').style.display = 'none';
    document.getElementById('msgSucces').style.display = 'block';
    
    // redirect apres 2 sec
    setTimeout(function () {
      window.location.href = 'connexion.html';
    }, 2000);
  });
}

// script connexion
const formConnexion = document.getElementById('formConnexion');

if (formConnexion) {
  configurerToggleMdp('toggleMdpConn', 'mdpConn');

  document.getElementById('btnConnexion').addEventListener('click', function (e) {
    let emailConn = document.getElementById('emailConn');
    let mdpConn = document.getElementById('mdpConn');
    
    let ok = true;
    if (!REGEX.email.test(emailConn.value.trim())) {
      afficherErreurChamp('err-emailConn', 'Email invalide.', emailConn);
      ok = false;
    } else {
      afficherErreurChamp('err-emailConn', '', emailConn);
    }

    if (mdpConn.value.trim() === '') {
      afficherErreurChamp('err-mdpConn', 'MDP vide.', mdpConn);
      ok = false;
    } else {
      afficherErreurChamp('err-mdpConn', '', mdpConn);
    }

    if (!ok) return;

    let utilisateurs = obtenirUtilisateurs();
    let userFound = null;
    for(let i=0; i<utilisateurs.length; i++){
      if(utilisateurs[i].email === emailConn.value.trim().toLowerCase() && utilisateurs[i].motDePasse === mdpConn.value){
        userFound = utilisateurs[i];
      }
    }

    if (!userFound) {
      document.getElementById('msgErreur').style.display = 'block';
      document.getElementById('msgErreur').textContent = 'Identifiants incorrects.';
      return;
    }

    // on met le current user dans session localstorage
    localStorage.setItem('melyBeautyUser', JSON.stringify({
      prenom: userFound.prenom,
      nom: userFound.nom,
      email: userFound.email
    }));

    document.getElementById('msgErreur').style.display = 'none';
    document.getElementById('msgSucces').style.display = 'block';
    document.getElementById('msgSucces').textContent = "Connecté avec succès. Redirection...";

    setTimeout(function () {
      window.location.href = '../index.html';
    }, 1000);
  });
}

// helper pour remplir vite fait pour le test
function remplirDemo(email, mdp) {
  let champEmail = document.getElementById('emailConn');
  let champMdp = document.getElementById('mdpConn');
  if (champEmail && champMdp) {
    champEmail.value = email;
    champMdp.value = mdp;
  }
}

// ptite fonction pour l oeil du mdp
function configurerToggleMdp(idBtn, idInp) {
  let btn = document.getElementById(idBtn);
  let inp = document.getElementById(idInp);
  if (btn && inp) {
    btn.addEventListener('click', function () {
      if (inp.type === 'password') {
        inp.type = 'text';
      } else {
        inp.type = 'password';
      }
    });
  }
}

// au chargement general
document.addEventListener('DOMContentLoaded', function () {
  initialiserUtilisateurs();
  
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('ouvert');
    });
  }

  const uStr = localStorage.getItem('melyBeautyUser');
  const lien = document.getElementById('lienConnexion');
  if (uStr && lien) {
    let u = JSON.parse(uStr);
    lien.textContent = '[Profile] ' + u.prenom;
  }
});
