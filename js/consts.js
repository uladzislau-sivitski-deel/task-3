(function (root) {
    var SHRI_CITIES = {};
    root.SHRI_CITIES = SHRI_CITIES;
    root.SHRI_CITIES.WIKI_URL = 'https://ru.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Населённые пункты по алфавиту&cmlimit=500&cmprop=title&utf8=&origin=*&format=json';
    root.SHRI_CITIES.EXCEPTIONS = ['ь', 'ъ', 'ы', 'й'];
    root.SHRI_CITIES.HINTS = 3;
    root.SHRI_CITIES.MAP_STATE = {
        center: [0, 0],
        zoom: 3,
        behaviors:['default', 'scrollZoom'],
    }
})(this);
