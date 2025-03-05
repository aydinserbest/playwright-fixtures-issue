import { test, expect } from '@playwright/test';

let authToken: string;

test('Get tags', async ({ request }) => {
  const getTags = await request.get( 'https://conduit-api.bondaracademy.com/api/tags');
  const getTagsJSON = await getTags.json();
  console.log(getTagsJSON);
  expect(getTagsJSON.tags).toContain("Test");
});
test('Get tags2', async ({request}) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/tags')
  const responseJSON = await response.json()
  console.log(responseJSON)
})
test('get articles list', async ({request}) => {
  const response = await request.get('https://conduit-api.bondaracademy.com/api/articles')
  const responseJSON = await response.json()
  //console.log(responseJSON)
  //console.log(responseJSON.articlesCount)
  console.log(responseJSON.articles.length)
  // Sadece title'ları al ve yazdır
  //console.log(responseJSON.articles.map(article => article.title));
  console.log(
    responseJSON.articles.map((article, index) => `Article ${index + 1} title: ${article.title}`).join('\n')
  );
})
test('get user token', async ({request}) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134" } }
  })
  const responseJSON= await response.json()
  console.log(responseJSON)
  const token = 'Token ' + responseJSON.user.token
  console.log(token)
})
test('login with a different acount', async ({request}) => {
  const response = await request.post ('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134"}}
  })
  const responseJSON = await response.json()
  console.log(responseJSON)
  console.log (responseJSON.user.token)
})
test('general token record', async({request}) => {
  const response = await request.post ('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {"user": { "email": "keryjohn70@gmail.com", "password": "Sa21342134"}}
  })
  const responseJSON = await response.json()
  authToken = 'Token ' + responseJSON.user.token
  console.log(authToken)
  console.log(responseJSON)
}) 
test('create article', async({request}) => {
  const response = await request.post ('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134"}}
  })
  const responseJSON = await response.json()
  const tokenResponse = 'Token ' + responseJSON.user.token

  const articlesResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0', {
    headers: {
      Authorization: tokenResponse
    }
  })
  const articlesResponseJSON = await articlesResponse.json()
  console.log(articlesResponseJSON)
  const articalNumber = articlesResponseJSON.articles.length
  console.log(articalNumber)
  console.log(articlesResponseJSON.articlesCount)
  expect(articlesResponseJSON.articlesCount).toEqual(articalNumber)
})

