import { test, expect } from '@playwright/test';
let authToken : string

test.beforeAll('run before all', async({request}) => {
  const responseToken = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134" } }
  })
  const responseTokenJSON = await responseToken.json()
   authToken = 'Token ' + responseTokenJSON.user.token
})


test.only('Get Test Tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const tagsResponseJSON = await tagsResponse.json()
  expect(tagsResponse.status()).toEqual(200)
  expect(tagsResponseJSON.tags[0]).toEqual('Test')
  expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
});

test.skip('Get All Articles', async ({ request }) => {
  const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  const articleResponseJSON = await articleResponse.json()
  expect(articleResponse.status()).toEqual(200)
  expect(articleResponseJSON.articles.length).toBeLessThanOrEqual(10)
  expect(articleResponseJSON.articlesCount).toEqual(10)
  expect(articleResponseJSON.articles[0].title).toEqual('Discover Bondar Academy: Your Gateway to Efficient Learning')
  const firstArticleTitle = articleResponseJSON.articles[0].title
  expect(firstArticleTitle).toContain('Bondar Academy')
  expect(firstArticleTitle).toMatch('Bondar Academy')
});

test.fixme('Create article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test TWO",
        "description": "test description",
        "body": "test body",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })
  const newArticleResponseJSON = await newArticleResponse.json()
  const newArticleTitle = newArticleResponseJSON.article.title
  expect(newArticleTitle).toEqual('Test TWO')
  const slugId = newArticleResponseJSON.article.slug

  const deletedArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
    headers: {
      Authorization: authToken
    }

  })
  expect(deletedArticle.status()).toEqual(204)
});

test('Create, Update and Delete article', async ({ request }) => {
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article": {
        "title": "Test NEW ARTICLE",
        "description": "test description",
        "body": "test body",
        "tagList": []
      }
    },
    headers: {
      Authorization: authToken
    }
  })

  const newArticleResponseJSON = await newArticleResponse.json()
  expect(newArticleResponseJSON.article.title).toEqual('Test NEW ARTICLE')
  const newArticleSlug = newArticleResponseJSON.article.slug

  const updatedArticle = await request.put(`https://conduit-api.bondaracademy.com/api/articles/${newArticleSlug}`, {
    data: {
      "article": {
        "title": "Test NEW ARTICLE UPDATED",
        "description": "asasamgmgm",
        "body": "fnfnfnf",
        "tagList": [],
        "slug": "test-article-21027"
      }
    },
    headers: {
      Authorization: authToken
    }

  })
  const updatedArticlejson = await updatedArticle.json()
  expect(updatedArticlejson.article.title).toEqual('Test NEW ARTICLE UPDATED')

  const updatedArticleSlag = updatedArticlejson.article.slug
  const getNewArticles = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
    {
      headers: {
        Authorization: authToken
      }
    }
  )
  const getNewArticlesJSON = await getNewArticles.json()
  expect(getNewArticlesJSON.articles[0].title).toEqual('Test NEW ARTICLE UPDATED')

  const deletedResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${updatedArticleSlag}`, {
    headers: {
      Authorization: authToken
    }

  })
  expect(deletedResponse.status()).toEqual(204)

});