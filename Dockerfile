FROM node:20-bullseye-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    git \
    curl \
    build-essential \
    ruby \
    ruby-dev \
    && rm -rf /var/lib/apt/lists/*

RUN gem install shopify-cli theme-check

WORKDIR /workspace

EXPOSE 3000 9292

CMD ["npm", "run", "dev"]
