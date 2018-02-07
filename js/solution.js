(function (root) {
    var MAP = root.SHRI_CITIES.MAP;
    var PLAYERS_GUESSES = root.SHRI_CITIES.PLAYERS_GUESSES;
    var COMPUTER_GUESSES = root.SHRI_CITIES.COMPUTER_GUESSES;
    var CITIES = root.SHRI_CITIES.CITIES;
    /**
     * Функция находит кол-во островов на карте
     * ВАЖНО! Сигнатуру функции изменять нельзя!
     *
     * @param {number[][]} map карта островов представленная двумерной матрицей чисел
     * @returns {number} кол-во островов
     */
    function playersMove() {
      let city = document.querySelector('.playersInput').value;
      if(isValidCity(city)){
        addCityToMap(city, 'blue')
        .then(() => {
            PLAYERS_GUESSES.push(city);
            setTimeout(() => {
                computerMove(city[city.length - 1]);  
            }, 3000);           
        });
      }
    }

    function computerMove(letter) {
        let city = CITIES[letter.toLocaleUpperCase()].find((city) => isValidCity(city));
        addCityToMap(city, 'red')
        .then(() => {
            COMPUTER_GUESSES.push(city);
        });
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

    function mapInit() {
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
        if(!PLAYERS_GUESSES.includes(city) && !COMPUTER_GUESSES.includes(city)) {
            return true;
        }
        // else {
        //     fetchCity(city)
        //     .then((valid) => {
        //         console.log(valid);
        //     })
        // }
    }

    function wikiUrl() {
        return `https://ru.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Населённые пункты по алфавиту&cmlimit=500&cmprop=title&utf8=&origin=*&format=json`
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
                    response.query.categorymembers.forEach(cityInfo => {
                        const firstLetter = cityInfo.title[0];
                        if (!CITIES[firstLetter]) {
                            CITIES[firstLetter] = [];
                        }
                        if (!CITIES[firstLetter].includes(cityInfo.title)){
                            CITIES[firstLetter].push(cityInfo.title);
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
})(this);
