// script pour l'accueil

document.addEventListener('DOMContentLoaded', function () {

  const conteneurBestSellers = document.getElementById('bestSellers');
  if (conteneurBestSellers) {
    let bs = obtenirBestSellers(4);
    let str = "";
    for(let i=0; i<bs.length; i++) {
      str += creerCarteProduit(bs[i]);
    }
    conteneurBestSellers.innerHTML = str;
  }

  // gerer le menu telephone (hamburger)
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('ouvert'); // ptit effet
    });

    let links = navLinks.getElementsByTagName('a');
    for(let i=0; i<links.length; i++){
      links[i].addEventListener('click', function () {
        navLinks.classList.remove('ouvert');
      });
    }
  }

  // on verifie si la personne est connectée pour changer la nav
  const userStr = localStorage.getItem('melyBeautyUser');
  const lienConnexion = document.getElementById('lienConnexion');
  if (userStr && lienConnexion) {
    const u = JSON.parse(userStr);
    // console.log("user:", u.prenom);
    lienConnexion.textContent = '[Profile] ' + u.prenom;
  }

});
