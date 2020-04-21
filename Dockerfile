FROM nginx:1.17.9-alpine
LABEL project="Safe-Paths"
LABEL maintainer="sherif@extremesolution.com"

WORKDIR /usr/share/nginx/html

ADD . $WORKDIR

