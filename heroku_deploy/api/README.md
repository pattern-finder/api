[![Actions Status](https://github.com/pattern-finder/api/workflows/build/badge.svg)](https://github.com/pattern-finder/api/actions)
[![Actions Status](https://github.com/pattern-finder/api/workflows/tests/badge.svg)](https://github.com/pattern-finder/api/actions)
[![Actions Status](https://github.com/pattern-finder/api/workflows/release/badge.svg)](https://github.com/pattern-finder/api/actions)

# PicSpy

This is the API for the app Pattern-finder, which consists of coding challenges focused on pattern detection in images.

# Setup
The intent behind having different docker configuration is to have one optimized with development (JIT) and one optimized for production(no watching, 2 stage dockerfile...)

The setup needs an environment, provided in `.env`.
.env should look like `.env.example`


## Dev
First, clone the project recursively, in order for the frontend project to be downloaded: `git clone --recursive git@github.com:pattern-finder/api.git`
If you already have the projetct cloned and want to add properly the frontend, use this command: ` git submodule update --init --recursive`

To run the dev version, go to root of project and run `docker-compose up`.
It will start a stack (database, minio...) based on the Dockerfile.dev, which is prepared to run NestJs with JIT and the watcher up.

Other programs from the stack (frontend...) will be added as images to pull from the registry, so you will have the latest release to work with.

Languages and basic challenges will be seeded automatically. 

## Prod
To run the production version, run docker-compose.prod.yml or paste it in the  configuration of Portainer.
This will pull an image from a private registry, that was build during CI using Dockerfile, and run it.

Seed cannot run in production mode so you will have to run the scripts either in the kubernetes pods or in the container.

# Contribute

1) Assing yourself an issue, so everyone is aware that this issue is being taken care of.
2) Create a branch locally and eventually push it.
3) Once you think the code is ready, you can test prettier and eslint on it to check that the code is clean, and try running tests. Or you can commit it, and then create a pull requestfrom your branch to main/master.
4) Wait for the pipeline to run if you are not sure that your code passes tests.
5) Once the pipeline has run, merge the PR and preferably delete your branch.
6) If your issue remains open, close it.
7) get yourself a coffee and enjoy a well deserved break

# CI/CD
CI/CD is automated via github actions.
## Tests
Before merging a pull request, pipeline runs tests , eslint, and prettier via test.yml

## Build
Whenever a change is pushed to the main branch, tests, eslint and prettier are run, followed by a build. This allows us to unsure the code is safe before deploying it.

## Release
When a release is published, a docker image is built and pushed into a docker registry, for it to then be pulled by the production server. Then, a webhook is called on the production server for it to pull the new image.

## Architecture

### Database
```mermaid
erDiagram
    USER }o--||CHALLENGE : creates
    USER }o--|| ATTEMPT : issues
    BOOTSTRAP ||--o{ ATTEMPT : issues
    SERIE }o--|| USER : creates
    CHALLENGE }o--|| SERIE : belongs
    PICTURE }|--|| CHALLENGE : belongs
    LANGUAGE }|--|| CHALLENGE : available
    LANGUAGE ||--|| BOOTSTRAP : written
    BOOTSTRAP }|--||CHALLENGE : belongs
```

### business routes
Here is the data flow when creating a user. Same goes for a challenge.
![User creation FlowChart](./doc/user_creation.svg)

### execution routes
How folders are sent to godbox: 
```
.
????????? lib/
???   ????????? bib.py
????????? pictures/
???   ????????? picture-1
???   ????????? picture-2
???   ????????? picture-3
???   ????????? picture-4
???   ????????? picture-5
????????? main.py
```

`flowchart now invalid as judge-0server has been replaced with godbox`

Here is the data flow when attempting to solve a challenge, and then fetching again the data.
![User creation FlowChart](./doc/attempt_cycle.svg)
