(function (root) {
    var CITIES;
    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var WIKI_URL = root.SHRI_CITIES.WIKI_URL;
    var LIVES = root.SHRI_CITIES.LIVES;
    var MAP_STATE = root.SHRI_CITIES.MAP_STATE

    var MAP;
    var LAST_LETTER = '';
    var PLAYERS_GUESSES = [];
    var COMPUTER_GUESSES = [];
    

    function playersMove() {
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
        document.querySelectorAll('.heart')[LIVES].classList.add('lost');   
        
        if(!LIVES){
            let container = document.querySelector('.container');
            container.insertBefore(
                root.SHRI_CITIES.renderResults(['sada', 'asdad', 'asdad'], ['sada', 'asdad', 'asdad']),
                container.children[1]
            );
        }
    }

    function newGame(){
        mapInit();        
        document.querySelector('.result').remove();
        LIVES = root.SHRI_CITIES.LIVES;
        PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
        COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
        LAST_LETTER = '';
        document.querySelectorAll('.heart').forEach((heart) => {heart.classList.remove('lost')})
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
            case (PLAYERS_GUESSES.includes(city[0]) || COMPUTER_GUESSES.includes(city[0]) ):
                alert(`Такой город уже назывался!`);
                return false;
                break;
            case (CITIES[city[0]].includes(city)):
                alert(`К сожалению, мы не знаем про такой город.`);
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

    function mapInit(){
        if(MAP){MAP.destroy();}
        ymaps.ready(() => { 
            MAP = new ymaps.Map ("map", MAP_STATE);
            CITIES = root.SHRI_CITIES.getCities(13, 12296);
        });
    }

    function isValidCity(city) {
       return CITIES[city[0]].includes(city)
            && !PLAYERS_GUESSES.includes(city)
            && !COMPUTER_GUESSES.includes(city)
            && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
    }

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.newGame = newGame;
    root.SHRI_CITIES.mapInit = mapInit;
})(this);
