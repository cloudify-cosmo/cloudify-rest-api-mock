# cloudify-rest-mock
Cloudify rest mock - enabling simultaneous UI development


# How To Use?

```bash
git clone ...
cd cloudify-rest-mock
node src/server.js
>> endpoint is http://10.10.1.10/
>> listening on http://localhost:3333
```

Then set your rest client's endpoint to be http://localhost:3333.


## How to configure the endpoint?

```bash
export CFY_ENDPOINT="http://other.ip/"
node src/server.js
```

## How to mock a request?

Currently this project supports only file mocking. For request /x?y=z there are 4 files we look for in the following order:

 - `x?y=z`
 - `x?y=z.json`
 - `x`
 - `x.json`

The first one is returned.

## Error handling

The proxy may have bugs - like any other code

In this case we return a response with the error and stacktrace.


# Roadmap

 - support error responses
 - support logic (.js) file extensions





