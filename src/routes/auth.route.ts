import AuthService from "../services/auth.service";
import BaseRoute from "xhelpers-api/lib/base-route";
import { loginPayload } from "./schemas/auth.schemas";

class Routes extends BaseRoute<AuthService> {
  constructor() {
    super(new AuthService(), ["auth"]);

    this.route(
      "POST",
      "/api/auth",
      {
        description: "Route to issue a new token",
        tags: ["api", "auth"],
      },
      false
    )
      .validate({ payload: loginPayload })
      .handler(async (r, h, u) => {
        const entity = await this.service.authenticate(r.payload as any);
        return entity
          ? h.response(entity).code(200)
          : h
              .response({ message: "Username or password is incorrect" })
              .code(401);
      })
      .build();
  }
}

module.exports = [...new Routes().buildRoutes()];
