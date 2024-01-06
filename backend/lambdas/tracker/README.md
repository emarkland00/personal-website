# Lambda for article tracker

This lambda fetches the latest articles that were tracked using the pocket API.

# How to build + run (lambda)

To build, run the command

```
docker build --platform linux/amd64 -f Dockerfile.lambda -t docker-image:test .
```

Finally, run the command

```
docker run --platform linux/amd64 -p 9000:8080 docker-image:test
```

In another terminal, you can query the lambda by running

```
curl "http://localhost:9000/2015-03-31/functions/function/invocations" -d '{}'
```

# Note:

If you want to include env variables, add `COPY ./.env ./` to the second stage in the `Dockerfile.lambda`

```
WORKDIR ${LAMBDA_TASK_ROOT}
COPY --from=builder /usr/app/dist/* ./
COPY ./.env ./    # <--------- add this -----------
CMD ["index.handler"]
```