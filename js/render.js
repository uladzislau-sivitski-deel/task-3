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
        const interfacelem = element('div', 'interface');

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

        const hints = element('div', 'hints');
        const hintButton = element('button', 'hint-button', 'Взять подсказку.');
        hintButton.onclick = () => root.SHRI_CITIES.getHint();
        hints.appendChild(hintButton);
        hints.appendChild(element('span', 'hint'));
        hints.appendChild(element('span', 'hint'));
        hints.appendChild(element('span', 'hint'));

        const surrenderButton = element('button', 'surrender-button', 'Сдаться.');
        surrenderButton.onclick = () => root.SHRI_CITIES.showResults();

        form.onsubmit = () => root.SHRI_CITIES.playersMove();

        interfacelem.appendChild(form);
        interfacelem.appendChild(surrenderButton);
        interfacelem.appendChild(hints);
        containerElem.appendChild(interfacelem);
        containerElem.appendChild(map);
        return containerElem;
    }

    function makeList(arr, label) {
        const listContainer = element('div', 'result-list-container');        
        const list = element('list', 'result-list');
        listContainer.appendChild(element('span', 'result-label', label));
        for (let i = 0; i < arr.length; i++) {
            list.appendChild(element('li', 'list-item', arr[i]));
        }
        listContainer.appendChild(list);

        return listContainer
    }

    function renderResults(playerResults, computerResults){
        const resultContainer = element('div', 'result');
        const playerResultsUlContainer = makeList(playerResults, 'Названные вами города.')
        const computerResultsUlContainer = makeList(computerResults, 'Названные компьютером города.');        

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
