import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handlers';

export const test = base.extend ({ 
    api: async ({}, use) => {
        const requestHandler = new RequestHandler();
        await use(requestHandler);
    }
});
