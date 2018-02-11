(function (root) {
    var CITIES;
    root.SHRI_CITIES.getCities().then(cities => {
        CITIES = cities;
    });

    var EXCEPTIONS = root.SHRI_CITIES.EXCEPTIONS;
    var WIKI_URL = root.SHRI_CITIES.WIKI_URL;
    var HINTS = root.SHRI_CITIES.HINTS;

    var LAST_LETTER = '';
    var PLAYERS_GUESSES = [];
    var COMPUTER_GUESSES = [];

    async function playersMove(e) {
        e.preventDefault();
        let input = document.querySelector('.main-input').value;
        let city = await formValidation(input);
        if(city && isValidCity(city.name)) {
            succesfullTurn(city);
        }
        return false;        
    }   

    function isValidCity(city) {
        return findIgnoringCase(city)
             && !PLAYERS_GUESSES.includes(city)
             && !COMPUTER_GUESSES.includes(city)
             && ((LAST_LETTER && city[0] === LAST_LETTER) || !LAST_LETTER) 
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
        if(!findIgnoringCase(city)){
            notInBase = true;
        }
        else {
            let inYandex = await root.SHRI_CITIES.isInYandex(city);
            if(!inYandex) {
                notInBase = true;
            }
            else {
                result = {
                    name: city,
                    coordinates : inYandex.geometry.getCoordinates()
                }
            }
        }
        if (notInBase){
            alert(`К сожалению, мы не знаем про такой город.`);
            return result;
        }
        return result;
    }

    function findIgnoringCase(city) {
       return CITIES[city[0].toUpperCase()].find(el => el.toLowerCase() === city.toLowerCase())
    }

    function succesfullTurn(city) {
        root.SHRI_CITIES.addCityToMap(city, 'blue');
        afterTurn(city.name, 'player');
        setTimeout(() => computerMove(city), 3000);        
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
        let sub = !EXCEPTIONS.includes(city[city.length - 1]) ? 1 : 2;
        LAST_LETTER = city[city.length - sub].toUpperCase()
    }

    async function computerMove() {
        let city = await getNextCity();
        root.SHRI_CITIES.addCityToMap(city, 'red');
        afterTurn(city.name, 'computer', city);
    }

    async function getNextCity(){
        let city;
        while(!city){
            let possibleMatch = getRandomArrayElement(CITIES[LAST_LETTER || 'А']);
            if(isValidCity(possibleMatch)){
                var inYandex = await root.SHRI_CITIES.isInYandex(possibleMatch);
                if(inYandex){
                    city = {
                        name: possibleMatch,
                        coordinates : inYandex.geometry.getCoordinates()
                    }
                }
            }
        }
        return city;
    }

    function getRandomArrayElement(arr) {
        return arr[Math.floor(Math.random()*arr.length)];
    }

    async function getHint() {
        let city = await getNextCity();
        document.querySelectorAll('.hint')[HINTS - 1].classList.add('taken'); 
        succesfullTurn(city);      
        if(!--HINTS){
            document.querySelector('.hints').classList.add('display-none');          
        }
    }

    function showResults(){
        document.querySelector('.interface').classList.add('display-none');
        let container = document.querySelector('.container');
        container.insertBefore(
            root.SHRI_CITIES.renderResults(PLAYERS_GUESSES, COMPUTER_GUESSES),
            container.children[1]
        );
    }

    function newGame(){
        root.SHRI_CITIES.mapInit();        
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

    root.SHRI_CITIES.playersMove = playersMove;
    root.SHRI_CITIES.getHint = getHint;
    root.SHRI_CITIES.showResults = showResults;
    root.SHRI_CITIES.newGame = newGame;
})(this);
