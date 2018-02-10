(function (root) {
    var CITIES;
    root.SHRI_CITIES.getCities().then(cities => {
        CITIES = cities;
    });
    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var WIKI_URL = root.SHRI_CITIES.WIKI_URL;
    var HINTS = root.SHRI_CITIES.HINTS;
    var MAP_STATE = root.SHRI_CITIES.MAP_STATE

    var MAP;
    var LAST_LETTER = '';
    var PLAYERS_GUESSES = [];
    var COMPUTER_GUESSES = [];
    

    async function playersMove() {
        let city = document.querySelector('.mainInput').value;
        if(formValidation(city)) {
            let valid = await isValidCity(city);
            if(valid){
                succesfullTurn(city).then(() => {
                    return false;
                });                
            }
        }
        return false;        
    }   

    async function computerMove() {
        let city = await getNextCity();
        addCityToMap(city, 'red').then(() => {
            afterTurn('computer', city)
        })
    }

    async function getNextCity(){
        let city;
        let arr = CITIES[LAST_LETTER || 'А'];
        while(!city){
            let possibleMatch = arr[Math.floor(Math.random()*arr.length)];
            if(isValidCity(possibleMatch)){
                var inYandex = await root.SHRI_CITIES.isInYandex(possibleMatch);
                if(inYandex){
                    city = arr[Math.floor(Math.random()*arr.length)];                                    
                }
            }
        }
        return city;
    }

    function succesfullTurn(city) {
        addCityToMap(city, 'blue').then(() => {
            afterTurn('player', city);
            setTimeout(() => {
                computerMove(city);  
            }, 2000);           
        })
    }

    function showResults(){
        document.querySelector('.interface').classList.add('display-none');
        let container = document.querySelector('.container');
        container.insertBefore(
            root.SHRI_CITIES.renderResults(PLAYERS_GUESSES, COMPUTER_GUESSES),
            container.children[1]
        );
    }

    async function getHint() {
        let city = await getNextCity();
        document.querySelectorAll('.hint')[HINTS - 1].classList.add('taken');       
        document.querySelector('.mainInput').value = city;
        if(!--HINTS){
            document.querySelector('.hints').classList.add('display-none');          
        }
    }

    function newGame(){
        mapInit();        
        document.querySelector('.result').remove();
        HINTS = root.SHRI_CITIES.HINTS;
        PLAYERS_GUESSES = [];
        COMPUTER_GUESSES = [];
        LAST_LETTER = '';
        document.querySelector('.interface').classList.remove('display-none');        
        document.querySelector('.hints').classList.remove('display-none');
        document.querySelectorAll('.hint').forEach(hint => {hint.classList.remove('taken')});
    }

    async function formValidation(city){
        let notInBase = false;
        if(!CITIES[city[0]].includes(city)){
            notInBase = true;
        }
        else {
            let inYandex = await root.SHRI_CITIES.isInYandex(city);
            if(!inYandex) {
                notInBase = true;
            }
        }
        if (city === '') {
            alert('Введите город.');
            return false;
        }
        if (LAST_LETTER && city[0] !== LAST_LETTER){
            alert(`Ваш город должен начинаться с буквы '${LAST_LETTER}'`);
            return false;
        }
        if (PLAYERS_GUESSES.includes(city) || COMPUTER_GUESSES.includes(city) ){
            alert(`Такой город уже назывался!`);
            return false;
        }
        if (notInBase){
            alert(`К сожалению, мы не знаем про такой город.`);
            return false;
        }
        return true;
    }



    function afterTurn(player, city) {
        newLastLetter(city);            
        if(player === 'player'){
            PLAYERS_GUESSES.push(city)
        }
        else {
            COMPUTER_GUESSES.push(city);
            document.querySelector('.mainInput').value = LAST_LETTER;
        }
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

    function mapInit(){
        if(MAP){MAP.destroy();}
        ymaps.ready(() => { 
            MAP = new ymaps.Map ("map", MAP_STATE);
        });
    }

    function isValidCity(city) {
       return CITIES[city[0]].includes(city)
            && !PLAYERS_GUESSES.includes(city)
            && !COMPUTER_GUESSES.includes(city)
            && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
    }

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.getHint = getHint;
    root.SHRI_CITIES.showResults = showResults;
    root.SHRI_CITIES.newGame = newGame;
    root.SHRI_CITIES.mapInit = mapInit;
})(this);
