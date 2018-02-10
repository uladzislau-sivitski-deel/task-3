(function (root) {
    async function checkCities(letter, index){
       fetch(`./js/cities.json`)
            .then(response =>  response.json())
                .then(async json => {
                    CITIES = json;
                    let count = 0;                    
                    const keys = Object.keys(CITIES);
                    for(let j = letter; j < keys.length; j++, index = 0){
                        let arr = CITIES[keys[j]];
                        for(let i = index; i < arr.length; i++) {
                                var x = await isInYandex(arr[i]);
                                if(!x){arr.splice(i, 1);};
                                count++;
                                if(count === 100){
                                    count = 0;
                                    download(JSON.stringify(CITIES), `CITIES-TO-${j}-${i}.json`, 'text/plain');
                                }    
                            }                                       
                    }
                    download(JSON.stringify(CITIES), 'CITIES-TO-END.json', 'text/plain');
                });
    }

    function getCities(cities){
        fetch(`./js/cities.json`)
             .then(response =>  response.json())
             .then(json => {
                 cities = json
                })
     }

    function isInYandex(city){
        var myGeocoder = ymaps.geocode(city, { kind: 'locality'});  
        return myGeocoder.then((res) => {
            return res.geoObjects.get(0);
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

    root.SHRI_CITIES.getCities = getCities;
})(this);
