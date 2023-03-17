# PortAPI

Send requests from the client-side to any backend server in a couple lines of code

## A simple API request

```javascript
import API from 'portapi';
const myAPI = new API('api-url');

myAPI.post('blog', {
  title: 'Intro to PortAPI',
  content: '<p>Making requests with PortAPI is easy!</p>'
});
```

PortAPI has several useful functions that simplify frontend-to-backend communication, namely reading, creating, and manipulating data.

## Installation

Create a new project folder or open an existing one and install the PortAPI helper:

```bash
npm i portapi-helper
```

Create the file `API.js` and point the helper to a local or live server

```javascript
// API.js
import API from 'portapi';

const server = 'http://localhost:3030/api/'; // API's base url
export default new API(server);
```

Use the helper anywhere in your project

```javascript
import API from './API.js';

tutoruuAPI.get('user').then((data) => {
  console.log(data);
});
```

Output

```bash
{
  "users": [...],
  "total": 1782
}
```

## Usage

As we've just seen, it is very simple to make a request to an unauthenticated server. What if we want to establish authenticated connections? Moreover, what if we want to add options to the request, such as content-type, caching, cors, refferrer, etc.? There's a simple, declarative way to do it with PortAPI:

```javascript
const myAPI = new API('api-url', {
  headers: {
    authorization: 'Bearer SOME_TOKEN',
    contentType: 'application/x-www-form-urlencoded' // defaults to 'application/json'
  },
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache' // *default, no-cache, reload, force-cache, only-if-cached
});
```

> Options that can be passed here are exactly the same as the ones available on the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), as it uses it under the hood.

Now that the API instance `myAPI` was declrared the desired options, any request using this instance will carry these options, regardless of where we're making them in the codebase.

You never need to declare several connections to the same server with different authentication credentials or options. For example, some API routes may require the user to be authenticated. You would use an unauthenticated API instance to make requests that don't require an auth token, but you need not create a seperate instance for handling requests that require authentication. Just use the options interface:

```
myAPI.options.headers['authorization'] = 'YOUR-AUTH-TOKEN';
```

You can also change the base api url

```
myAPI.url = "new-api-url"
```

> Not recommended. It's better practice to create a seperate server instance, but there may be some cases where this is useful.

Now let's see what you can do with an PortAPI instance.

## Methods

PortAPI instances have HTTP-requests-as-methods, namely [GET](#get), [POST](#post), [PATCH](#patch), and [DELETE](#delete). When paired with [query-request](https://www.npmjs.com/package/query-request) on the backend, we can use utility functions such as [search](#search), [sort](#sort), [filter](#filter), [paginate](#paginate), [timebox](#timebox), [populate](#populate) (mongoDB databases only), and [query](#query)

### Get

Execute a `GET` request

```javascript
const users = await myAPI.get('user');
```

### Post

Execute a `POST` request

```javascript
const users = await myAPI.post('user', {
  name: 'PortAPI User',
  email: 'example@domain.com'
});
```

### Patch

Execute a `PATCH` request

```javascript
const user = await myAPI.patch('user/USER_ID', {
  name: 'Updated PortAPI User'
});
```

### Delete

Execute a `DELETE` request

```javascript
const user = await myAPI.delete('user/USER_ID');
```

> The following methods only work if the server/endpoint has query-request activated.

### Search

Weighted full-text search

```javascript
const users = await myAPI.search('user', {
  paths: ['name', 'email'],
  caseSensitive: true, // default is false
  value: 'PortAPI'
});
```

This searches the specified paths and returns a ranked list of items. We can also easily add weights to different paths:

```javascript
const users = await myAPI.search('user', {
  paths: [
    {
      name: 'name',
      weight: 0.3
    },
    {
      name: 'email',
      weight: 0.7
    }
  ],
  value: 'PortAPI'
});
```

### Sort

Returns sorted resources

```javascript
// sorts the user by name in a descending fashion
const users = await myAPI.sort('user', {
  prop: "name",
  direction: "desc" // defaults to 'asc',
  function: 'locale' // comparison logic. Defaults to number comparison.
});
```

### Filter

Returns filtered resources

```javascript
// returns users with 'example' in their email
const users = await myAPI.filter('user', {
  value: 'example',
  prop: 'email',
  function: 'in'
});
```

You can read about all the available filtering functions [here](https://docs.tutoruu.com/helpers/queries#available-filter-functions).

### Paginate

Splits up the resources and returns a particular page

```javascript
// gets items # 51 - 75
const users = await myAPI.paginate('user', {
  limit: 25, // items per page
  page: 3
});
```

### Timebox

Get items created/updated in a given timeframe

```javascript
// gets users created in August 2022
const users = await myAPI.timebox('user', {
  created_after: '2022-08-01',
  created_before: '2022-08-31'
});
```

This assumes that there's a date prop on the model, createdAt, that tracks when the resource was created. No worries iff it's tracked by a different prop, we can specify it in the timebox options:

```javascript
// gets users created in August 2022, using the
// "timestamp" property on the user
const users = await myAPI.timebox('user', {
  created_after: '2022-08-01',
  created_before: '2022-08-31',
  created_prop: 'timestamp'
});
```

This works exactly the same for timeboxing updated resourses

```javascript
// gets users updated in August 2022, using the
// "updated_timestamp" property on the user
const users = await myAPI.timebox('user', {
  updated_after: '2022-08-01',
  updated_before: '2022-08-31',
  updated_prop: 'updated_timestamp'
});
```

### Populate

(mongoDB only) Get a populated resource

```javascript
// gets the users populated reviews as well as his
// classes, their students, and each of their reviews
const users = await myAPI.populate('user/USER_ID', [
  'reviews',
  'classes.students.reviews'
]);
```

### Query

Execute multiple query functions at once. It's very common to paginate search results, so how do we do that with PortAPI?

```javascript
// get the first 25 search results
const users = await myAPI.query('user', {
  search: {
    paths: ['name', 'email'],
    value: 'PortAPI'
  },
  paginate: {
    limit: 25,
    page: 1
  }
});
```

Similarly, we can add any of the above methods to the query options as props

```javascript
// searches users created in august that contain
// example in their email, and returns the first
// 25 results
const users = await myAPI.query('user', {
  timebox: {
    created_after: "2022-08-01",
    created_before: "2022-08-31"
  },
  filter: {
    value: "example",
    prop: "email",
    function: "in"
  }
  search: {
    paths: ["name", "email"],
    value: "PortAPI"
  },
  paginate: {
    limit: 25,
    page: 1
  }
});
```

Cool, right?
