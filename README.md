# explorative-api-server
Explorative web server for exposing public data from Helsingborgs stad.

# Proofs

- a small monolithic webserver can act as a broker between client and various REST based systems
- defining GraphQL endpoints requires little overhead and skill
- performance of broker is in practical cases inherited from dependant data services


# Endpoints

Recommended test environment: [https://graphiql-online.com](https://graphiql-online.com)

Implemented endpoints:
- `/alarm/graphql`
  - exposes select data from [https://api.helsingborg.se](https://api.helsingborg.se)
- `/localfs/graphql`
  - exposes select data the local filesystem. Has no real value. Never. Ever. Just for fun.

# Getting started

## Run compiled js
```sh
    $ yarn
    $ DEBUG=* yarn start
```
The code above starts webserver on http://localhost:3000 with some verbosity.
## Run and watch for code changes
```sh
    $ DEBUG=* yarn watch
```

The code above starts webserver on http://localhost:3000 with some verbosity.

# Docker 
This app can be run from docker.

## Docker compose
Dev environment with watch for code changes.  
Copy `.env-example` to `.env` and run
```sh
    $ docker compose up
```
The code above starts webserver on http://localhost:3000

## Build image
```
docker build -t ghcr.io/helsingborg-stad/explorative-api-server .
```

## Start container
```
docker run -it --init -d -p 3000:80 ghcr.io/helsingborg-stad/explorative-api-server
```
Access app on http://localhost:3000 


# Getting bored
- [ ] go ahead and implement authentication
- [ ] find a good strategy for filtering and pagination and implement these in the varous GQL providers
- [ ] setup testing framework