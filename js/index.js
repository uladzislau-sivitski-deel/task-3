(function (root) {    
    root.SHRI_CITIES.fetchCities('https://ru.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Населённые пункты по алфавиту&cmlimit=500&cmprop=title&utf8=&origin=*&format=json');    
    root.SHRI_CITIES.mapInit();
    document.querySelector('.outer').appendChild(
        root.SHRI_CITIES.render()
    );
})(this);
