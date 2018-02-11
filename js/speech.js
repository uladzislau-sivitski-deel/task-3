(function (root) {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent; 
  var recognition = new SpeechRecognition();  
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  function speech (){
      recognition.start();
  }

  recognition.onresult = function(event) {
      var last = event.results.length - 1;
      var city = event.results[last][0].transcript; 
      document.querySelector('.main-input').value = city;        
  }

  recognition.onspeechend = function() {
      recognition.stop();
  }

  root.SHRI_CITIES.speech = speech;
})(this);
