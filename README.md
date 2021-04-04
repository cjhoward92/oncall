# Oncall

This is a monorepo for an oncall application. The application will eventually allow one to enter a series of phone numbers or email addresses for the "oncall" of the period. This contact address will be used with AWS SNS to send notifications when something bad happens in the driving AWS account (or series of accounts).

When a CloudWatch alarm changes state to ALARM it will send an SNS notification to this app, and this app will then forward that to the specified contact.

In the far future this will also have a mobile interface that will "page" the oncall. This will be a siren of sorts that will alert the oncall of a major issues (e.g. an outage).

This is a fun project that will hopefully prove useful to someone in the future.

## Packages

The following is a list of packages with a short description:

### Server

This is the server code. It is bundled into an AWS Lambda zip file and can be uploaded to Lambda to use behind an API Gateway. When developing this server runs locally on port `8080`.

### Client

This is an Angular app used as the application client. In production it is meant to be hosted from an Amazon S3 Bucket as an SPA. This application runs on port `4200` in development.
