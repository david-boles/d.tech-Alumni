//TODO Implement maps: https://developers.google.com/maps/documentation/javascript/marker-clustering

//alert("sometext");
setTimeout(function(){
  document.getElementById('paragraph').innerText="somenewtext";
},5000);

//Attempt to retrieve and parse the database from GitHub. Arguments are functions that get passed the parsed JSON, the XMLHttpRequest, or _ respectively.
function getData(onSuccess, onGetFail, onParseFail) {
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText);
    }else {
      onGetFail(xmlHttp);
    }
  }
  xmlHttp.open("GET", theUrl, true); // true for asynchronous 
  xmlHttp.send(null);
}
