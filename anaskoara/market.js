const key = "guest:guest";
//const key = "f38da07b397d49d:fldyb0q2akvbz53";
var socket = new WebSocket("wss://stream.tradingeconomics.com/?client=" + key);

socket.onopen = function (e) {
	console.clear();
	console.log("[open] Connection established");
	console.log("Sending to server");
	//socket.send('{"topic": "subscribe", "to": "EURUSD:CUR"}');
	var message = {
		topic: "subscribe",
		to: "USDMXN:CUR",
	};
	//["EURUSD:CUR", "AAPL:US", "CL1:COM"],
	message = JSON.stringify(message);
	console.log(message);
	socket.send(message);
};

socket.onmessage = function (event) {
	console.log(event);
};

socket.onclose = function (event) {
	if (event.wasClean) {
		// alert(
		// 	`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`,
		// );
	} else {
		// e.g. server process killed or network down
		// event.code is usually 1006 in this case
		//alert("[close] Connection died");
	}
};

socket.onerror = function (error) {
	console.clear();
	console.log(error);
};

// count = 0;
// var host = window.document.location.host.replace(/:.*/, "");

// ws.onmessage = function (event) {
// 	console.log("Msg: ", event.data);
// 	count++;
// 	if (count >= 5) {
// 		document.getElementById("data_cnt").innerHTML = "";
// 		count = 0;
// 	}

// 	var div = document.createElement("div");
// 	div.innerHTML = event.data;
// 	document.getElementById("data_cnt").appendChild(div);
// };

// ws.onopen = function () {
// 	console.log("Socket is Open!");
// 	//subscripe to a topic:
//
// };
