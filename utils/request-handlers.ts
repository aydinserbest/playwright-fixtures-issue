import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "../utils/logger";
import { test } from "@playwright/test";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl: string | undefined;
  private defaultBaseUrl: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};
  private defaultAuthtoken: string;
  private clearAuthFlag: boolean

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger,
    authToken: string = ''
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
    this.defaultAuthtoken = authToken;
  }

  url(url: string) {
    this.baseUrl = url;
    return this;
  }
  path(path: string) {
    this.apiPath = path;
    return this;
  }
  params(params: object) {
    this.queryParams = params;
    return this;
  }
  headers(headers: Record<string, string>) {
    this.apiHeaders = headers;
    return this;
  }
  body(body: object) {
    this.apiBody = body;
    return this;
  }
  clearAuth(){
    this.clearAuthFlag = true;
    return this;
  }
  async getRequest(statusCode: number) {
    let responseJson: any;
    const url = this.getUrl();
    await test.step(`GET request to: ${url}`, async () => {
      this.logger.logRequest("GET", url, this.getHeaders());
    const response = await this.request.get(url, {
      headers: this.getHeaders(),
    });
    this.cleanupFields();
    const actualStatusCode = response.status();
    responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.getRequest);
    });
    

    return responseJson;
  }
  async postRequest(statusCode: number) {
    let responseJson: any;
    const url = this.getUrl();
    await test.step(`POST request to: ${url}`, async () => {
      this.logger.logRequest("POST", url, this.getHeaders(), this.apiBody);
    const response = await this.request.post(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    this.cleanupFields();
    const actualStatusCode = response.status();
    responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.postRequest)
  })
    

    return responseJson;
  }
  async putRequest(statusCode: number) {
    let responseJson: any;
    const url = this.getUrl();
    await test.step(`PUT request to: ${url}`, async () => {
      this.logger.logRequest("PUT", url, this.getHeaders(), this.apiBody);
    const response = await this.request.put(url, {
      headers: this.getHeaders(),
      data: this.apiBody,
    });
    this.cleanupFields();
    const actualStatusCode = response.status();
    responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.putRequest)
  })
    
    return responseJson;
  }
  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    await test.step(`DELETE request to: ${url}`, async () => {
    this.logger.logRequest("DELETE", url, this.getHeaders());
    const response = await this.request.delete(url, {
      headers: this.getHeaders(),
    });
    this.cleanupFields();
    const actualStatusCode = response.status();
    this.logger.logResponse(actualStatusCode);
    this.statusCodeValidator(actualStatusCode, statusCode, this.deleteRequest);
  })
}
  private getUrl() {
    const url = new URL(
      `${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`
    );
    for (const [key, value] of Object.entries(this.queryParams)) {
      url.searchParams.append(key, value);
    }
    return url.toString();
  }
  private statusCodeValidator(actualStatusCode: number, expectedStatusCode: number, callingMethod: Function) {
    if(actualStatusCode !== expectedStatusCode) {
        const logs = this.logger.getRecentLogs();
        const error = new Error(`Expected status code ${expectedStatusCode} but got ${actualStatusCode}\n\nRecent API activity: \n${logs}`);
        Error.captureStackTrace(error, callingMethod);
        throw error;
    }
}
private cleanupFields() {
    this.apiPath = "";
    this.queryParams = {};
    this.apiHeaders = {};
    this.apiBody = {};
    this.baseUrl = undefined;
    this.clearAuthFlag = false;
}
private getHeaders() {
  if(!this.clearAuthFlag) {
    this.apiHeaders["Authorization"] = this.apiHeaders["Authorization"] || this.defaultAuthtoken;
  }
  return this.apiHeaders;
}

}
