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

    async function playersMove(e) {
        e.preventDefault();
        let city = document.querySelector('.main-input').value;
        let valid = await formValidation(city);
        if(valid && isValidCity(valid.name)) {
            succesfullTurn(valid);
        }
        return false;        
    }   

    async function computerMove() {
        let city = await getNextCity();
        addCityToMap(city, 'red');
        afterTurn(city.name, 'computer', city);
    }

    async function getNextCity(){
        let city;
        let arr = CITIES[LAST_LETTER || 'А'];
        while(!city){
            let possibleMatch = arr[Math.floor(Math.random()*arr.length)];
            if(isValidCity(possibleMatch)){
                var inYandex = await root.SHRI_CITIES.isInYandex(possibleMatch);
                if(inYandex){
                    city = {
                        name: possibleMatch,
                        coordinates : inYandex.geoObjects.get(0).geometry.getCoordinates()
                    }
                }
            }
        }
        return city;
    }

    function succesfullTurn(city) {
        addCityToMap(city, 'blue');
        afterTurn(city.name, 'player');
        setTimeout(() => {
            computerMove(city);  
        }, 2000);        
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
        document.querySelector('.main-input').value = city;
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
        document.querySelector('.main-input').value = '';
        document.querySelector('.interface').classList.remove('display-none');        
        document.querySelector('.hints').classList.remove('display-none');
        document.querySelectorAll('.hint').forEach(hint => {hint.classList.remove('taken')});
    }

    async function formValidation(city){
        let result = false;
        if (city === '') {
            alert('Введите город.');
            return result;
        }
        if (LAST_LETTER && city[0] !== LAST_LETTER){
            alert(`Ваш город должен начинаться с буквы '${LAST_LETTER}'`);
            return result;
        }
        if (PLAYERS_GUESSES.includes(city) || COMPUTER_GUESSES.includes(city) ){
            alert(`Такой город уже назывался!`);
            return result;
        }
        let notInBase = false;
        if(!CITIES[city[0]].includes(city)){
            notInBase = true;
        }
        else {
            let inYandex = await root.SHRI_CITIES.isInYandex(city);
            if(!inYandex) {
                notInBase = true;
            }
            else {
                result = {
                    name: possibleMatch,
                    coordinates : inYandex.geoObjects.get(0).geometry.getCoordinates()
                }
            }
        }
        if (notInBase){
            alert(`К сожалению, мы не знаем про такой город.`);
            return result;
        }
        return result;
    }

    function afterTurn(city, player) {
        newLastLetter(city);            
        if(player === 'player'){
            PLAYERS_GUESSES.push(city)
        }
        else {
            COMPUTER_GUESSES.push(city);
            document.querySelector('.main-input').value = LAST_LETTER;
        }
    }

    function newLastLetter(city) {
        LAST_LETTER = !EXCEPTIONS.includes(city[city.length - 1])
        ? (city[city.length - 1]).toUpperCase()
        : city[city.length - 2].toUpperCase();
    }

    function addCityToMap(city, color){
        MAP.panTo(city.coordinates);            
        let placemark = new ymaps.Placemark(
            city.coordinates,
            {iconContent: city.name},
            {preset: `twirl#${color}StretchyIcon`}
        );
        MAP.geoObjects.add(placemark);
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
