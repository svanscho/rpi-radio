FROM resin/rpi-raspbian
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
ADD . /app
RUN cd /app && npm install && node index.js