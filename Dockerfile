FROM node:8.15.0

WORKDIR /www/scaleTodo

RUN apt-get update && apt-get install -y
RUN npm install pm2 -g

# Install Package
ADD package.json /www/scaleTodo
RUN npm install

# Add Application
ADD . /www/scaleTodo

# Start Script
RUN cp docker-entrypoint.sh /usr/local/bin/ && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
