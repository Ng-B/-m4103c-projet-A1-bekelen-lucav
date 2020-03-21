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
        label.onclick = function(){selectionner_recherche(this)}; // on lui associe la fonction "selectionner_recherche"

        let image = document.createElement("IMG"); // on cree un element <img>
        image.classList.add("icone-croix");  // on definit sa classe "icone-croix"
        image.src="img/croix30.jpg";  // on definit l'emplacement de l'image
        image.onclick = function(){supprimer_recherche(this)}; // on lui associe la fonction "supprimer-recherche"

        paragaphe.appendChild(label);  // on ajoute le label dans le paragraphe de classe "titre-recherche"
        paragaphe.appendChild(image);  // on ajoute l'image dans le paragraphe de classe "titre-recherche"

        document.getElementById("recherches-stockees").appendChild(paragaphe); // on ajoute le paraphe dans le div d'id "recherches-stockees"

        recherches.push(value_recherche); // on ajoute la chaine saisie dans la valeur globale

        let array_recherches_in_json = JSON.stringify(recherches);

        setCookie("recherches",array_recherches_in_json,1000);  // on ecrase le cookie existant avec l'array list modifie
    }
}


function supprimer_recherche(elt) {
elt.parentElement.remove();

let valeur_a_supprimer = elt.previousElementSibling.innerHTML; // on recupere le label qui se trouve avant l'image

let index = recherches.indexOf(valeur_a_supprimer); // on recupere son index dans le arraylist


recherches.splice(index,1); // on enleve l'element de la liste

let array_recherches_in_json = JSON.stringify(recherches);

setCookie("recherches",array_recherches_in_json,1000);
}

function selectionner_recherche(elt) {

document.getElementById("zone_saisie").value = elt.innerHTML; //on ecrit dans la boxe de saisie la valeur recuperee

recherche_courante = elt.value;  //on initialise la variable globale  avec la valeur recuperee



}


function init() {
    let contenus = JSON.parse(getCookie("recherches"));
    recherches = contenus;

    contenus.forEach(myFunction);

    function myFunction(value, index, array) {

        //--------------on reprend le meme code tres similaire de la fonction ajouter_rechercher  --------  //
        let paragaphe = document.createElement("P");  // on cree un element <p>
        paragaphe.classList.add("titre-recherche");

        let label = document.createElement("LABEL"); // on cree un element <label>
        label.innerHTML = value; // sa valeur devient la chaine saisie par l'utilisateur
        label.onclick = function(){selectionner_recherche(this)}; // on lui associe la fonction "selectionner_recherche"

        let image = document.createElement("IMG"); // on cree un element <img>
        image.classList.add("icone-croix");  // on definit sa classe "icone-croix"
        image.src="img/croix30.jpg";  // on definit l'emplacement de l'image
        image.onclick = function(){supprimer_recherche(this)}; // on lui associe la fonction "supprimer-recherche"

        paragaphe.appendChild(label);  // on ajoute le label dans le paragraphe de classe "titre-recherche"
        paragaphe.appendChild(image);  // on ajoute l'image dans le paragraphe de classe "titre-recherche"

        document.getElementById("recherches-stockees").appendChild(paragaphe); // on ajoute le paraphe dans le div d'id "recherches-stockees"
        //-------------------------------------------------------------------------------------  //

    }

}


function rechercher_nouvelles() {
    document.getElementById("resultats").innerHTML = ""; // on vide les resultats precedents

    document.getElementById("wait").style.display = "block";  // on rend le GIF visisble

    let value_recherche = document.getElementById("zone_saisie").value;

    maj_resultats(value_recherche);

}


function maj_resultats(res) {
    let xhr = new XMLHttpRequest();  // on cree un objet xhr

    let uri =  encodeURIComponent(res); // on encode la valeur recherchee pour proteger les caracteres speciaux


    xhr.open("GET", "https://carl-vincent.fr/search-internships.php?data="+uri, true);  // on instancie l'objet avec des valeurs

    xhr.send(null);  //on decleche l'envoi de la requete

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

            document.getElementById("wait").style.display = "none";  // on rend le GIF invisisble car on a une reponse du serveur

            let response = []; // on cree l'array list contenant les esultats

            response = JSON.parse(xhr.responseText);  // on parse les contenus JSON et on le stocke dans l'array list

            response.forEach(iteration_fonction);      // on parcourt l'array list avec une boucle for...each

            function iteration_fonction(value,index,array) {
                let paragaphe = document.createElement("P");  // on cree un element <p>
                paragaphe.classList.add("titre-recherche");   // on definit sa classe

                let link = document.createElement("a");  // on cree un element <p>
                link.classList.add("titre-news");     // on definit sa classe
                link.href = decodeHtmlEntities(value.url); // on definit l'url
                link.target="_blank";   //on definit son target
                let text = document.createTextNode(decodeHtmlEntities(value.titre)); // on recupere le titre
                link.appendChild(text);  // on le met dans la balise <a>

                let span_1= document.createElement("SPAN"); // on cree un element <span>
                span_1.classList.add("date_news");  // on definit sa classe
                let date= document.createTextNode(formatDate(value.date)); // on recupere la date
                span_1.appendChild(date); //on la met dans la balise <span>

                let span_2= document.createElement("SPAN"); // on cree un deuxieme element <span>
                span_2.classList.add("action_news");  // on definit sa classe
                span_2.onclick= function () {sauver_nouvelle(this)};  // on definit sa fonction lors d'un cick

                let image = document.createElement("IMG"); // on cree un element <img>
                image.src="img/horloge15.jpg";  // on definit l'emplacement de l'image
                span_2.appendChild(image); //on le met dans la balise <span>

                paragaphe.appendChild(link); // on met en premier la balise <a> dans le parent <p>
                paragaphe.appendChild(span_1); // on met en deuxieme la balise <span> dans le parent <p>
                paragaphe.appendChild(span_2); // on met en troisieme la deuxieme balise <span> dans le parent <p>

                document.getElementById("resultats").appendChild(paragaphe);  // on met tout dans le fichier html
            }
        }
    };
}


function sauver_nouvelle(elt) {
	//TODO ...
}


function supprimer_nouvelle(elt) {
	//TODO ...
}

