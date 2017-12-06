var sendPause = function(){
  $.ajax({
      type: "GET",
      url: "/api/controls/pause",
      success: function (data) { 
        console.log(data);
      }
  });
}

var sendPlay = function(){
  $.ajax({
      type: "GET",
      url: "/api/controls/play",
      success: function (data) { 
        console.log(data);
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

var displayPlayButton = function(){
    $("#controls-play-pause").attr("src", "img/play.svg");
}

var displayPauseButton = function(){
    $("#controls-play-pause").attr("src", "img/pause.svg");
}

$( "#controls-volumedown" ).click(function() {
  sendVolDown();
});

$("#controls-play-pause").click(function(){
  if($("#controls-play-pause").data("state") == "playing"){
    sendPause();
    displayPlayButton();
    $("#controls-play-pause").data("state", "paused");
  } else {
    sendPlay();
    displayPauseButton();
    $("#controls-play-pause").data("state", "playing");
  }
});


$("#controls-volumeup" ).click(function() {
  sendVolUp();
});