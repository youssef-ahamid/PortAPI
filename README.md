# PortAPI

Easy-peasy, heavily typed, and zod validated requests for browsers, Node, and React Native. Inspired by trpc.

```bash
npm i portapi-helper #npm
yarn add portapi-helper #yarn
pnpm add portapi-helper #pnpm
```

## Basic Usage

```typescript
import { PortAPI } from 'portapi-helper';
import { z } from 'zod';

const client = PortAPI.createClient('https://jsonplaceholder.typicode.com/', {
  headers: {
    'content-type': 'application/json'
  }
});

client.get('todos/1').then((response) => {
  if (!response.success) {
    return console.error(response.error.toString());
  }

  console.log(response.data);
});

// With Zod validation & heavy typing
client
  .get(
    'todos/1',
    z.object({
      id: z.number(),
      title: z.string
    })
  )
  .then((response) => {
    if (!response.success) {
      return console.error(response.error.toString());
    }

    console.log(response.data); // response.data { id: 1, title: 'delectus aut aute' }
  });
```

## Advanced Usage

```typescript
import { PortAPI } from 'portapi-helper';
import { z } from 'zod';

const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {
    headers: {
      'content-type': 'application/json'
    }
  },
  {
    onSuccess: (data) => {},
    onFailedValidation: (error) => {},
    beforeRequest: (request) => {}
    // other handlers
  }
);

client
  .get(
    'todos/1',
    z.object({
      id: z.number(),
      title: z.string()
    })
  )
  .then((response) => {
    if (!response.success) {
      return console.error(response.error.toString());
    }

    console.log(response.data); // response.data { id: 1, title: 'delectus aut aute' }
  });
```

### Request Handlers

Request handlers intercept request at different stages in the request lifecycle.

#### `beforeRequest`

Called before the execution of a request

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    beforeRequest: (request: RequestOptions) => {
      console.log(request.method, request.url, request.body, request.headers);
    }
  }
);
```

#### `onRequest`

Called during the execution of request to mutate the request. Useful for appending the request headers and body.

```typescript
const protectedClient = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onRequest: (request: RequestOptions) => {
      return {
        headers: {
          Authorization: 'Bearer ' + token
        }
      };
    }
  }
);
```

#### `onFailedAuthorization`

Called when a request returns a `403: Unauthorized` status code

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onFailedAuthorization: () => {
      console.log("can't do that!");
    }
  }
);
```

#### `onFailedAuthentication`

Called when a request returns a `401: Unauthenticated` status code

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onFailedAuthentication: () => {
      location.replace('https://www.my-awesome.app/login');
    }
  }
);
```

#### `onFailedRequest`

Called when a request returns a `5xx` status code

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onFailedRequest: (response: any) => {
      // do something
    }
  }
);
```

#### `onFailedParse`

Called when `json.parse()` fails

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onFailedParse: () => {
      // do something
    }
  }
);
```

#### `onFailedValidation`

Called when zod validation fails

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onFailedValidation: (error: z.ZodIssue[]) => {
      console.error(error.join('\n'));
    }
  }
);
```

#### `onSuccess`

Called after successful completion of a request

```typescript
const client = PortAPI.createClient(
  'https://jsonplaceholder.typicode.com/',
  {},
  {
    onSuccess: (data) => {
      // do something
    }
  }
);
```
