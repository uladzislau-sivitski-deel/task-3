(function (root) {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent; 
  var recognition = new SpeechRecognition();  
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  function speech (){
    document.querySelector('.fa-microphone').classList.add('taped');
    recognition.start();
  }

  recognition.onresult = function(event) {
    var last = event.results.length - 1;
    var city = event.results[last][0].transcript; 
    document.querySelector('.main-input').value = city; 
  }

  recognition.onspeechend = function() {
    recognition.stop();
    document.querySelector('.fa-microphone').classList.remove('taped');   
    root.SHRI_CITIES.playersMove();              
  }

  root.SHRI_CITIES.speech = speech;
})(this);
