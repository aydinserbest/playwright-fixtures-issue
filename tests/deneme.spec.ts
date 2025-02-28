import {test, expect} from "@playwright/test";
let authToken: string;



test.beforeAll("run before all", async ({ request }) => {
  const responseToken = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: { "user": { "email": "aydinserbest34@gmail.com", "password": "Sa21342134" } }
    })
    const responseTokenJSON = await responseToken.json()
  authToken = "Token " + responseTokenJSON.user.token;
  console.log(responseTokenJSON)
});
test("Get Articles", async ({ request }) => {
    const articleResponse = await request.get('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
    const articleResponseJSON = await articleResponse.json()
    console.log(articleResponseJSON)
    });