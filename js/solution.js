(function (root) {
    var MAP = root.SHRI_CITIES.MAP;
    var PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
    var COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
    var CITIES = root.SHRI_CITIES.CITIES;
    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var LAST_LETTER = ''
    var WIKI_URL = root.SHRI_CITIES.WIKI_URL;

    async function playersMove() {
      let city = document.querySelector('.playersInput').value;
      isValidCity(city)
        ? addCityToMap(city, 'blue').then(() => {
            afterTurn('player', city)
            setTimeout(() => {
                computerMove(city);  
            }, 1000);           
        })
        : playerValidation();   
    }

    function playerValidation(){

    }

    function afterTurn(player, city) {
        let arr = CITIES[city[0]]
        newLastLetter(city);            
        player === 'player' ? PLAYERS_GUESSES.push(city) : COMPUTER_GUESSES.push(city);
        arr.slice(arr.indexOf(city), 1);
    }

    function computerMove() {
        let city = CITIES[LAST_LETTER].filter(city => isValidCity(city));
        addCityToMap(city, 'red').then(() => {
            afterTurn('computer', city)
        })
    }


    function newLastLetter(city) {
        LAST_LETTER = !EXCEPTIONS.includes(city[city.length - 1])
        ? (city[city.length - 1]).toUpperCase()
        : city[city.length - 2].toUpperCase();
    }

    function addCityToMap(city, color){
        var myGeocoder = ymaps.geocode(city, { kind: 'locality' });        
        return myGeocoder.then((res) => {
            let coordinates = res.geoObjects.get(0).geometry.getCoordinates();
            MAP.panTo(coordinates);            
            let placemark = new ymaps.Placemark(coordinates, {iconContent: city}, {preset: `twirl#${color}StretchyIcon`});
            MAP.geoObjects.add(placemark);
        })
    }

    function isInYandex(city){
        var myGeocoder = ymaps.geocode(city, { kind: 'locality'});  
        return myGeocoder.then((res) => {
            return res.geoObjects.get(0);
        })
    }

    function mapInit(){
        const init = () => { 
            MAP = new ymaps.Map ("map", {
                center: [55.76, 37.64],
                zoom: 3,
                behaviors:['default', 'scrollZoom']
            });
            //fetchCities(WIKI_URL); 
            getCities(); 
        }
        ymaps.ready(init);
    }

    function isValidCity(city) {
       return CITIES[city[0]].includes(city)
            && !PLAYERS_GUESSES.includes(city)
            && !COMPUTER_GUESSES.includes(city)
            && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
    }

    async function getCities(){
       fetch('./js/cities.json')
            .then(response =>  response.json())
                .then(async json => {
                    CITIES = json;
                    for(letter in CITIES){
                        let chunks = splitArray(CITIES[letter], 100);
                        for(let i=0; i < chunks.length; i++) {
                            var x = await checkArrayInYandex(chunks[i]);
                            resolveAfterTime(3000);
                        }
                    }
                    console.log(CITIES);
                });
    }


    function splitArray(arr, chunkSize) {
        let chunks = [], i;
        for (i = 0; i < arr.length; i += chunkSize) {
            chunks.push(arr.slice(i, i + chunkSize));
        }
        return chunks;
    }

    function download(text, name, type) {
        var a = document.createElement("a");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    function resolveAfterTime(time) { 
        return new Promise(resolve => {
          setTimeout(() => {
            resolve(time);
          }, time);
        });
      }

    function fetchCities(url) {
            promise = fetch(url)
            .then(response => {
                response.json()
                .then(async response => {
                    response.query.categorymembers.map(city => {
                        city = city.title.replace(/\s?\(.+\)\s?/, '');
                        const firstLetter = city[0];
                        const lastLetter = city[city.length - 1];
                        if(firstLetter.match(/[А-Я]/) && lastLetter.match(/[а-я]/)) {
                            if (!CITIES[firstLetter]) {
                                CITIES[firstLetter] = [];
                            }
                            if (!CITIES[firstLetter].includes(city)){
                                CITIES[firstLetter].push(city);
                            }
                        }
                        return city;
                    });
                    if(response.query.categorymembers.length === 500) {
                        let newUrl = `${url.replace(/&cmcontinue.+/, '')}&cmcontinue=${response.continue.cmcontinue}`;
                        fetchCities(newUrl);
                    }
                    else {
                        download(JSON.stringify(CITIES), 'test.txt', 'text/plain');
                    }
                })
            })
    }

    async function checkArrayInYandex(cities) {
        return Promise.all(cities.map(async (city) => {
            const inYandex = await isInYandex(city);
            if(!inYandex){
                CITIES[city[0]].splice(CITIES[city[0]].indexOf(city), 1);
            }
        }));   
    }

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.mapInit = mapInit;
    root.SHRI_CITIES.getCities = getCities;
})(this);
