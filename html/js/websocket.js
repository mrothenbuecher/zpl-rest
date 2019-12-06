$(function() {
  // if user is running mozilla then use it's built-in WebSocket
  window.WebSocket = window.WebSocket || window.MozWebSocket;

  var connection = new WebSocket('ws://' + location.hostname + ':' + config.websocket_port);

  connection.onopen = function() {
    console.log("WebSocket connected");
  };

  connection.onerror = function(error) {
    console.error(error);
  };

  connection.onmessage = function(message) {
    try {
      var json = JSON.parse(message.data);
      console.log("Websocket send:", json);
      if (json.action == "create" || json.action == "delete") {
        if (json.source == "printer") {
          if (typeof updatePrinterDropdown === "function") {
            updatePrinterDropdown();
          }
        }
        if (json.source == "label") {
          if (typeof updateLabelDropdown === "function") {
            updateLabelDropdown();
          }
        }
        if (json.source == "job") {
          if (typeof updateStatistics === "function") {
            updateStatistics();
          }
        }
      }

    } catch (e) {
      console.error('This doesn\'t look like a valid JSON: ',
        message.data);
      return;
    }
    // handle incoming message
  };
});
