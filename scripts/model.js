var model = {};
model.recherche_courante = "";
model.recherches = [];
model.recherche_courante_news = [];

model.ajouter_recherche = function() {
    //on recupere la valeur rentree
    let value_recherche = view.Get_Element("zone_saisie").value;

    //on verifie qu'elle n'est pas nulle et qu'elle n'existe pas deja
    if(value_recherche != null &&  model.recherches.indexOf(value_recherche) === -1 ){
        let paragaphe = document.createElement("P");  // on cree un element <p>
        paragaphe.classList.add("titre-recherche");

        let label = document.createElement("LABEL"); // on cree un element <label>
        label.innerHTML = value_recherche; // sa valeur devient la chaine saisie par l'utilisateur
        label.onclick = function(){controler.selectionner_recherche(this)}; // on lui associe la fonction "selectionner_recherche"

        let image = document.createElement("IMG"); // on cree un element <img>
        image.classList.add("icone-croix");  // on definit sa classe "icone-croix"
        image.src="img/croix30.jpg";  // on definit l'emplacement de l'image
        image.onclick = function(){controler.supprimer_recherche(this)}; // on lui associe la fonction "supprimer-recherche"

        paragaphe.appendChild(label);  // on ajoute le label dans le paragraphe de classe "titre-recherche"
        paragaphe.appendChild(image);  // on ajoute l'image dans le paragraphe de classe "titre-recherche"

        view.Get_Element("recherches-stockees").appendChild(paragaphe); // on ajoute le paraphe dans le div d'id "recherches-stockees"

        model.recherches.push(value_recherche); // on ajoute la chaine saisie dans la valeur globale

        let array_recherches_in_json = JSON.stringify(model.recherches);  // on transfome l'array list en format JSON

        localStorage.setItem("recherches",array_recherches_in_json);
        //setCookie("recherches",array_recherches_in_json,1000);  // on ecrase le cookie existant avec l'array list modifie

        $( function() {
            $( "#recherche_stockee" + index).draggable();
            $( "#zone_saisie" ).droppable({
                drop: function( event, ui ) {
                    $(this).value = " ";
                    $(this).value = value;
                }
            });
        } );
    }
}

model.supprimer_recherche = function(elt) {
    elt.parentElement.remove();

    let valeur_a_supprimer = elt.previousElementSibling.innerHTML; // on recupere le label qui se trouve avant l'image

    let index = model.recherches.indexOf(valeur_a_supprimer); // on recupere son index dans le arraylist

    model.recherches.splice(index,1); // on enleve l'element de la liste

    let array_recherches_in_json = JSON.stringify(model.recherches); // on ecrase le cookie existant avec l'array list modifie

    localStorage.setItem("recherches",array_recherches_in_json);

    // setCookie("recherches",array_recherches_in_json,1000);
}

model.supprimer_nouvelle = function(elt) {
    let date = elt.previousElementSibling.innerHTML; // on recupere la date de <span>
    let titre = elt.previousElementSibling.previousElementSibling.innerHTML;  // on recupere le titre de <a>
    let url = elt.previousElementSibling.previousElementSibling.getAttribute("href"); // on recupere la valeur <href> de <a>

    let recherche = {
        titre: titre,
        date: date,
        url: url
    };

    //model.recherche_courante_news = JSON.parse(getCookie(model.recherche_courante));
    model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante));

    let index =indexOfResultat(model.recherche_courante_news,recherche);  // on recupere l'index de l'objet. S'il n'existe pas -1 renvoye

    if( index != -1){
        elt.onclick=function() {sauver_nouvelle(this)};
        let image = document.createElement("IMG"); // on cree un element <img>
        image.src="img/horloge15.jpg";  // on definit l'emplacement de l'image
        elt.firstChild.replaceWith(image);

        //model.recherche_courante_news = JSON.parse(getCookie(model.recherche_courante)); // on parse l'array list
        model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante)); // on parse l'array list

        model.recherche_courante_news.splice(index,1);  // on supprime l'annonce

        let array_recherches_in_json = JSON.stringify(model.recherche_courante_news);    // on transfome l'array list en format JSON

        localStorage.setItem(model.recherche_courante,array_recherches_in_json);
        //setCookie(model.recherche_courante,array_recherches_in_json,1000);  // on creer un cookie
    }


}

model.sauver_nouvelle = function(elt) {

    let date = elt.previousElementSibling.innerHTML; // on recupere la date de <span>
    let titre = elt.previousElementSibling.previousElementSibling.innerHTML;  // on recupere le titre de <a>
    let url = elt.previousElementSibling.previousElementSibling.getAttribute("href"); // on recupere la valeur <href> de <a>

    let recherche = {
        titre: titre,
        date: date,
        url: url
    };

    if(model.recherches.indexOf(model.recherche_courante) != -1 && indexOfResultat(model.recherche_courante_news,recherche) == -1) {

        elt.onclick = function () {model.supprimer_nouvelle(this)};
        let image = document.createElement("IMG"); // on cree un element <img>
        image.src = "img/disk15.jpg";  // on definit l'emplacement de l'image
        elt.firstChild.replaceWith(image); // on remplace l'image paf celle-la

        //if(getCookie(model.recherche_courante)){
        if(localStorage.getItem(model.recherche_courante)){
            //model.recherche_courante_news = JSON.parse(getCookie(model.recherche_courante)); // on intialise l'array à partir du cookie portant le nom de la recherche
            model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante));
            model.recherche_courante_news.push(recherche);
            model.recherche_courante_news = JSON.stringify(model.recherche_courante_news);
            localStorage.setItem(model.recherche_courante,model.recherche_courante_news);
            //setCookie(model.recherche_courante, model.recherche_courante_news, 1000);  // on creer un cookie
        } else {
            model.recherche_courante_news = [] ;
            model.recherche_courante_news.push(recherche);
            model.recherche_courante_news = JSON.stringify(model.recherche_courante_news);    // on transfome l'array list en format JSON
            localStorage.setItem(model.recherche_courante,model.recherche_courante_news);
            //setCookie(model.recherche_courante, model.recherche_courante_news, 1000);  // on creer un cookie
        }

    } else {
        alert("Vous devez enregistrer votre recherche actuelle");       // notification d'enregistrement oblige avant enregistrement
    }
}