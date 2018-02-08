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
        containerElem.appendChild(element('input', 'playersInput'));
        
        const button = element('button', 'playersButton', 'OK');
        button.onclick = () => root.SHRI_CITIES.playersMove();
        containerElem.appendChild(button);

        return containerElem;
    }

    root.SHRI_CITIES.render = render;
})(this);
