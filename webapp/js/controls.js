var sendPlay = function(stationUrl){
  var url = "/api/controls/play";
  if(stationUrl){
    encodedStationUrl = encodeURIComponent(stationUrl);
    url+="?url="+encodedStationUrl;
  }
  $.ajax({
      type: "GET",
      url: url,
      success: function (data) { 
        updateState("play");
      }
  });
}

var sendStop = function(){
  $.ajax({
      type: "GET",
      url: "/api/controls/stop",
      success: function (data) { 
        console.log(data);
        updateState("stop");
      }
  });
}

var sendVolUp = function(){
  $.ajax({
      type: "GET",
      url: "/api/controls/volup",
      success: function (data) { 
        console.log(data);
      }
  });
}

var sendVolDown = function(){
  $.ajax({
      type: "GET",
      url: "/api/controls/voldown",
      success: function (data) { 
        console.log(data);
      }
  });
}

var getStatus = function(callback){
  $.ajax({
      type: "GET",
      url: "/api/controls/status",
      success: function (data) {
        callback(data.status.state, undefined);
      },
      error: function (err) {
        callback(undefined, err);
      }
  });
}

var getCurrentSong = function(callback){
  $.ajax({
      type: "GET",
      url: "/api/controls/currentsong",
      success: function (data) {
        callback(data.currentSong.title, undefined);
      },
      error: function (err) {
        callback(undefined, err);
      }
  });
}

var isPlaying = function(){
  return ($("#controls-play-stop").data("state") === "play");
}

var updateState = function(state, err){
  if (err){
    console.log("Cannot update state: "+err.message)
  } else{
    if (state === "play"){
      $("#controls-play-stop").data("state", "play");
      displayStopButton();      
    } else{
      $("#controls-play-stop").data("state", "stop");
      displayPlayButton();
      updateNowPlaying("Stopped");
    }
  }
}

var displayPlayButton = function(){
    $("#controls-play-stop").attr("src", "img/play.svg");
}

var displayStopButton = function(){
    $("#controls-play-stop").attr("src", "img/pause.svg");
}

var updateNowPlaying = function(stationTitle, err){
  if(err){
    $("#nowplaying").text("Playout error");
  } else {
      if(isPlaying()){
        if(stationTitle){
          $("#nowplaying").text(toTitleCase(stationTitle));    
        }
      } else{
        $("#nowplaying").text("Stopped");
      }
  }
}

var toTitleCase = function (str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$( "#controls-volumedown" ).click(function() {
  sendVolDown();
});

$("#controls-play-stop").click(function(){
  if($("#controls-play-stop").data("state") == "play"){
    sendStop();
  } else {
    sendPlay();
  }
});

$(".card").click(function(){
  var url = $(this).attr('data-url');
  sendPlay(url);
});

$("#controls-volumeup" ).click(function() {
  sendVolUp();
});

setInterval(function(){
   getStatus(updateState);
   getCurrentSong(updateNowPlaying);
}, 5000);

