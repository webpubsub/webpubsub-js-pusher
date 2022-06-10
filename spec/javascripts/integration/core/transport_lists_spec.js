var TestEnv = require('testenv');
var Webpubsub = require('webpubsub_integration');
if (TestEnv === "web") window.Webpubsub = Webpubsub;
var Integration = require("integration");
var Mocks = require("mocks");
var Runtime = require('runtime').default;
var Network = require("net_info").Network;
var defineTransport = require('core/strategies/strategy_builder').defineTransport;
var BestConnectedEverStrategy = require('core/strategies/best_connected_ever_strategy').default;
var transports = Runtime.Transports;

if (TestEnv == "web") {
  var BASE_FALLBACK = "sockjs"
} else {
  var BASE_FALLBACK = "xhr_polling"
}

module.exports = function() {
  Integration.describe("Transport lists", function() {
    var _isReady = Webpubsub.isReady;

    beforeEach(function() {
      spyOn(transports.ws, "isSupported").and.returnValue(true);
      spyOn(transports.xhr_streaming, "isSupported").and.returnValue(true);
      spyOn(transports[BASE_FALLBACK], "isSupported").and.returnValue(true);

      spyOn(transports.ws, "createConnection")
        .and.callFake(Mocks.getTransport);
      spyOn(transports.xhr_streaming, "createConnection")
        .and.callFake(Mocks.getTransport);
      spyOn(transports[BASE_FALLBACK], "createConnection")
        .and.callFake(Mocks.getTransport);

      spyOn(Runtime, "getDefaultStrategy").and.callFake(function(config) {
        return new BestConnectedEverStrategy([
          defineTransport(config, 'a', 'ws', 1, {}),
          defineTransport(config, 'b', 'xhr_streaming', 2, {}),
          defineTransport(config, 'c', BASE_FALLBACK, 3, {}),
        ]);
      });

      spyOn(Network, "isOnline").and.returnValue(true);
      Webpubsub.isReady = true;
    });

    afterEach(function() {
      Webpubsub.isReady = _isReady;
    });

    it("should use all transports if the whitelist is not specified", function() {
      var webpubsub = new Webpubsub("asdf");
      expect(transports.ws.createConnection).toHaveBeenCalled();
      expect(transports.xhr_streaming.createConnection).toHaveBeenCalled();
      expect(transports[BASE_FALLBACK].createConnection).toHaveBeenCalled();
      webpubsub.disconnect();
    });

    it("should not use any transports if the whitelist is empty", function() {
      var webpubsub = new Webpubsub("asdf", {
        enabledTransports: []
      });
      expect(transports.ws.createConnection).not.toHaveBeenCalled();
      expect(transports.xhr_streaming.createConnection).not.toHaveBeenCalled();
      expect(transports[BASE_FALLBACK].createConnection).not.toHaveBeenCalled();
      webpubsub.disconnect();
    });

    it("should use only transports from the whitelist", function() {
      var webpubsub = new Webpubsub("asdf", {
        enabledTransports: ["a", "c"]
      });
      expect(transports.ws.createConnection).toHaveBeenCalled();
      expect(transports.xhr_streaming.createConnection).not.toHaveBeenCalled();
      expect(transports[BASE_FALLBACK].createConnection).toHaveBeenCalled();
      webpubsub.disconnect();
    });

    it("should not use transports from the blacklist", function() {
      var webpubsub = new Webpubsub("asdf", {
        disabledTransports: ["a", "b"]
      });
      expect(transports.ws.createConnection).not.toHaveBeenCalled();
      expect(transports.xhr_streaming.createConnection).not.toHaveBeenCalled();
      expect(transports[BASE_FALLBACK].createConnection).toHaveBeenCalled();
      webpubsub.disconnect();
    });

    it("should not use transports from the blacklist, even if they are on the whitelist", function() {
      var webpubsub = new Webpubsub("asdf", {
        enabledTransports: ["b", "c"],
        disabledTransports: ["b"]
      });
      expect(transports.ws.createConnection).not.toHaveBeenCalled();
      expect(transports.xhr_streaming.createConnection).not.toHaveBeenCalled();
      expect(transports[BASE_FALLBACK].createConnection).toHaveBeenCalled();
      webpubsub.disconnect();
    });
  });
}
