
// 1. connect to MPC
var MPC = require('mpc-js').MPC;
var mpc = new MPC();

mpc.connectTCP('localhost', 6600).then(function(result) {
  console.log("Connected to MPC.");
}, function(err) {
  console.log("Cannot connect to MPC: "+err.message);
  //process.exit(1)
});

// 2. volume related functions
var volume = 90;
mpc.playbackOptions.setVolume(volume);

var incrementVolume = function(increment){
	volume += increment;
	if (volume<0) { volume = 0; }
	if (volume>100) { volume = 100; }
	mpc.playbackOptions.setVolume(volume);
}

// 3. register MPC listeners
mpc.on('changed-player', () => { 
    mpc.status.status().then(status => { 
        console.log(status);
        if (status.state == 'play') { 
            mpc.status.currentSong().then(song => console.log(`Playing '${song.title}'`));
        } else {
            console.log('Stopped playback');
        }
    });
});

// 4. api server
var express = require('express')
var app = express()


app.get('/api/controls/status', function (req, res) {
  mpc.status.status().then(function(result) {
    res.send(result);
  }, function(err) {
    res.send(result);
  });
})

app.get('/api/controls/play', function (req, res) {
  mpc.playback.play();
  res.send({"state": "playing"});
})

app.get('/api/controls/pause', function (req, res) {
  mpc.playback.stop();
  res.send({"state": "paused"});
})

app.get('/api/controls/volup', function (req, res) {
  incrementVolume(5);
  res.send({"volume": volume});
})

app.get('/api/controls/voldown', function (req, res) {
  incrementVolume(-5);
  res.send({"volume": volume});
})

// 5. serve webapp
app.use(express.static('webapp'));

app.listen(2612)