FROM ubuntu:20.04 as builder

#ToDo add mainter see https://docs.docker.com/engine/reference/builder/#label
LABEL maintainer="<yourname>@<email-provider>"

ENV DEBIAN_FRONTEND="noninteractive" TZ="Europe/London"
RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
        make \
        gcc \
        libpq-dev \
        libssl-dev \
        libxml2-dev \
        pkg-config \
        liblz4-dev \
        libzstd-dev \
        libbz2-dev \ 
        libz-dev \
        wget \
    && mkdir /build \
    && wget -q -O - https://github.com/pgbackrest/pgbackrest/archive/release/2.30.tar.gz | tar zx -C /build \
    && cd /build/pgbackrest-release-2.30/src && ./configure && make

FROM ubuntu:20.04

RUN apt-get update \
    && apt-get upgrade -y \
    && apt-get install -y \
        postgresql-client \
        libxml2

COPY --from=builder /build/pgbackrest-release-2.30/src/pgbackrest /usr/bin

RUN chmod 755 /usr/bin/pgbackrest \
    &&  mkdir -p -m 770 /var/log/pgbackrest \
    &&  mkdir -p /etc/pgbackrest/conf.d \
    &&  touch /etc/pgbackrest/pgbackrest.conf \
    &&  chmod 640 /etc/pgbackrest/pgbackrest.conf
