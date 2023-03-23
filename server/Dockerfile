FROM node:alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    build-base

# Build
WORKDIR /project
COPY server ./server
COPY common ./common
RUN cd server && ls -lah && npm install

# Run
ENTRYPOINT ["npx", "ts-node", "server/src/index.ts"]