// Tableau contenant des chaines de caractères correspondant aux recherches stockées
var recherches = [];
// Chaine de caractères correspondant à la recherche courante
var recherche_courante;
// Tableau d'objets de type resultats (avec titre, date et url)
var recherche_courante_news = [];


function ajouter_recherche() {
    //on recupere la valeur rentree
    let value_recherche = document.getElementById("zone_saisie").value;

    //on verifie qu'elle n'est pas nulle et qu'elle n'existe pas deja
    if(value_recherche != null &&  recherches.indexOf(value_recherche) === -1 ){
        let paragaphe = document.createElement("P");  // on cree un element <p>
        paragaphe.classList.add("titre-recherche");

        let label = document.createElement("LABEL"); // on cree un element <label>
        label.innerHTML = value_recherche; // sa valeur devient la chaine saisie par l'utilisateur

        let image = document.createElement("IMG"); // on cree un element <img>
        image.classList.add("icone-croix");  // on definit sa classe "icone-croix"
        image.src="img/croix30.jpg";  // on definit l'emplacement de l'image

        paragaphe.appendChild(label);  // on ajoute le label dans le paragraphe de classe "titre-recherche"
        paragaphe.appendChild(image);  // on ajoute l'image dans le paragraphe de classe "titre-recherche"

        document.getElementById("recherches-stockees").appendChild(paragaphe); // on ajoute le paraphe dans le div d'id "recherches-stockees"

        recherches.push(value_recherche); // on ajoute la chaine saisie dans la valeur glocale
    }
}


function supprimer_recherche(elt) {
	//TODO ...
}


function selectionner_recherche(elt) {
	//TODO ...
}


function init() {
	//TODO ...
}


function rechercher_nouvelles() {
	//TODO ...
}


function maj_resultats(res) {
	//TODO ...
}


function sauver_nouvelle(elt) {
	//TODO ...
}


function supprimer_nouvelle(elt) {
	//TODO ...
}

