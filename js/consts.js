(function (root) {
    var SHRI_CITIES = {};
    root.SHRI_CITIES = SHRI_CITIES;
    root.SHRI_CITIES.WIKI_URL = 'https://ru.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Населённые пункты по алфавиту&cmlimit=500&cmprop=title&utf8=&origin=*&format=json';
    root.SHRI_CITIES.MAP = {};
    root.SHRI_CITIES.PLAYERS_GUESSES = [];
    root.SHRI_CITIES.COMPUTER_GUESSES = [];
    root.SHRI_CITIES.CITIES = {};
    root.SHRI_CITIES.EXCEPTIONS = ['Ь', 'Ъ', 'Ы', 'Й'];
    
})(this);
