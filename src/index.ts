export * as PortAPI from './PortAPI';

import { z } from 'zod';
import { createClient } from './PortAPI';

const client = createClient(
  'https://jsonplaceholder.typicode.com/todos/',
  {},
  {
    onSuccess: console.log,
    onFailedValidation: console.error,
    onRequest: () => {
      return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 21978297389723189'
        }
      };
    }
  }
);

client.get('1', z.object({ id: z.number(), title: z.string() }));
