var ejs = require('ejs');
var config = require('config');

// 1. connect to MPC
var MPC = require('mpc-js').MPC;
var mpc = new MPC();

mpc.connectTCP('localhost', 6600).then(function(result) {
  console.log("Connected to MPC.");
  mpc.playbackOptions.setRepeat(true); //e.g. for reconnecting when a stream gets lost
}, function(err) {
  console.log("Cannot connect to MPC: "+err.message);
  process.exit(1)
});

// 2. volume related functions
var volume;
mpc.status.status().then(function(result) {
  setVolume(result.volume);
  console.log("Volume set to: "+volume);
}, function(err) {
  console.log(err.message);
});

var incrementVolume = function(increment){
	volume += increment;
  setVolume(volume);
	mpc.playbackOptions.setVolume(volume);
}

var setVolume = function(value){
  if (value<0) { value = 0; }
  if (value>100) { value = 100; }
  volume = value;
}

// 3. register MPC listeners
mpc.on('changed-player', () => { 
    mpc.status.status().then(status => { 
        //console.log(status);
        if (status.state == 'play') { 
            mpc.status.currentSong().then(song => console.log(`Playing '${song.title}'`));
        } else {
            console.log('Stopped playback');
        }
    });
});

// 4. api server & webapp
var express = require('express')
var app = express()
app.set('view engine', 'ejs')


app.get('/api/controls/status', function (req, res) {
  mpc.status.status().then(function(result) {
    res.send({"status": result});
  }, function(err) {
    res.send(500, err);
  });
})

app.get('/api/controls/play', function (req, res) {
  if(req.query.url){
    mpc.currentPlaylist.clear();
    uri = decodeURIComponent(req.query.url);
    mpc.currentPlaylist.add(uri);
    mpc.playback.play();
  } else {
    mpc.playback.play();
  }
  res.send({"state": "playing"});
})

app.get('/api/controls/stop', function (req, res) {
  mpc.playback.stop();
  res.send({"state": "stopped"});
})

app.get('/api/controls/volup', function (req, res) {
  incrementVolume(5);
  res.send({"volume": volume});
})

app.get('/api/controls/voldown', function (req, res) {
  incrementVolume(-5);
  res.send({"volume": volume});
})

app.get('/api/controls/currentsong', function (req, res) {
  mpc.status.currentSong().then(function(result) {
    res.send({"currentSong": result});
  }, function(err) {
    res.send(500, err);
  });
})

app.get('/api/controls/statistics', function (req, res) {
  mpc.status.statistics().then(function(result) {
    res.send({"statistics": result});
  }, function(err) {
    res.send(500, err);
  });
})

// 5. serve webapp
app.use('/css', express.static('webapp/css'));
app.use('/img', express.static('webapp/img'));
app.use('/js', express.static('webapp/js'));

var stations = config.get('stations');

app.get('/', function (req, res) {
  ejs.renderFile("webapp/index.html", {"stations": stations}, undefined, function(err, str){
      res.send(str);
  });
})

app.listen(2612)