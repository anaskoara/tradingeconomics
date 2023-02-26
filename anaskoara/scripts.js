const key = "f38da07b397d49d:fldyb0q2akvbz53";

const config = {
	headers: {
		Authorization: `Client ${key}`,
	},
};

const COUNTRIES_ENDPOINT = `https://api.tradingeconomics.com/country?f=json`;

const INDICATORS_ENDPOINT = `https://api.tradingeconomics.com/indicators?f=json`;

const allowedCountries = ["Sweden", "Mexico", "New Zealand", "Thailand"];

const countrySelect = document.querySelector("#country");
const countrySelect1 = document.querySelector("#country1");
var chart = document.querySelector("#chart");
var dataTable = document.getElementById("data-table");
var loading = document.getElementById("loading");
function countryOption(name, value) {
	let option = document.createElement("option");
	option.setAttribute("value", name);
	option.appendChild(document.createTextNode(name));

	return option;
}
function getALlCountries() {
	axios
		.get(COUNTRIES_ENDPOINT, config)
		.then(function (response) {
			// handle success
			response.data
				.filter((element) => {
					return allowedCountries.includes(element.Country);
				})
				.forEach((element) => {
					let o1 = countryOption(element.Country, element.ISO2);
					let o2 = countryOption(element.Country, element.ISO2);

					countrySelect.appendChild(o1);
					countrySelect1.appendChild(o2);
				});
		})
		.catch(function (error) {
			// handle error
			console.error("error");
		})
		.finally(function () {
			// always executed
		});
}

function getAllIndicators() {
	axios
		.get(INDICATORS_ENDPOINT, config)
		.then(function (response) {
			// handle success
		})
		.catch(function (error) {
			// handle error
			//console.error("error country");
		})
		.finally(function () {
			// always executed
		});
}

async function fetchData(country1, country2) {
	return axios
		.get(
			`https://api.tradingeconomics.com/country/${country1},${country2}?f=json`,
			config,
		)
		.then((response) => {
			return response.data;
		});
}
// async function fetchData(c1, c2) {
// 	return fetch("./data.json").then((response) => response.json());
// }

countrySelect.addEventListener("change", compareCountries);
countrySelect1.addEventListener("change", compareCountries);

async function compareCountries() {
	var country1 = countrySelect.value;
	var country2 = countrySelect1.value;
	if (country1 === country2) return;

	dataTable.classList.add("hidden");
	loading.classList.remove("hidden");
	var oldTBody = dataTable.getElementsByTagName("tbody")[0];
	var newTBody = document.createElement("tbody");
	dataTable.replaceChild(newTBody, oldTBody);

	try {
		var jsonData = await fetchData(country1, country2);

		document.getElementById("c1").innerText = country1;
		document.getElementById("c2").innerText = country2;
		var data = new Map();
		jsonData.forEach((element) => {
			var key = element.Category.trim();
			if (data.has(key)) {
				var value = data.get(key);
				if (element.Country === country1) {
					value[0] = element.LatestValue;
				} else {
					value[1] = element.LatestValue;
				}
				data.set(key, value);
			} else {
				if (element.Country === country1) {
					data.set(key, [element.LatestValue, null]);
				} else {
					data.set(key, [null, element.LatestValue]);
				}
			}
		});
		var i = 0;
		data.forEach((v, k) => {
			var newRow = newTBody.insertRow();
			newRow.dataset.label = k;
			newRow.dataset.v0 = v[0];
			newRow.dataset.v1 = v[1];
			addEventListener("click", displayChart);

			var indexCell = newRow.insertCell();

			// Append a text node to the cell
			var index = document.createTextNode(++i);
			indexCell.appendChild(index);

			// Insert label  cell;
			var newCell = newRow.insertCell();

			// Append a text node to the bel label cell
			var newText = document.createTextNode(k);
			newCell.appendChild(newText);

			// Insert a country1 value at the end of the row
			newCell = newRow.insertCell();

			// Append a text node to the cell
			newText = document.createTextNode(v[0] ? v[0] : "-");
			newCell.appendChild(newText);

			// Insert a country2 at the end of the row
			newCell = newRow.insertCell();

			// Append a text node to the cell
			newText = document.createTextNode(v[1] ? v[1] : "-");
			newCell.appendChild(newText);
		});
		dataTable.classList.remove("hidden");
		loading.classList.add("hidden");
		function displayChart(event) {
			var row = event.target.parentElement;
			var label = row.dataset.label;
			var v0 = row.dataset.v0;
			var v1 = row.dataset.v1;

			// Here, `this` refers to the element the event was hooked on
			var ctx = document.createElement("canvas");
			chart.replaceChildren(ctx);

			//const ctx = document.getElementById("myChart");
			//clear existings chart

			const data = {
				labels: [country1, country2],
				datasets: [
					{
						label: label,
						data: [v0, v1],
						backgroundColor: [
							"rgba(255, 99, 132, 0.2)",
							"rgba(255, 159, 64, 0.2)",
						],
						borderColor: ["rgb(255, 99, 132)", "rgb(255, 159, 64)"],
						borderWidth: 1,
					},
				],
			};
			new Chart(ctx, {
				type: "bar",
				data: data,
				options: {
					scales: {
						y: {
							beginAtZero: true,
						},
					},
				},
			});
		}
	} catch (error) {}
}

//hide charts when table is not in viewport

window.addEventListener("scroll", function () {
	if (elementInViewport(dataTable)) {
		chart.classList.remove("hidden");
	} else {
		chart.classList.add("hidden");
	}
});

function elementInViewport(el) {
	var top = el.offsetTop;
	var left = el.offsetLeft;
	var width = el.offsetWidth;
	var height = el.offsetHeight;

	while (el.offsetParent) {
		el = el.offsetParent;
		top += el.offsetTop;
		left += el.offsetLeft;
	}

	return (
		top < window.pageYOffset + window.innerHeight &&
		left < window.pageXOffset + window.innerWidth &&
		top + height > window.pageYOffset &&
		left + width > window.pageXOffset
	);
}
getALlCountries();
//getAllIndicators();
