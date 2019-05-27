# url cache preparator service

A microservice that periodically looks for in the database for urls that are ready to be cached and set their status as "ready-to-be-cached".

Environment variables:
```
  CRON_PATTERN
    The time interval of service's re-execution.
```

## Installation

To add the service to your stack, add the following snippet to docker-compose.yml:

```
download:
    image: lblod/url-cace-preparator-service:0.0.0
    volumes:
    restart: always
    logging: *default-logging
    environment:
      CACHING_CRON_PATTERN: '0 */15 * * * *' # run every quarter
```
