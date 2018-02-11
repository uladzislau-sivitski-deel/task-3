(function (root) {
    var HINTS = root.SHRI_CITIES.HINTS;

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
        const controlsElem = element('div', 'controls');

        const surrenderButton = element('button', 'surrender-button', 'Сдаться');
        surrenderButton.onclick = () => root.SHRI_CITIES.showResults();
        
        controlsElem.appendChild(surrenderButton);
        controlsElem.appendChild(renderHints());

        interfaceElem.appendChild(renderForm());
        interfaceElem.appendChild(controlsElem);

        return interfaceElem;
    }

    function renderForm() {
        const form = element('form', 'main-form');
        const container = element('div', 'form-container');
        
        const microphone = element('i', 'fas fa-microphone');
        microphone.onclick = () => root.SHRI_CITIES.speech();
        
        const input = element('input', 'main-input');
        input.pattern = '[А-Я]{1}[А-Яа-я-?\'?\s?]+';
        input.autofocus = true;

        const check = () => {
            if (input.validity.patternMismatch) {
                input.setCustomValidity("Город должен быть на русском языке и начинаться с большой буквы!");
            } else {
                input.setCustomValidity("");
            }
        }
        input.oninput = () => check();
        
        container.appendChild(input);
        container.appendChild(microphone);   

        form.appendChild(container);
        form.onsubmit = (e) => root.SHRI_CITIES.playersMove(e);
        return form;
    }

    function renderHints() {
        const hints = element('div', 'hints');
        const hintButton = element('button', 'hint-button', 'Взять подсказку');
        hintButton.onclick = () => root.SHRI_CITIES.getHint();
        hints.appendChild(hintButton);
        for (let i = 0; i < HINTS; i++) {
            hints.appendChild(element('i', 'hint far fa-lightbulb'));
        }
        return hints;
    }

    function renderList(arr, label) {
        const listContainer = element('div', 'result-list-container');        
        const list = element('ol', 'result-list');
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
