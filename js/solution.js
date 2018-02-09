(function (root) {
    var MAP = root.SHRI_CITIES.MAP;
    var PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
    var COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
    var CITIES = root.SHRI_CITIES.CITIES;
    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var WIKI_URL = root.SHRI_CITIES.WIKI_URL;
    var LIVES = root.SHRI_CITIES.LIVES;
    var MAP_STATE = root.SHRI_CITIES.MAP_STATE
    var LAST_LETTER = ''
    

    function playersMove() {
        gameOver();
        let city = document.querySelector('.mainInput').value;
        formValidation(city) && isValidCity(city)
        ? succesfullTurn()
        : gameOver();
        
        return false;
    }   

    function succesfullTurn(city) {
        addCityToMap(city, 'blue').then(() => {
            afterTurn('player', city);
            setTimeout(() => {
                computerMove(city);  
            }, 1000);           
        })
    }

    function gameOver(){
        --LIVES;
        if(!LIVES){
            let container = document.querySelector('.container');
            container.insertBefore(
                root.SHRI_CITIES.renderResults(['sada', 'asdad', 'asdad'], ['sada', 'asdad', 'asdad']),
                container.children[1]
            );
        }
    }

    function newGame(){
        LIVES = root.SHRI_CITIES.LIVES;
        mapInit();
        PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
        COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
        LAST_LETTER = '';
        
    }

    function formValidation(city){
        switch (city) {
            case '':
                alert('Введите город.');
                return false;
                break;
            case (LAST_LETTER && city[0] !== LAST_LETTER):
                alert(`Ваш город должен начинаться с буквы '${LAST_LETTER}'`);
                return false;
                break;
            case (LAST_LETTER && city[0] !== LAST_LETTER):
                alert(`Ваш город должен начинаться с буквы '${LAST_LETTER}'`);
                return false;
                break;
            default:
                return true;
                break;
        }
    }



    function afterTurn(player, city) {
        newLastLetter(city);            
        player === 'player' ? PLAYERS_GUESSES.push(city) : COMPUTER_GUESSES.push(city);
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
            MAP = new ymaps.Map ("map", MAP_STATE);
            getCities(2, 2941);
        }
        ymaps.ready(init);
    }

    function isValidCity(city) {
       return CITIES[city[0]].includes(city)
            && !PLAYERS_GUESSES.includes(city)
            && !COMPUTER_GUESSES.includes(city)
            && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
    }

    async function getCities(letter, index){
       fetch(`./js/cities.json`)
            .then(response =>  response.json())
                .then(async json => {
                    CITIES = json;
                    const keys = Object.keys(CITIES);
                    for(let j = letter; j < keys.length; j++){
                        let arr = CITIES[keys[j]];
                        for(let i = index; i < arr.length; i++) {
                            try {
                                var x = await isInYandex(arr[i]);
                                if(!x){arr.splice(i, 1);};    
                            } catch (error) {
                                download(JSON.stringify(CITIES), `CITIES-TO-${j}-${i}.json`, 'text/plain');
                            }                                       
                        }
                    }
                    download(JSON.stringify(CITIES), 'CITIES-TO-END.json', 'text/plain');
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

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.mapInit = mapInit;
    root.SHRI_CITIES.getCities = getCities;
})(this);
