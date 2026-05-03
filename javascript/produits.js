// fichier qui contient nos données sur les produits
// on utilise un tab comme dit dans le sujet au liue du backend

const produits = [
  // Categorie : Levres
  {
    id: 1,
    nom: "Adventure Time Tinted Lip Mask",
    categorie: "Lèvres",
    prix: 1400,
    image: "../images/lip_mask.jpg",
    description: "Masque hydratant teinté pour les lèvres, collection Adventure Time.",
    note: 4.8
  },
  {
    id: 2,
    nom: "Creme Allure Lipstick - Nude",
    categorie: "Lèvres",
    prix: 1250,
    image: "../images/lip_nude.jpg",
    description: "Rouge à lèvres crémeux au fini satiné, teinte nude parfaite.",
    note: 4.6
  },
  {
    id: 3,
    nom: "Starlight Velvet Lipstick",
    categorie: "Lèvres",
    prix: 1350,
    image: "../images/lip_starlight.jpg",
    description: "Rouge à lèvres velours longue tenue avec un éclat subtil.",
    note: 4.7
  },

  // Categorie : Teint
  {
    id: 5,
    nom: "Camera On Smooth & Blur Primer",
    categorie: "Teint",
    prix: 1600,
    image: "../images/primer_blur.jpg",
    description: "Base de teint lissante pour un effet peau de bébé.",
    note: 4.7
  },
  {
    id: 6,
    nom: "Color Bloom Liquid Blush",
    categorie: "Teint",
    prix: 1500,
    image: "../images/blush_liquid.jpg",
    description: "Blush liquide viral, facile à estomper pour un fini naturel.",
    note: 4.9
  },
  {
    id: 7,
    nom: "Fine Line 2-In-1 Contour Pen",
    categorie: "Teint",
    prix: 1300,
    image: "../images/contour_pen.jpg",
    description: "Stylo double embout pour un contouring précis du nez.",
    note: 4.5
  },
  {
    id: 8,
    nom: "Good Grip Hydrating Primer",
    categorie: "Teint",
    prix: 1700,
    image: "../images/primer_grip.jpg",
    description: "Base hydratante qui accroche le maquillage toute la journée.",
    note: 4.6
  },
  {
    id: 19,
    nom: "Harry Potter Golden Snitch Highlighter",
    categorie: "Teint",
    prix: 1950,
    image: "../images/highlighter_potter.jpg",
    description: "lluminateur magique vif de la collection Harry Potter.",
    note: 4.9
  },
  {
    id: 20,
    nom: "Melt Touch Ultra-Hydrating Primer",
    categorie: "Teint",
    prix: 1650,
    image: "../images/primer_melt.jpg",
    description: "Base ultra hydratante qui fond instantanément sur la peau.",
    note: 4.4
  },
  {
    id: 21,
    nom: "Pore Eraser Blurring Stick",
    categorie: "Teint",
    prix: 1200,
    image: "../images/pore_stick.jpg",
    description: "Stick flouteur de pores pour un fini mat et lisse.",
    note: 4.3
  },

  // Categorie : Yeux
  {
    id: 9,
    nom: "Lashlighter Up & Out Mascara",
    categorie: "Yeux",
    prix: 1100,
    image: "../images/mascara_up.jpg",
    description: "Mascara volume et longueur pour un regard intense.",
    note: 4.8
  },
  {
    id: 10,
    nom: "Lash Besties 2-In-1 Mascara",
    categorie: "Yeux",
    prix: 1450,
    image: "../images/mascara_2in1.jpg",
    description: "Mascara double brosse pour un volume sur mesure.",
    note: 4.7
  },
  {
    id: 11,
    nom: "Pro Precision Liquid Eyeliner",
    categorie: "Yeux",
    prix: 950,
    image: "../images/eyeliner_black.jpg",
    description: "Eyeliner noir waterproof avec pointe ultra fine.",
    note: 4.6
  },

  // Categorie : Sourcils
  {
    id: 13,
    nom: "Set Me Up Brow Gel",
    categorie: "Sourcils",
    prix: 950,
    image: "../images/brow_gel.jpg",
    description: "Gel fixateur transparent pour des sourcils parfaits.",
    note: 4.7
  },

  // Categorie : Palettes
  {
    id: 16,
    nom: "Showtime In Seattle Palette",
    categorie: "Palettes",
    prix: 2800,
    image: "../images/palette_seattle.jpg",
    description: "Palette de 15 fards à paupières aux tons urbains et vibrants.",
    note: 4.9
  },
  {
    id: 17,
    nom: "Wonka Bar Eyeshadow Palette",
    categorie: "Palettes",
    prix: 2600,
    image: "../images/palette_wonka.jpg",
    description: "Palette collection Wonka avec des teintes chocolatées.",
    note: 4.8
  }
];

// fonction pour créer les divs dans le main
function creerCarteProduit(produit) {
  let imgPath = produit.image;
  // Si on est sur l'index (racine), on enlève le ../ devant images/
  if(!window.location.pathname.includes('content/')) {
    imgPath = imgPath.replace('../', '');
  }

  return `
    <article class="carte-produit" id="prod_${produit.id}">
      <img src="${imgPath}" alt="${produit.nom}" />
      <div class="carte-info">
        <span class="carte-categorie">[${produit.categorie}]</span>
        <h3 class="carte-nom">${produit.nom}</h3>
        <p class="carte-prix">${produit.prix} DA</p>
        <button class="btn btn-primaire btn-ajouter" onclick="ajouterAuPanier(${produit.id})">
          + Ajouter au panier
        </button>
      </div>
    </article>
  `;
}

// recup les top ventes on a test avec sort() ca marche bien
function obtenirBestSellers(n) {
  let tmp = produits.slice(); 
  tmp.sort((a, b) => b.note - a.note);
  return tmp.slice(0, n);
}

// fonction filtre (pour eviter de faire plein de pages)
function filtrerParCategorie(cat) {
  if (cat === "Tous") {
    return produits;
  }
  let res = [];
  for(let i=0; i<produits.length; i++){
    if(produits[i].categorie === cat){
      res.push(produits[i]);
    }
  }
  return res;
}
