import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handlers';

export const test = base.extend<{ api: RequestHandler }>({  
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const requestHandler = new RequestHandler(request, baseUrl);
        await use(requestHandler);
    }
});
