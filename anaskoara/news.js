//const key = "f38da07b397d49d:fldyb0q2akvbz53";
const key = "guest:guest";
const config = {
	headers: {
		Authorization: `Client ${key}`,
	},
};

NEWS_URL = "https://api.tradingeconomics.com/news?f=json";

var news = document.getElementById("news");
async function fetchData(country1, country2) {
	return axios.get(NEWS_URL, config).then((response) => {
		return response.data;
	});
}

async function showNews() {
	if (!news) {
		return;
	}

	try {
		var data = await fetchData();
		data.forEach((element) => {
			var div = document.createElement("div");

			var title = document.createElement("h2");
			title.innerText = element.title;
			div.appendChild(title);

			var date = document.createElement("span");
			date.innerText = element.date;
			div.appendChild(date);

			var desc = document.createElement("p");
			desc.innerText = element.description;
			div.appendChild(desc);

			news.appendChild(div);
		});
	} catch (error) {
		console.log(error);
	}
}

showNews();
