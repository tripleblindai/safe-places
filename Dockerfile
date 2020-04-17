FROM nginx:1.17.9-alpine
LABEL proejct="Safe-Paths"
LABEL maintainer="sherif@extremesolution.com"

WORKDIR /usr/share/nginx/html

ADD . $WORKDIR

