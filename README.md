# rpi-radio
This app runs a docker based headless radio player on the pi that can be remote-controlled by any smarthphone/pc. Audio is output to /dev/snd, so you need to make sure the docker container has access to it (see examples). This allows the host system to play back the audio.

RPi radio leverages mpd under the hood and is written in nodejs.

### Screenshots
<img src="screenshot.png" width="200">

### Prerequisites
- a raspberry pi (tested on RPi2)
- docker (install with `curl -sSL https://get.docker.com | sh`)
### Examples
- `docker run -d --device=/dev/snd:/dev/snd -p 2612:2612 svanscho/rpi-radio`

If you want the container to always run (even when the RPi rebooted):
- `docker run -d --restart=always --device=/dev/snd:/dev/snd -p 2612:2612 svanscho/rpi-radio` (mind the **--restart=always**)

Then visit http://<rpi-address>:2612 and e.g. add shortcut to your Android home screen. The app will be fullscreen and behave like a normal application.