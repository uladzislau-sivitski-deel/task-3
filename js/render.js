(function (root) {
    /**
     * Создает HTML элемент заданного типа с заданным CSS классом
     *
     * @param {string} type тип создаваемого HTML элемента
     * @param {string} className CSS класс
     * @param {string} [text] текст
     * @returns {HTMLElement} HTML элемент
     */
    function element(type, className, text, id) {
        var elem = document.createElement(type);
        elem.className = className;

        if (text) {
            elem.innerText = text;
        }

        if (id) {
            elem.id = id;
        }

        return elem;
    }

    /**
     * Создает визуализацию карты по его схеме
     * @returns {HTMLElement} HTML элемент
     */
    function render() {
        const containerElem = element('div', 'container');

        const map = element('div', 'map', '', 'map');
        const form = element('form', 'mainForm');
        const input = element('input', 'mainInput');
        
        input.pattern = '[А-Я]{1}[а-я-?\'?]+'; 

        const check = () => {
            if (input.validity.patternMismatch) {
                input.setCustomValidity("Город должен быть на русском языке и начинаться с большой буквы!");
              } else {
                input.setCustomValidity("");
              }
        }
        input.oninput = () => check();
        
        const button = element('button', 'mainButton', 'OK');

        form.appendChild(input);        
        form.appendChild(button);
        form.onsubmit = () => root.SHRI_CITIES.playersMove();
        
        containerElem.appendChild(form);
        containerElem.appendChild(map);
        
        return containerElem;
    }

    function renderResults(playerResults, computerResults){
        const resultContainer = element('div', 'results');
        const playerResultsUlContainer = element('div', 'results');
        const computerResultsUlContainer = element('div', 'results');
        const playerResultsUl = element('ul', 'resultList');
        const computerResultsUl = element('ul', 'resultList');


        playerResultsUlContainer.appendChild(element('span', 'resultLabel', 'Названные вами города.'));
        for (let i = 0; i < playerResults.length; i++) {
            playerResultsUl.appendChild(element('li', 'listItem', playerResults[i]));
        }
        playerResultsUlContainer.appendChild(playerResultsUl);

        computerResultsUlContainer.appendChild(element('span', 'resultLabel', 'Названные компьютером города.'));        
        for (let i = 0; i < computerResults.length; i++) {
            computerResultsUl.appendChild(element('li', 'listItem', playerResults[i]));
        }
        computerResultsUlContainer.appendChild(computerResultsUl);
        

        resultContainer.appendChild(playerResultsUlContainer);
        resultContainer.appendChild(computerResultsUlContainer);

        return resultContainer;
    }

    root.SHRI_CITIES.render = render;
    root.SHRI_CITIES.renderResults = renderResults;
})(this);
