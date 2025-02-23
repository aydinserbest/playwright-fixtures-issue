import { test, expect } from '@playwright/test';

test('Get test tags', async ({ request }) => {
    const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags')
    const tagsResponseJSON = await tagsResponse.json()
    console.log(tagsResponseJSON)
    expect(tagsResponse.status()).toEqual(200)
    expect(tagsResponseJSON.tags.length).toBeLessThanOrEqual(10)
    expect(tagsResponseJSON.tags[0]).toEqual('Test')
    expect(tagsResponseJSON.tags[1]).toEqual('GitHub')
});
test('Get all articles', async ({ request }) => {
    const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const articleResponseJSON = await articleResponse.json()
    console.log(articleResponseJSON)
    expect(articleResponseJSON.articlesCount).toEqual(10)
    expect(articleResponseJSON.articles[1].title).toContain('pre-recorded')
});
test('Get articles', async ({ request }) => {
    await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
        .then(response => response.json()) // yanıt geldi, JSON'a çeviriyoruz
        .then(data => console.log(data)); // JSON verisini konsola yazdırıyoruz

    /*
    data => console.log(data)) de, data yerine herhangi bir tanım-isim yazabilirdik,
    PW'a ya da JS'e ait bir isim değil,
    data isimlendirmesi, sadece ,  önceki işlemin sonucu (Promise’in çözülmüş değeri) bir parametre olarak
    temsil eder, API’den dönen JSON verisini temsil ediyor
    bunları da yazsak çalışırdı:
        .then(response => console.log(response))
        .then(jsonResult => console.log(jsonResult))
        .then(apiResponse => console.log(apiResponse))
        .then(articles => console.log(articles))
    */

});
test('create and delete article', async ({ request }) => {
    const tokenResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134" } }
    })
    const tokenResponseJSON = await tokenResponse.json()
    const tokenAuth = 'Token ' + tokenResponseJSON.user.token

    const createArticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
        data: {
            "article": {
                "title": "Test TWO",
                "description": "test description",
                "body": "test body",
                "tagList": []
            }
        },
        headers: {
            Authorization: tokenAuth
        }
})
    
    const articleResponse = await createArticle.json()
    console.log(articleResponse)
    expect(articleResponse.article.author.username).toEqual('Aydin34')
    const slugId = articleResponse.article.slug


    const deletedArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`, {
        headers: {
            Authorization: tokenAuth
        }
        
    })
    expect(deletedArticle.status()).toEqual(204)
});
test('Create, Update and Delete article', async ({ request }) => {
    const responseToken = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
      data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134" } }
    })
    const responseTokenJSON = await responseToken.json()
  
    const authToken = 'Token ' + responseTokenJSON.user.token
  
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