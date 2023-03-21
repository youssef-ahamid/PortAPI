export * as PortAPI from './PortAPI';

import { z } from 'zod';
import { createClient } from './PortAPI';

const client = createClient('https://jsonplaceholder.typicode.com/todos/', {}, {
    onSuccess: console.log,
    onFailedValidation: console.error,
});

client.get('1', z.object({ id: z.number(), title: z.number() }));
