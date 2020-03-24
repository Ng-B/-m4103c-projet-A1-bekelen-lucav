var controler = {};

// AMELIORATION N2: Autocomplete
 controler.historique = [];

 controler.selectionner_recherche = function(elt) {

    view.Get_Element("resultats").innerHTML="";

   view.Get_Element("zone_saisie").value = elt.innerHTML; //on ecrit dans la boxe de saisie la valeur recuperee

   model.recherche_courante = elt.innerHTML;  //on initialise la variable globale "recherche_courante" avec la recherche actuelle

   if(model.recherches.indexOf(model.recherche_courante) != -1 && localStorage.getItem(model.recherche_courante)){

      //view.Get_Element("resultats").innerHTML="";
      document.getElementById("resultats").innerHTML="";

      //model.recherche_courante_news = JSON.parse(getCookie(model.recherche_courante)); // on intialise l'array à partir du cookie portant le nom de la recherche
      model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante));
      model.recherche_courante_news.forEach(iteration_fonction);      // on parcourt l'array list avec une boucle for...each


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
         let date= document.createTextNode(value.date); // on recupere la date
         span_1.appendChild(date); //on la met dans la balise <span>

         let span_2= document.createElement("SPAN"); // on cree un deuxieme element <span>
         span_2.classList.add("action_news");  // on definit sa classe
         span_2.onclick= function () {model.supprimer_nouvelle(this)};  // on definit sa fonction lors d'un cick

         let image = document.createElement("IMG"); // on cree un element <img>
         image.src="img/disk15.jpg";  // on definit l'emplacement de l'image
         span_2.appendChild(image); //on le met dans la balise <span>

         paragaphe.appendChild(link); // on met en premier la balise <a> dans le parent <p>
         paragaphe.appendChild(span_1); // on met en deuxieme la balise <span> dans le parent <p>
         paragaphe.appendChild(span_2); // on met en troisieme la deuxieme balise <span> dans le parent <p>

         //-- on enleve tous les contenus de <div id"esultats> pour le remplacer par les nouvelles sauvegardees --//
         let div_resultats = view.Get_Element("resultats");

         /////////////////////////////////////////////////////////////////////////////////////////////////////////

         div_resultats.appendChild(paragaphe);  // on met les annonces sauvegardees dans la boite resultat

      }

   } else {
      view.Get_Element("resultats").innerHTML="";
   }


}

controler.init = function() {
   //if(getCookie("recherches")) {
   if(localStorage.getItem("recherches")) {
   //let contenus = JSON.parse(getCookie("recherches"));
   let contenus = JSON.parse(localStorage.getItem("recherches"));
      model.recherches = contenus;

      contenus.forEach(myFunction);

      function myFunction(value, index, array) {

         //--------------on reprend le meme code tres similaire de la fonction ajouter_rechercher  --------  //
         let paragaphe = document.createElement("P");  // on cree un element <p>
         paragaphe.classList.add("titre-recherche");

         let label = document.createElement("LABEL"); // on cree un element <label>
         label.innerHTML = value; // sa valeur devient la chaine saisie par l'utilisateur
         label.onclick = function(){controler.selectionner_recherche(this)}; // on lui associe la fonction "selectionner_recherche"

         let image = document.createElement("IMG"); // on cree un element <img>
         image.classList.add("icone-croix");  // on definit sa classe "icone-croix"
         image.src="img/croix30.jpg";  // on definit l'emplacement de l'image
         image.onclick = function(){model.supprimer_recherche(this)}; // on lui associe la fonction "supprimer-recherche"

         paragaphe.appendChild(label);  // on ajoute le label dans le paragraphe de classe "titre-recherche"
         paragaphe.appendChild(image);  // on ajoute l'image dans le paragraphe de classe "titre-recherche"

         view.Get_Element("recherches-stockees").appendChild(paragaphe); // on ajoute le paraphe dans le div d'id "recherches-stockees"
         //-------------------------------------------------------------------------------------  //


      }

   //AMELIORATION N3 : Retour charriot declenche la recherche
      let zone_saisie = view.Get_Element("zone_saisie");

      zone_saisie.addEventListener("keyup", function(event) {
         // Numero 13 correspond au bouton "Enter"
            if (event.keyCode === 13) {
            event.preventDefault();
            // Declenche la recherche
               view.Get_Element("retour-chariot").click();
         }
      });


   }

// AMELIORATION 1: Remplissage automatique par la localisation actuelle
   var script = document.createElement('script');
   script.type = 'text/javascript';
   script.src = 'https://geolocation-db.com/jsonp'; // site qui renvoie la position geolocale
   var h = document.getElementsByTagName('script')[0];
   h.parentNode.insertBefore(script, h);

// AMELIORATION N2: Autocomplete
   $( "#zone_saisie" ).autocomplete({
      source: controler.historique
   });

}

// AMELIORATION 1: Remplissage automatique par la localisation actuelle
function callback(data) {
   document.getElementById("zone_saisie").value= data.city + "         (position actuelle)";

}

controler.rechercher_nouvelles = function() {

    view.Get_Element("resultats").innerHTML = ""; // on vide les resultats precedents
   view.Get_Element("wait").style.display = "block";  // on rend le GIF visisble

   let value_recherche = document.getElementById("zone_saisie").value;

   model.recherche_courante =  value_recherche;   // on met a jour la variable globale

   if(model.recherches.indexOf(value_recherche) != -1 ){ // si elle existe la recherche
      if(localStorage.getItem(value_recherche))      // si il existe un cookie associe a la recherche
         //model.recherche_courante_news = JSON.parse(getCookie(value_recherche));      // recuperation du cookie
         model.recherche_courante_news = JSON.parse(localStorage.getItem(value_recherche));
   }

   view.maj_resultats(value_recherche);

   // AMELIORATION N2: Autocomplete
   controler.historique.push(view.Get_zone_saisie().value);

}