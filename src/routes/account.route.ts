import * as Boom from "@hapi/boom";

import {
  accountConfirmEmail,
  accountCreate,
  accountRecover,
  accountUpdate,
  forgotPassword,
} from "./schemas/account.schemas";

import AccountService from "../services/account.service";
import BaseRoute from "xhelpers-api/lib/base-route";
import { IAccount } from "../model/account";

const httpResourcePath = "account";

class Routes extends BaseRoute<AccountService> {
  constructor() {
    super(new AccountService(), ["account"]);

    this.route("GET", `/api/${httpResourcePath}`, {
      description: "Get 'Account'",
    })
      .handler(async (r, h, u) => {
        const entity = await this.service.getById(u, u._id, [], {
          path: "."
        });
        if (!entity) throw Boom.notFound();
        return h.response(entity).code(200);
      })
      .build();

    this.route(
      "POST",
      `/api/${httpResourcePath}`,
      {
        description: "Create new 'Account'",
      },
      false
    )
      .validate({ payload: accountCreate })
      .handler(async (r, h, u) => {
        const entity = await this.service.create(u, r.payload);
        if (!entity) throw Boom.notFound();
        return h.response(entity).code(200);
      })
      .build();

    this.route("PATCH", `/api/${httpResourcePath}/{id}`, {
      description: "Update 'Account' by id",
    })
      .validate({
        params: this.defaultIdProperty,
        payload: accountUpdate,
      })
      .handler(async (r, h, u) => {
        if (u._id !== r.params.id) throw Boom.forbidden("does not have permissions");
        const entity = await this.service.update(
          u,
          r.params.id,
          r.payload as IAccount
        );
        if (!entity) throw Boom.notFound();
        return h.response(entity).code(200);
      })
      .build();

    // Actions on Account
    this.route(
      "POST",
      `/api/${httpResourcePath}/confirm-email`,
      {
        description: "Confirm 'Account' email",
      },
      false
    )
      .validate({
        payload: accountConfirmEmail,
      })
      .handler(async (r, h, u) => {
        const entity = await this.service.confirmEmail(r.payload);

        if (!entity) throw Boom.notFound();

        return h.response(entity).code(200);
      })
      .build();

    this.route(
      "POST",
      `/api/${httpResourcePath}/forgot-password`,
      {
        description: "Forgot 'Account' password, request an email to recover",
      },
      false
    )
      .validate({
        payload: forgotPassword,
      })
      .handler(async (r, h, u) => {
        await this.service.forgotPassword(r.payload as any);
        return h.response({}).code(200);
      })
      .build();

    this.route(
      "POST",
      `/api/${httpResourcePath}/recover-account`,
      {
        description: "Recover 'Account' using the information sent to email",
      },
      false
    )
      .validate({
        payload: accountRecover,
      })
      .handler(async (r, h, u) => {
        const entity = await this.service.recoverAccount(r.payload as any);
        return entity
          ? h.response({}).code(200)
          : h.response({ message: "Account not found" }).code(404);
      })
      .build();
  }
}
module.exports = [...new Routes().buildRoutes()];
