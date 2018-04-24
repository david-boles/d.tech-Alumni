//TODO Implement maps: https://developers.google.com/maps/documentation/javascript/marker-clustering

//alert("sometext");
setTimeout(function(){
  document.getElementById('paragraph').innerText="somenewtext";
},5000);

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
