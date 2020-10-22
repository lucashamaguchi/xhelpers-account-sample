require("dotenv").config();

import AuthService from "./services/auth.service";
import { createServer } from "xhelpers-api/lib/server";
const pkgJson = require("../package.json");

const options: any = {
  serverOptions: {
    port: process.env.PORT || 3100,
    host: process.env.HOST || "127.0.0.1",
  },
  options: {
    jwt_secret: process.env.JWT_SECRET,
    swaggerOptions: {
      info: {
        title: pkgJson.name,
        version: pkgJson.version,
      },
      schemes: [process.env.SSL === "true" ? "https" : "http"],
      grouping: "tags",
    },
    routeOptions: {
      routes: "*/routes/*.route.js",
    },
    mongooseOptions: {
      uri: process.env.MONGODB_URI,
    },
    enableSSO: true,
    ssoCallback: async (user: {
      email: string;
      name: string;
      avatar: any;
      token: string;
      userType: any;
      meta: any;
    }) => {
      const service = new AuthService();
      const ssoResp = await service.ssoCallback(user);
      return {
        url: ssoResp.url,
      };
    },
  },
};

export async function getServer(){
  let server: any = {};
  server = await createServer(options);
  return server;
}

async function start() {
  let server = await getServer();
  await server.start();
  return server;
}

if (typeof require !== 'undefined' && require.main === module) {
  start();
}
