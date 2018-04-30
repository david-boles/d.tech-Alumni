//TODO Implement maps: https://developers.google.com/maps/documentation/javascript/marker-clustering

function initMap() {
  
  //getData(function(Data){
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: {lat: 37.533034, lng: -122.264452}
  });
  
  
  getData(function(data){
    for(var i in data){
      var marker = new google.maps.Marker({
        position: data [i].location,
        //label: "BU",
        map: map
      });
      
      addInfoWindow(marker, data[i])
    }
  });
}

function addInfoWindow(marker, place) {
  var infoWindow = new google.maps.InfoWindow({
    content: place.name,
    position: place.location
  });
  
  marker.addListener("click",function(){ 
    infoWindow.open(map,marker);
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
