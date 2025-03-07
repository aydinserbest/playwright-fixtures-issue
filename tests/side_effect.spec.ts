import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { createToken } from "../helpers/createToken";
import { validateSchema } from "../utils/schema-validator";

test("Get Articles", async ({ api }) => {
    const response = await api
      .path("/articles")
      //.headers({ Authorization: authToken })
      .params({ limit: 10, offset: 0 })
      .clearAuth()
      .getRequest(200);
      await expect(response).shouldMatchSchema('articles', 'GET_articles');
    expect(response.articles.length).shouldBeLessThanOrEqual(10);
    expect(response.articlesCount).shouldEqual(10);

    const response2 = await api
    .path("/tags")
  .getRequest(200);
  expect(response2.tags[0]).shouldEqual("Test");
  expect(response2.tags.length).shouldBeLessThanOrEqual(10);
  
  });