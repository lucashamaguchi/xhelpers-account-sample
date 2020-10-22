import BaseRoute from "xhelpers-api/lib/base-route";
import * as Boom from "@hapi/boom";
import UserService from "../services/user.service";
import {
    completeSignupPayload
} from "./schemas/user.schemas"

const httpResourcePath = "users";

class Routes extends BaseRoute<UserService> {
    constructor() {
      super(new UserService(), ["users"]);

      this.route(
        "PATCH",
        `/api/${httpResourcePath}`,
        {
          description: "complete sign up",
        },
      )
        .validate({
          payload: completeSignupPayload,
        })
        .handler(async (r, h, u) => {
          u.token = (r.auth as any).token;
          const entity = await this.service.completeSignup(u, r.payload);
          if (!entity) throw Boom.badRequest();

          return h.response(entity).code(200);
          })
        .build();
    }
}

module.exports = [...new Routes().buildRoutes()];
