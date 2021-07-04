import * as ChaiAsPromised from "chai-as-promised";
import * as jwt from "jsonwebtoken";

import { expect, use } from "chai";
import * as mongoose from "mongoose";
import * as nock from "nock";

import { getServer } from "../index";
import { payloadCompleteSignUp } from "./mocks";
import { createUser } from "./conftest";

use(ChaiAsPromised);

let server: any = null;


async function getJwtToken(user: any) {
  const options = {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRE
  };
  return jwt.sign(
    {
      user
    },
    process.env.JWT_SECRET || "",
    options
  );
}

async function getUserFromJwtToken(token: any) {
  const options = {
    issuer: process.env.JWT_ISSUER,
    expiresIn: process.env.JWT_EXPIRE
  };
  return (jwt.decode(
    token
  ) as any).user;
}

describe("🚧  Resource api/user  🚧", () => {
  before(async () => {
    server = await getServer();
    await server.start()
    return Promise.resolve();
  });
  after(async () => {
    if (server) await server.stop();
    return Promise.resolve();
  });

  beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
    const db = mongoose.connection;
    for (const model of db.modelNames()) {
      await db.models[model].createIndexes();
    }
  });
  afterEach(async () => {});

  describe("API api/user", async () => {
    it("fluxo api/user - complete signup - should return 200 success", async () => {
      let response;
      let options;
      let newToken;
      let newUser;
      // criar user de test
      const user = await createUser();
      const token = await getJwtToken(user);
      // mockar response do fileupload
      nock(process.env.FILEUPLOAD_API_URL)
        .post("/api/files/permanent", body => true)
        .reply(200, { url: "123ABC", bucket: "test", filename: "abc1" })
        .persist();
      // POST para completar cadastro
      options = {
        method: "PATCH",
        url: "/api/users",
        headers: {
          authorization: `${token}`,
        },
        payload: payloadCompleteSignUp
      };
      response = await server.inject(options);
      expect(response.statusCode).to.equal(200);
      // checar se o token voltou e tá correto => signUpCompleted
      newToken = response.result.token;
      newUser = await getUserFromJwtToken(newToken);
      expect(newUser.completedSignUp).to.equal(true);

      // GET no user para ter certeza que tá tudo bem
      options = {
        method: "GET",
        url: "/api/account",
        headers: {
          authorization: `${token}`,
        },
      };
      response = await server.inject(options);
      expect(response.statusCode).to.equal(200);
      expect(response.result.completedSignUp).to.equal(true);
    });
  });
});
