// ah? ah? get it? because scripps is a college :P
// I'm really bad aren't I
const collegeDataURL = 'colleges.json';
const corsURL = 'https://cors-anywhere.herokuapp.com/';
const spreadSheetBaseURL = 'https://docs.google.com/spreadsheets/u/1/d/1t2ojUXaMfIJX3GTD20y060_Yl7qWdpfK0Gqgz85v4LU/export?format=csv&id=1t2ojUXaMfIJX3GTD20y060_Yl7qWdpfK0Gqgz85v4LU&gid=836240143&';
const getSpreadSheetURL = () => `${corsURL}${spreadSheetBaseURL}${new Date().getTime()}`;
let currentInfoWindow = null;
const addMarker = obj => (info) => {
  const marker = new google.maps.Marker({ position: obj, map: window.map });
  const infoWindow = new google.maps.InfoWindow({ position: obj, content: info });
  currentInfoWindow = infoWindow;
  marker.addListener('click', () => {
    currentInfoWindow.close();
    infoWindow.open(window.map, marker);
    currentInfoWindow = infoWindow;
    // and THIS is why closures are awesome
  });
};
async function init() {
  const mapElem = document.getElementById('map');
  window.map = new google.maps.Map(mapElem, {
    zoom: 3,
    center: {
      lat: 36.2351866,
      lng: -95,
    },
  });
  // console.log("It's begun");
  const csvurl = getSpreadSheetURL();
  // console.warn('Fetching the CSV');
  // console.warn('Fetching the college data at the same time');
  const datap = Promise.all([fetch(csvurl).then(v => v.text())]);
  const [plainText] = await datap;
  const ary = plainText.split('\n').slice(1).map(v => v.slice(0, -1).split`,`.slice(1));
  // console.warn('Finished parsing the CSV');
  // console.warn('Finished parsing the college data');
  const obj = ary.map(a => ({
    email: a[0],
    firstName: a[1],
    lastName: a[2],
    year: a[3],
    college: a[4],
    personalEmail: a[5],
    lat: +a[6],
    lng: +a[7],
  }));
  const places = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    const { lat, lng } = val;
    const stringy = `${lat}, ${lng}`;
    if (places[stringy]) {
      places[stringy].push(val);
    } else {
      places[stringy] = [val];
    }
    val.fn = addMarker({ lat, lng });
  });
  Object.keys(places).forEach((place) => {
    const aary = places[place];
    // it's the alumnus array
    aary.forEach((alumnus) => {
      const info = `${alumnus.college}<br>- ${alumnus.firstName} ${alumnus.lastName} ${alumnus.email ? `(${alumnus.email})` : ''}`;
      alumnus.fn(info);
    });
  });
}
