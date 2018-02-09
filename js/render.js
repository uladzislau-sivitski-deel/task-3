(function (root) {
    /**
     * Создает HTML элемент заданного типа с заданным CSS классом
     *
     * @param {string} type тип создаваемого HTML элемента
     * @param {string} className CSS класс
     * @param {string} [text] текст
     * @returns {HTMLElement} HTML элемент
     */
    function element(type, className, text) {
        var elem = document.createElement(type);
        elem.className = className;

        if (text) {
            elem.innerText = text;
        }
        return elem;
    }

    /**
     * Создает визуализацию карты по его схеме
     * @returns {HTMLElement} HTML элемент
     */
    function render() {
        const containerElem = element('div', 'container');

        const form = element('form', 'mainForm');
        const input = element('input', 'mainInput');        
        const button = element('button', 'mainButton', 'OK');

        form.appendChild(input);        
        form.appendChild(button);
        form.onsubmit = () => root.SHRI_CITIES.playersMove();
        
        containerElem.appendChild(form);

        return containerElem;
    }

    root.SHRI_CITIES.render = render;
})(this);
