(function (root) {

  var MAP;
  var MAP_STATE = root.SHRI_CITIES.MAP_STATE

  function mapInit(){
    if(MAP){MAP.destroy();}
    ymaps.ready(() => { 
        MAP = new ymaps.Map ("map", MAP_STATE);
    });
  }

  function addCityToMap(city, color){
      MAP.panTo(city.coordinates);            
      let placemark = new ymaps.Placemark(
          city.coordinates,
          {iconContent: city.name},
          {preset: `twirl#${color}StretchyIcon`}
      );
      MAP.geoObjects.add(placemark);
  }

  root.SHRI_CITIES.MAP = MAP;
  root.SHRI_CITIES.mapInit = mapInit;
  root.SHRI_CITIES.addCityToMap = addCityToMap;
})(this);
