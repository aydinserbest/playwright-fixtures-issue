import { APIRequestContext, expect } from "@playwright/test";
import { APILogger } from "../utils/logger";

export class RequestHandler {
  private request: APIRequestContext;
  private logger: APILogger;
  private baseUrl: string;
  private defaultBaseUrl: string;
  private apiPath: string = "";
  private queryParams: object = {};
  private apiHeaders: Record<string, string> = {};
  private apiBody: object = {};

  constructor(
    request: APIRequestContext,
    apiBaseUrl: string,
    logger: APILogger
  ) {
    this.request = request;
    this.defaultBaseUrl = apiBaseUrl;
    this.logger = logger;
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
  async getRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest("GET", url, this.apiHeaders);
    const response = await this.request.get(url, {
      headers: this.apiHeaders,
    });

    const actualStatusCode = response.status();
    const responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.getRequest);

    return responseJson;
  }
  async postRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest("POST", url, this.apiHeaders, this.apiBody);
    const response = await this.request.post(url, {
      headers: this.apiHeaders,
      data: this.apiBody,
    });

    const actualStatusCode = response.status();
    const responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.postRequest);

    return responseJson;
  }
  async putRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest("PUT", url, this.apiHeaders, this.apiBody);
    const response = await this.request.put(url, {
      headers: this.apiHeaders,
      data: this.apiBody,
    });

    const actualStatusCode = response.status();
    const responseJson = await response.json();

    this.logger.logResponse(actualStatusCode, responseJson);
    this.statusCodeValidator(actualStatusCode, statusCode, this.putRequest);
    return responseJson;
  }
  async deleteRequest(statusCode: number) {
    const url = this.getUrl();
    this.logger.logRequest("DELETE", url, this.apiHeaders);
    const response = await this.request.delete(url, {
      headers: this.apiHeaders,
    });

    const actualStatusCode = response.status();
    this.logger.logResponse(actualStatusCode);
    this.statusCodeValidator(actualStatusCode, statusCode, this.deleteRequest);
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
}
