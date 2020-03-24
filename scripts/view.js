var view = {};



view.Get_zone_saisie = function() {
    return document.getElementById("zone_saisie");
}

view.Get_Element= function(id) {
    return document.getElementById(id);
}

view.maj_resultats = function(res) {
    let xhr = new XMLHttpRequest();  // on cree un objet xhr

    let uri =  encodeURIComponent(res); // on encode la valeur recherchee pour proteger les caracteres speciaux


    xhr.open("GET", "https://carl-vincent.fr/search-internships.php?data="+uri, true);  // on instancie l'objet avec des valeurs

    xhr.send(null);  //on decleche l'envoi de la requete

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {

            view.Get_Element("wait").style.display = "none";  // on rend le GIF invisisble car on a une reponse du serveur

            let response = []; // on cree l'array list contenant les resultats

            response = JSON.parse(xhr.responseText);  // on parse les contenus JSON et on le stocke dans l'array list

            response.forEach(iteration_fonction);      // on parcourt l'array list avec une boucle for...each

            function iteration_fonction(value,index,array) {
                value.date=formatDate(value.date);

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
                if (indexOfResultat(model.recherche_courante_news,value) == -1){
                    span_2.onclick= function () {model.sauver_nouvelle(this)};  // on definit sa fonction lors d'un cick
                } else {
                    span_2.onclick= function () {model.supprimer_nouvelle(this)};  // on definit sa fonction lors d'un cick
                }


                let image = document.createElement("IMG"); // on cree un element <img>
                if (indexOfResultat(model.recherche_courante_news,value) == -1){
                    image.src="img/horloge15.jpg";  // on definit l'emplacement de l'image
                } else {
                    image.src="img/disk15.jpg";  // on definit l'emplacement de l'image
                }
                span_2.appendChild(image); //on le met dans la balise <span>

                paragaphe.appendChild(link); // on met en premier la balise <a> dans le parent <p>
                paragaphe.appendChild(span_1); // on met en deuxieme la balise <span> dans le parent <p>
                paragaphe.appendChild(span_2); // on met en troisieme la deuxieme balise <span> dans le parent <p>

                view.Get_Element("resultats").appendChild(paragaphe);  // on met tout dans le fichier html

            }
            // AMELIORATION N4: Nombre total de resultats retournes
            let resultats = document.createTextNode("resultats:("+response.length+")")
            view.Get_Element("resultats").prepend(resultats);
        }
    };
}

view.sauver_nouvelle = function(elt) {

    let date = elt.previousElementSibling.innerHTML; // on recupere la date de <span>
    let titre = elt.previousElementSibling.previousElementSibling.innerHTML;  // on recupere le titre de <a>
    let url = elt.previousElementSibling.previousElementSibling.getAttribute("href"); // on recupere la valeur <href> de <a>

    let recherche = {
        titre: titre,
        date: date,
        url: url
    };

    if(model.recherches.indexOf(model.recherche_courante) != -1 && indexOfResultat(model.recherche_courante_news,recherche) == -1) {

        elt.onclick = function () {supprimer_nouvelle(this)};
        let image = document.createElement("IMG"); // on cree un element <img>
        image.src = "img/disk15.jpg";  // on definit l'emplacement de l'image
        elt.firstChild.replaceWith(image); // on remplace l'image paf celle-la

        //if(getCookie(model.recherche_courante)){
        if(localStorage.getItem(model.recherche_courante)){
            //model.recherche_courante_news = JSON.parse(getCookie(model.recherche_courante)); // on intialise l'array à partir du cookie portant le nom de la recherche
            model.recherche_courante_news = JSON.parse(localStorage.getItem(model.recherche_courante)); // on intialise l'array à partir du cookie portant le nom de la recherche
            model.recherche_courante_news.push(recherche);
            model.recherche_courante_news = JSON.stringify(model.recherche_courante_news);
            //setCookie(model.recherche_courante, model.recherche_courante_news, 1000);  // on creer un cookie
            localStorage.setItem(model.recherche_courante,model.recherche_courante_news);
        } else {
            model.recherche_courante_news.push(recherche);
            model.recherche_courante_news = JSON.stringify(model.recherche_courante_news);    // on transfome l'array list en format JSON
            //setCookie(model.recherche_courante, model.recherche_courante_news, 1000);  // on creer un cookie
            localStorage.setItem(model.recherche_courante,model.recherche_courante_news);
        }

    } else {
        alert("Vous devez enregistrer votre recherche actuelle");       // notification d'enregistrement oblige avant enregistrement
    }
}