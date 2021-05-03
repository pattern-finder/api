# Pattern finder

This is the API for the app Pattern-finder, which consists of coding challenges focused on pattern detection in images.

# Setup
The intent behind having different docker configuration is to have one optimized with development (JIT) and one optimized for production(no watching, 2 stage dockerfile...)

The setup needs an environment, provided in `.env`.
.env should look like this : 
```
API_EXTERNAL_HOST=localhost
API_EXTERNAL_PORT=3031

API_INTERNAL_PORT=3000

API_EXTERNAL_HOST=localhost
API_EXTERNAL_PORT=3031

API_INTERNAL_PORT=3000

MONGO_USER=docker
MONGO_PASSWORD=password
MONGO_PORT=27017
MONGO_DB=picspy
```

## Dev
To run the dev version, go to root of project and run `docker-compose up`.
It will start a stack (database, minio...) based on the Dockerfile.dev, which is prepared to run NestJs with JIT and the watcher up.

## Prod
To run the production version, run docker-compose.prod.yml or paste it in the  configuration of Portainer.
This will pull an image from a private registry, that was build during CI using Dockerfile, and run it.


