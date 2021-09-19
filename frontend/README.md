[![Actions Status](https://github.com/pattern-finder/frontend/workflows/build/badge.svg)](https://github.com/pattern-finder/api/actions)
[![Actions Status](https://github.com/pattern-finder/frontend/workflows/tests/badge.svg)](https://github.com/pattern-finder/api/actions)
[![Actions Status](https://github.com/pattern-finder/frontend/workflows/release/badge.svg)](https://github.com/pattern-finder/api/actions)

# PicSpy

This is the API for the app Pattern-finder, which consists of coding challenges focused on pattern detection in images.

# Setup

The intent behind having different docker configuration is to have one optimized with development (JIT) and one optimized for production(no watching, 2 stage dockerfile...)

The setup needs an environment, provided in `.env`.
.env should look like `.env.example`

## Dev

To run the dev version, go to root of project and run `docker-compose up`.
It will start a stack (database, minio...) based on the Dockerfile.dev, which is prepared to run NestJs with JIT and the watcher up.

Other programs from the stack (api...) will be added as images to pull from the registry, so you will have the latest release to work with

## Prod

To run the production version, run docker-compose.prod.yml or paste it in the configuration of Portainer.
This will pull an image from a private registry, that was build during CI using Dockerfile, and run it.

# Contribute

Husky has been installed to this project.

If you cannot push to the repos, it means there is soemthing wrong with the code.

Husky will run tests, eslint, and prettier, without fixing. If you want to try fixing them automatically, use `npm run lint:fix` and `npm run format:fix`.

For tests, you can run `npm run tests`.

If the fix cannot be done automatically however, you will have to read the error message and find a solution.

If you're lost with this, please send me a message on discord. :)

1. Assing yourself an issue, so everyone is aware that this issue is being taken care of.
2. Create a branch locally and eventually push it.
3. Once you think the code is ready, you can test prettier and eslint on it to check that the code is clean, and try running tests. Or you can commit it, and then create a pull requestfrom your branch to main/master.
4. Wait for the pipeline to run if you are not sure that your code passes tests.
5. Once the pipeline has run, merge the PR and preferably delete your branch.
6. If your issue remains open, close it.
7. get yourself a coffee and enjoy a well deserved break

# CI/CD

CI/CD is automated via github actions.

## Tests

Before merging a pull request, pipeline runs tests , eslint, and prettier via test.yml

## Build

Whenever a change is pushed to the main branch, tests, eslint and prettier are run, followed by a build. This allows us to unsure the code is safe before deploying it.

## Release

When a release is published, a docker image is built and pushed into a docker registry, for it to then be pulled by the production server. Then, a webhook is called on the production server for it to pull the new image.
