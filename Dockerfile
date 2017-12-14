FROM resin/rpi-raspbian:wheezy
RUN echo 'Acquire::ForceIPv4 "true";' | sudo tee /etc/apt/apt.conf.d/99force-ipv4
RUN sudo apt-get update
RUN sudo apt-get install mpd
ADD docker/mpd.conf /etc/mpd.conf
RUN mkdir -p /mpd && chown mpd /mpd && touch /mpd/db && chown mpd /mpd/db
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install nodejs
ADD app /app
RUN cd /app && npm install 
CMD sudo service mpd start && cd /app && node api.js
EXPOSE 2612
