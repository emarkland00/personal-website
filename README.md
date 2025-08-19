My personal website.

This project consists of the following services:

- website: The user facing site. Built with angular
- lambda-tracker: Lambda used to track articles that I've read over time. Automatically post the tagged ones to my website.

# Running locally

To run all services (and all tests), use the following command:

```
docker-compose up --build
```

Requires a .env file at `./backend/lambdas/tracker/.env`. Create a copy `./backend/lambdas/tracker/env.template` and name it `.env`. Fill in the needed values.

If all is working as expected, you should see the site and the lambda(s) running. 

- site at `http://localhost:4200`
- lambda reached by running `curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'`

See the corresponding README.md for each service on more information about how to interact with the lambdas.


# Website

The user facing site. Built with angular

To run the website service individually:

```
docker-compose build website
docker-compose up website
```

## Website Tests

To run the website tests locally:

```
docker-compose build website-test
docker-compose up website-test
```

For more information, see the corresponding [./site/README.md](./site/README.md) file.

# Lambda Tracker

Lambda used to track articles that I've read over time. Automatically post the tagged ones to my website.

To run the tracker lambda locally:

```
docker-compose build lambda-tracker
docker-compose up lambda-tracker
```


## Lambda Tracker Tests

To run the tracker lambda tests locally:

```
docker-compose build lambda-tracker-test
docker-compose up lambda-tracker-test
```

For more information, see the corresponding [./backend/lambdas/tracker/README.md](./backend/lambdas/tracker/README.md) file.