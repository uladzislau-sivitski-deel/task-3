(function (root) {
    root.SHRI_CITIES.mapInit();       
    document.querySelector('.outer').appendChild(
        root.SHRI_CITIES.render()
    );
})(this);
