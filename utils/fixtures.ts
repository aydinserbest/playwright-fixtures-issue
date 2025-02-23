import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handlers';

export const test = base.extend<{ api: RequestHandler }>({  // ✅ TypeScript artık biliyor!
    api: async ({}, use) => {
        const requestHandler = new RequestHandler();
        await use(requestHandler);
    }
});
