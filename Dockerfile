FROM resin/rpi-raspbian
RUN echo 'Acquire::ForceIPv4 "true";' | sudo tee /etc/apt/apt.conf.d/99force-ipv4
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN sudo apt install nodejs
RUN sudo apt-get install mpd mpc
ADD . /app
RUN cd /app && npm install 
CMD cd /app && node index.js