FROM ubuntu:20.04 as builder

#ToDo add mainter see https://docs.docker.com/engine/reference/builder/#label
LABEL maintainer="<yourname>@<email-provider>"

ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/London"
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
        gcc \
        libbz2-dev \ 
        liblz4-dev \
        libpq-dev \
        libssl-dev \
        libxml2-dev \
        libz-dev \
        libzstd-dev \
        make \
        pkg-config \
        wget \
    && mkdir /build \
    && wget -q -O - https://github.com/pgbackrest/pgbackrest/archive/release/2.30.tar.gz | tar zx -C /build \
    && cd /build/pgbackrest-release-2.30/src \
    && ./configure && make

FROM ubuntu:20.04

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
        libxml2 \
        postgresql-client

WORKDIR /usr/bin
COPY --from=builder /build/pgbackrest-release-2.30/src/pgbackrest .

RUN chmod 755 pgbackrest \
    &&  mkdir -p -m 770 /var/log/pgbackrest \
    &&  mkdir -p /etc/pgbackrest/conf.d \
    &&  touch /etc/pgbackrest/pgbackrest.conf \
    &&  chmod 640 /etc/pgbackrest/pgbackrest.conf
