var WebSocketServer = require('ws').Server,
  resources = require('./../resources/model');

exports.listen = function(server) {
  var wss = new WebSocketServer({server: server}); //#A
  console.info('WebSocket server started...');
  wss.on('connection', function (ws) { //#B
    var url = ws.upgradeReq.url;
    console.info(url);
    try {
      Object.observe(selectResouce(url), function (changes) { //#C
        ws.send(JSON.stringify(changes[0].object), function () {
        });
      })
    }
    catch (e) { //#D
      console.log('Unable to observe %s resource!', url);
    };
  });
};

function selectResouce(url) { //#E
  var parts = url.split('/');
  parts.shift();
  var result = resources;
  for (var i = 0; i < parts.length; i++) {
    result = result[parts[i]];
  }
  return result;
}