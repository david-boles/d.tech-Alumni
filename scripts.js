//TODO Implement maps: https://developers.google.com/maps/documentation/javascript/marker-clustering

function initMap() {
  
  //getData(function(Data){
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 37.533034, lng: -122.264452}
  });
  
  
  var BrownUniversity = {
    "lat": 41.8270796,
    "lng": -71.4045813
  };
  var marker = new google.maps.Marker({
    position: BrownUniversity,
    //label: "BU",
    map: map
  });
  var infoWindow = new google.maps.InfoWindow({
    content:"whatever",
    position: BrownUniversity
  });
  marker.addListener("click",function(){
    infoWindow.open();
  });
  
}


//Attempt to retrieve and parse the database from GitHub. Argument is a callback function that gets passed the parsed JSON (an array).
function getData(callback) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      try {
        callback(JSON.parse(xmlHttp.responseText));
      }catch(e) {
        console.error("Parse failed: ", xmlHttp, e);
      }
    }
  }
  xmlHttp.open("GET", "https://raw.githubusercontent.com/david476/d.tech-Alumni/master/alumni_info.json", true); // true for asynchronous 
  xmlHttp.send(null);
}
