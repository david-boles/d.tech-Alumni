//TODO Implement maps: https://developers.google.com/maps/documentation/javascript/marker-clustering

function initMap() {

	//getData(function(Data){
	var map = new google.maps.Map(document.getElementById('map'), {
		zoom: 2,
		center: {lat: 37.533034, lng: -122.264452}
	});

	getData(function (data) {
		data.forEach(function (college, i) {
			var marker = new google.maps.Marker({
				position: college.location,
				map: map
			});

			addInfoWindow(marker, college);
		});
	});
}

var infoWindows = [];
function addInfoWindow(marker, place) {
	var text = place.name;
	for (var i in place.alumni) {
		var alumn = place.alumni[i];
		text += '<br>- ' + alumn.name + ' \'' + alumn.year + (alumn.email ? ' (' + alumn.email + ')' : '');
	}

	var infoWindow = new google.maps.InfoWindow({
		content: text,
		position: place.location
	});
	
	infoWindows.push(infoWindow);

	marker.addListener("click", function () {
		for(var i in infoWindows) {
			infoWindows[i].close();
		}
		infoWindow.open(map, marker);
	});
}

const firstNameColumnIndex = 1;
const lastNameColumnIndex = 2;
const yearColumnIndex = 3;
const locationColumnIndex = 4;
const emailColumnIndex = 5;


function interpretCollegeArray(spreadsheetArrayData, callback) {

	var geocoder = new google.maps.Geocoder();

	spreadsheetArrayData.shift();

	var colleges = [];

	spreadsheetArrayData.forEach(function (row, i) {
		row.shift();

		const currentCollegeName = row[locationColumnIndex];

		var collegeAlreadyAdded = false;
		colleges.forEach(function (college, i) {
			if (college.name === currentCollegeName && !collegeAlreadyAdded) {
				collegeAlreadyAdded = true;

				colleges[i].alumni.push({name: row[firstNameColumnIndex] + " " + row[lastNameColumnIndex], year: row[yearColumnIndex], email: row[emailColumnIndex]});
				setTimeout(()=>{callback(colleges)}, 100);
			}
		});
		if (!collegeAlreadyAdded) {
			const newCollege = {
				name: currentCollegeName,
				alumni: []
			};
			const newCollegeIndex = colleges.push(newCollege) - 1;
			geocoder.geocode({'address': currentCollegeName}, function (results, status) {
				try {
					newCollege.location = {
						"lat": results[0].geometry.location.lat(),
						"lng": results[0].geometry.location.lng()
					};

					colleges[newCollegeIndex].alumni.push({name: row[firstNameColumnIndex] + " " + row[lastNameColumnIndex], year: row[yearColumnIndex], email: row[emailColumnIndex]});
				}catch(e) {
					console.error(newCollegeIndex, currentCollegeName, e);
				}
				setTimeout(()=>{callback(colleges)}, 100);
			});
		}
	});
}

//Attempt to retrieve and parse the database from GitHub. Argument is a callback function that gets passed the parsed JSON (an array).
function getData(callback) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function () {
		if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
			try {
				var spreadsheetData = parseCSV(xmlHttp.responseText);
				var i = 0;
				interpretCollegeArray(spreadsheetData, function (interpretedColleges) {
					i++;
					if (i === spreadsheetData.length) {
						callback(interpretedColleges);
					}
				});
			} catch (e) {
				console.error("Parse failed: ", xmlHttp, e);
			}
		}
	};
	xmlHttp.open("GET", "https://docs.google.com/spreadsheets/d/1t2ojUXaMfIJX3GTD20y060_Yl7qWdpfK0Gqgz85v4LU/export?format=csv", true); // true for asynchronous
	xmlHttp.send(null);
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
