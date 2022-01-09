// ah? ah? get it? because scripps is a college :P
// I'm really bad aren't I
const spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/13Wkdyq70xm4Kkx0MseYj7sr2BJNKJV4AzMoMY1U90XM/export?format=csv&id=13Wkdyq70xm4Kkx0MseYj7sr2BJNKJV4AzMoMY1U90XM&gid=836240143';
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
  console.log("It's begun");
  console.log("Fetching spreadsheet...")
  const datap = Promise.all([fetch(spreadsheetUrl, {
    method: "GET",
    headers: {
      "Content-Type": "text",
    },
  }).then(v => v.text())]);
  const [plainText] = await datap;
  console.log("Fetched", plainText);
  const ary = parseCSV(plainText);
  console.log("Parsed", ary);
  const obj = ary.map(a => ({
    email: a[1],
    firstName: a[2],
    lastName: a[3],
    year: a[4],
    placeName: a[5],
    personalEmail: a[6],
    lat: +a[7],
    lng: +a[8],
  }));
  const places = {};
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    if(val.placeName) {
      const { lat, lng } = val;
      const stringy = `${lat}, ${lng}`;
      if (places[stringy]) {
        places[stringy].alumni.push(val);
      } else {
        places[stringy] = {name: val.placeName, alumni: [val], fn: addMarker({ lat, lng })};
      }
    }
  });
  console.log(places);
  Object.keys(places).forEach((place) => {
    const aary = places[place].alumni;
    var info = `${places[place].name}`;
    aary.forEach((alumnus) => {
      info += `<br>- ${alumnus.firstName} ${alumnus.lastName} ${alumnus.personalEmail ? `(${alumnus.personalEmail})` : ''}`;
    });
    places[place].fn(info);
  });
}

function parseCSV(str) {
  var arr = [];
  var quote = false;  // true means we're inside a quoted field

  // iterate over each character, keep track of current row and column (of the returned array)
  for (var row = col = c = 0; c < str.length; c++) {
    var cc = str[c], nc = str[c + 1];        // current character, next character
    arr[row] = arr[row] || [];             // create a new row if necessary
    arr[row][col] = arr[row][col] || '';   // create a new column (start with empty string) if necessary

    // If the current character is a quotation mark, and we're inside a
    // quoted field, and the next character is also a quotation mark,
    // add a quotation mark to the current column and skip the next character
    if (cc === '"' && quote && nc === '"') {
      arr[row][col] += cc;
      ++c;
      continue;
    }

    // If it's just one quotation mark, begin/end quoted field
    if (cc === '"') {
      quote = !quote;
      continue;
    }

    // If it's a comma and we're not in a quoted field, move on to the next column
    if (cc === ',' && !quote) {
      ++col;
      continue;
    }

    // If it's a newline (CRLF) and we're not in a quoted field, skip the next character
    // and move on to the next row and move to column 0 of that new row
    if (cc === '\r' && nc === '\n' && !quote) {
      ++row;
      col = 0;
      ++c;
      continue;
    }

    // If it's a newline (LF or CR) and we're not in a quoted field,
    // move on to the next row and move to column 0 of that new row
    if (cc === '\n' && !quote) {
      ++row;
      col = 0;
      continue;
    }
    if (cc === '\r' && !quote) {
      ++row;
      col = 0;
      continue;
    }

    // Otherwise, append the current character to the current column
    arr[row][col] += cc;
  }
  return arr;
}
