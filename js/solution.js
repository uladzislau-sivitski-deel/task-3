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
    

    function playersMove() {
        let city = document.querySelector('.mainInput').value;
        if(formValidation(city) && isValidCity(city)) {
            succesfullTurn(city)
        }
        return false;
    }   

    function computerMove() {
        let city = CITIES[LAST_LETTER].find(city => isValidCity(city));
        addCityToMap(city, 'red').then(() => {
            afterTurn('computer', city)
        })
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

    function getHint() {
        --HINTS;
        if(HINTS){
            document.querySelectorAll('.hint')[HINTS].classList.add('taken');       
            document.querySelector('.mainInput').value = 
            CITIES[LAST_LETTER || 'А'].find(city => isValidCity(city));
        }
        else {
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
            case (!CITIES[city[0]].includes(city)):
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
