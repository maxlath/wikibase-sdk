# FROM alpine:latest


# RUN apk add bash curl coreutils

# RUN adduser -D admin

# USER admin

# RUN mkdir /tmp/install

# WORKDIR /tmp/install

# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
# RUN bash -c 'echo "NODE_VERSION: $NODE_VERSION"'
# # RUN bash -c 'ks'
# # RUN bash -c 'sourls
# ce ~/.nvm/nvm.sh && nvm install "$NODE_VERSION" && which node && node --version'

# CMD bash


# Borrowed from https://github.com/tzenderman/docker-nvm

# Dockerfile used to build base image for projects using Python, Node, and Ruby.
FROM phusion/baseimage:0.9.17

ARG NODE_VERSION

MAINTAINER Tim Zenderman <tim@bananadesk.com>
RUN rm /bin/sh && ln -s /bin/bash /bin/sh && \
    sed -i 's/^mesg n$/tty -s \&\& mesg n/g' /root/.profile

WORKDIR /code

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p /usr/local/nvm

ENV PATH $NVM_DIR/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH

RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash && \
    echo 'source $NVM_DIR/nvm.sh' >> /etc/profile
RUN /bin/bash -l -c "nvm install $NODE_VERSION && nvm use $NODE_VERSION"

CMD npm run build && npm run lint && npm test