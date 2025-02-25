import { test as base } from '@playwright/test';
import { RequestHandler } from './request-handlers';
import { APILogger } from "../utils/logger";
import { setCustomLogger } from './custom-expect';

export const test = base.extend<{ api: RequestHandler }>({  
    api: async ({request}, use) => {
        const baseUrl = 'https://conduit-api.bondaracademy.com/api';
        const logger = new APILogger();
        setCustomLogger(logger);
        const requestHandler = new RequestHandler(request, baseUrl, logger);
        await use(requestHandler);
    }
});
