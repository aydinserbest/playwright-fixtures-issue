import { test } from "../utils/fixtures";
import { expect } from "../utils/custom-expect";
import { createToken } from "../helpers/createToken";

let authToken: string;
/*
test.beforeAll("run before all", async ({ api, config }) => {
 authToken = await createToken('keryjohn70@gmail.com', 'Sa21342134');
});
*/

test("create and delete an article", async ({ api }) => {
const articleResponseAfterDelete = await api
    .path("/articles")
    //.headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200);
    console.log(articleResponseAfterDelete.articlesCount);
    expect(articleResponseAfterDelete.articlesCount).shouldEqual(10);
})