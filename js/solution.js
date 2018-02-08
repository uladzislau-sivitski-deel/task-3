(function (root) {
    var MAP = root.SHRI_CITIES.MAP;
    var PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
    var COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
    var CITIES = root.SHRI_CITIES.CITIES;
    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var LAST_LETTER = ''

    async function playersMove() {
      let city = document.querySelector('.playersInput').value;
      isValidCity(city).then(res => {
        res
        ? addCityToMap(city, 'blue').then(() => {
            newLastLetter(city);            
            PLAYERS_GUESSES.push(city);
            setTimeout(() => {
                computerMove(city);  
            }, 3000);           
        })
        : playerValidation();   
      });
    }

    function playerValidation(){

    }

    async function computerMove() {
        let city = await getNewCity();
        addCityToMap(city, 'red').then(() => {
            newLastLetter(city);            
            PLAYERS_GUESSES.push(сity);
        })
    }

    async function getNewCity() {
        let city = await asyncFilter(CITIES[LAST_LETTER], async city => {
            let valid = await isValidCity(city);
            return valid === true;
        })
        return city;
    }

    async function asyncFilter(arr, callback) {
        return (await Promise.race(arr.filter(async item => {
             return (await callback(item)) ? item : undefined
        })));
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

    function mapInit() {
        getCities();
        const init = () => { 
            MAP = new ymaps.Map ("map", {
                center: [55.76, 37.64],
                zoom: 3,
                behaviors:['default', 'scrollZoom']
            });
        }
        ymaps.ready(init);
    }

    function isValidCity(city) {
       return isInYandex(city).then(isInYandex => 
            isInYandex
            && !PLAYERS_GUESSES.includes(city)
            && !COMPUTER_GUESSES.includes(city)
            && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
        )
    }

    function getCities(){
       fetch('./js/cities.json')
            .then(response =>  response.json())
                .then(function(json) {
                    CITIES = json;
                });
    }

    function download(text, name, type) {
        var a = document.createElement("a");
        var file = new Blob([text], {type: type});
        a.href = URL.createObjectURL(file);
        a.download = name;
        a.click();
    }

    function fetchCities(url) {
            promise = fetch(url)
            .then(response => {
                response.json()
                .then(response => {
                    response.query.categorymembers.forEach(city => {
                        city = city.title.replace(/\s?\(.+\)\s?/, '');
                        const firstLetter = city[0];
                        const lastLetter = city[city.length -1];
                        if(firstLetter.match(/[А-Я]/) && lastLetter.match(/[а-я]/)) {
                            if (!CITIES[firstLetter]) {
                                CITIES[firstLetter] = [];
                            }
                            if (!CITIES[firstLetter].includes(city)){
                                CITIES[firstLetter].push(city);
                            }
                        }
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

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.mapInit = mapInit;
    root.SHRI_CITIES.fetchCities = fetchCities;
    root.SHRI_CITIES.getCities = getCities;
})(this);
