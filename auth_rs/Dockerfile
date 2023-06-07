FROM rust:buster as builder

WORKDIR /app
RUN USER=root cargo new --bin auth_rs
COPY Cargo.toml Cargo.lock ./auth_rs/

WORKDIR /app/auth_rs
RUN cargo build

COPY ./ ./
RUN cargo build

FROM debian:stable-slim
RUN apt update \
    && apt install -y openssl ca-certificates \
    && apt clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /app

COPY --from=builder /app/auth_rs/target/debug/auth_rs ./

CMD ["/app/auth_rs"]
