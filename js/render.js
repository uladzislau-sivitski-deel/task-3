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
        
        const lives = element('div', 'lives')
        lives.appendChild(element('span', 'heart'));
        lives.appendChild(element('span', 'heart'));
        lives.appendChild(element('span', 'heart'));
        form.appendChild(lives);

        form.onsubmit = () => root.SHRI_CITIES.playersMove();
        
        containerElem.appendChild(form);
        containerElem.appendChild(map);
        
        return containerElem;
    }

    function renderResults(playerResults, computerResults){
        const resultContainer = element('div', 'result');
        const playerResultsUlContainer = element('div', 'result-list-container');
        const computerResultsUlContainer = element('div', 'result-list-container');
        const playerResultsUl = element('ul', 'result-list');
        const computerResultsUl = element('ul', 'result-list');


        playerResultsUlContainer.appendChild(element('span', 'result-label', 'Названные вами города.'));
        for (let i = 0; i < playerResults.length; i++) {
            playerResultsUl.appendChild(element('li', 'list-item', playerResults[i]));
        }
        playerResultsUlContainer.appendChild(playerResultsUl);

        computerResultsUlContainer.appendChild(element('span', 'result-label', 'Названные компьютером города.'));        
        for (let i = 0; i < computerResults.length; i++) {
            computerResultsUl.appendChild(element('li', 'list-item', playerResults[i]));
        }
        computerResultsUlContainer.appendChild(computerResultsUl);
        
        const button = element('button', 'new-game-button', 'Cыграть еще раз!');
        button.onclick = () => { root.SHRI_CITIES.newGame() };


        resultContainer.appendChild(playerResultsUlContainer);
        resultContainer.appendChild(button);
        resultContainer.appendChild(computerResultsUlContainer);

        return resultContainer;
    }

    root.SHRI_CITIES.render = render;
    root.SHRI_CITIES.renderResults = renderResults;
})(this);
