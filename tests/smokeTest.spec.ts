import { test } from "../utils/fixtures";
import { expect } from "@playwright/test";

let authToken: string;

test.beforeAll("run before all", async ({ api }) => {
  const responseToken = await api
    .path("/users/login")
    .body({
      user: { email: "aydinserbest34@gmail.com", password: "Sa21342134" },
    })
    .postRequest(200);
  authToken = "Token " + responseToken.user.token;
});

test("Get Articles", async ({ api }) => {
  const response = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(response.articles.length).toBeLessThanOrEqual(10);
  expect(response.articlesCount).toEqual(10);
});
test("Get Tags", async ({ api }) => {
  const response = await api.path("/tags").getRequest(200);
  expect(response.tags[0]).toEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("create and delete an article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .body({article: {title: "Test TWO",description: "test description",body: "test body",tagList: []}})
    .postRequest(201);
  expect(createArticleResponse.article.title).toEqual("Test TWO");
  const slugId = createArticleResponse.article.slug;

  const articleResponse = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
    expect(articleResponse.articles[0].title).toEqual("Test TWO");

    const deleteArticle = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .deleteRequest(204);
    
    const articleResponseAfterDelete = await api
    .path("/articles")
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
    expect(articleResponseAfterDelete.articles[0].title).not.toEqual("Test TWO");
})
test("create, update and delete an article", async ({ api }) => {
    const createArticleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .body({article: {title: "Test NEW TEST",description: "test description",body: "test body",tagList: []}})
      .postRequest(201);
    expect(createArticleResponse.article.title).toEqual("Test NEW TEST");
    const slugId = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({article: {title: "Test NEW TEST UPDATED",description: "test description",body: "test body",tagList: []}})
        .putRequest(200);
        expect(updateArticleResponse.article.title).toEqual("Test NEW TEST UPDATED")
        const updatedSlugId = updateArticleResponse.article.slug;

  
    const articleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .params({ limit: 10, offset: 0 })
      .getRequest(200);
      expect(articleResponse.articles[0].title).toEqual("Test NEW TEST UPDATED");
  
      const deleteArticle = await api
      .path(`/articles/${updatedSlugId}`)
      .headers({ Authorization: authToken })
      .deleteRequest(204);
      
      const articleResponseAfterDelete = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .params({ limit: 10, offset: 0 })
      .getRequest(200);
      expect(articleResponseAfterDelete.articles[0].title).not.toEqual("Test NEW TEST UPDATED");
  })
