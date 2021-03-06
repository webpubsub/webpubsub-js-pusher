var base64encode = require('core/base64').default;
var util = require('core/util').default;
var ScriptReceiverFactory = require('dom/script_receiver_factory').ScriptReceiverFactory;
var Collections = require('core/utils/collections');
var JSONPRequest = require('dom/jsonp_request').default;
var ScriptReceivers = require('dom/script_receiver_factory').ScriptReceivers;

exports.API_URL = "http://webpubsub-js-integration-api.herokuapp.com";
exports.API_EU_URL = "http://webpubsub-js-integration-api-eu.herokuapp.com";

exports.describe = function(name, body) {
  if (navigator.userAgent.match(/phantomjs/i)) {
    // Don't run integration tests from Guard
    return;
  }

  describe(name + " (integration)", body);
};

exports.getRandomName = function(prefix) {
  return prefix + "_" + util.now() + "_" + Math.floor(Math.random() * 1000000);
};

exports.sendAPIMessage = function(request) {
  var Webpubsub = window.Webpubsub;
  var jsonpRequest = new JSONPRequest(request.url, {
    channel: request.channel,
    event: request.event,
    data: request.data
  });
  var receiver = Webpubsub.Integration.ScriptReceivers.create(function() {
    Webpubsub.Integration.ScriptReceivers.remove(receiver);
  });
  jsonpRequest.send(receiver);
};

function encodeParamsObject(data) {
  return Collections.mapObject(data, function(value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    return encodeURIComponent(base64.encode(value.toString()));
  });
}
