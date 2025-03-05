import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { createToken } from "../helpers/createToken";
import { validateSchema } from "../utils/schema-validator";

let authToken: string;



test.beforeAll("run before all", async ({ api, config }) => {
 authToken = await createToken('keryjohn70@gmail.com', 'Sa21342134');
});


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

});
test("Get Tags", async ({ api }) => {
  const response = await api.path("/tags")
  .getRequest(200);
  await expect(response).shouldMatchSchema('tags', 'GET_tags');
  //await validateSchema('tags', 'GET_tags', response);
  expect(response.tags[0]).shouldEqual("Test");
  expect(response.tags.length).toBeLessThanOrEqual(10);
});

test("create and delete an article", async ({ api }) => {
  const createArticleResponse = await api
    .path("/articles")
    .body({article: {title: "Test TWO",description: "test description",body: "test body",tagList: []}})
    .postRequest(201);
    await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles');
  expect(createArticleResponse.article.title).shouldEqual("Test TWO");
  const slugId = createArticleResponse.article.slug;

  const articleResponse = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
    expect(articleResponse.articles[0].title).shouldEqual("Test TWO");

    await api
    .path(`/articles/${slugId}`)
    .deleteRequest(204);
    
    const articleResponseAfterDelete = await api
    .path("/articles")
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
    expect(articleResponseAfterDelete.articles[0].title).not.shouldEqual("Test TWO");
})
test("create, update and delete an article", async ({ api }) => {
    const createArticleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .body({article: {title: "Test NEW TEST",description: "test description",body: "test body",tagList: []}})
      .postRequest(201);
    expect(createArticleResponse.article.title).shouldEqual("Test NEW TEST");
    const slugId = createArticleResponse.article.slug;

    const updateArticleResponse = await api
        .path(`/articles/${slugId}`)
        .headers({ Authorization: authToken })
        .body({article: {title: "Test NEW TEST UPDATED",description: "test description",body: "test body",tagList: []}})
        .putRequest(200);
        expect(updateArticleResponse.article.title).shouldEqual("Test NEW TEST UPDATED")
        const updatedSlugId = updateArticleResponse.article.slug;

  
    const articleResponse = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .params({ limit: 10, offset: 0 })
      .getRequest(200);
      expect(articleResponse.articles[0].title).shouldEqual("Test NEW TEST UPDATED");
  
      const deleteArticle = await api
      .path(`/articles/${updatedSlugId}`)
      .headers({ Authorization: authToken })
      .deleteRequest(204);
      
      const articleResponseAfterDelete = await api
      .path("/articles")
      .headers({ Authorization: authToken })
      .params({ limit: 10, offset: 0 })
      .getRequest(200);
      expect(articleResponseAfterDelete.articles[0].title).not.shouldEqual("Test NEW TEST UPDATED");
  })
 
