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
        containerElem.appendChild(renderInterface());
        containerElem.appendChild(map);
        return containerElem;
    }

    function renderInterface() {
        const interfaceElem = element('div', 'interface');
        const surrenderButton = element('button', 'surrender-button', 'Сдаться.');
        surrenderButton.onclick = () => root.SHRI_CITIES.showResults();
        interfaceElem.appendChild(renderForm());
        interfaceElem.appendChild(surrenderButton);
        interfaceElem.appendChild(renderHints());
        return interfaceElem;
    }

    function renderForm() {
        const form = element('form', 'main-form');
        const container = element('div', 'form-container');
        const microphone = element('i', 'fas fa-microphone');
        microphone.onclick = () => root.SHRI_CITIES.speech();
        const input = element('input', 'main-input');
        input.pattern = '[А-Я]{1}[А-Яа-я-?\'?\s?]+';

        const check = () => {
            if (input.validity.patternMismatch) {
                input.setCustomValidity("Город должен быть на русском языке и начинаться с большой буквы!");
            } else {
                input.setCustomValidity("");
            }
        }
        input.oninput = () => check();
        
        const button = element('button', 'main-button', 'OK');

        container.appendChild(input);
        container.appendChild(microphone);       
        container.appendChild(button);
        form.appendChild(container);
        form.onsubmit = (e) => root.SHRI_CITIES.playersMove(e);
        
        return form;
    }

    function renderHints() {
        const hints = element('div', 'hints');
        const hintButton = element('button', 'hint-button', 'Взять подсказку.');
        hintButton.onclick = () => root.SHRI_CITIES.getHint();
        hints.appendChild(hintButton);
        for (let i = 0; i < 3; i++) {
            hints.appendChild(element('span', 'hint'));
        }
        return hints;
    }

    function renderList(arr, label) {
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
        const playerResultsUlContainer = renderList(playerResults, 'Названные вами города.')
        const computerResultsUlContainer = renderList(computerResults, 'Названные компьютером города.');        

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
