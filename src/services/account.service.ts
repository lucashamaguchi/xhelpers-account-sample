import * as Boom from "@hapi/boom";
import * as bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

import ActionTokenRepository, { IActionToken } from "../model/action_token";
import User, { IAccount } from "../model/account";

import BaseService from "xhelpers-api/lib/base-service-mongoose";
import MailmanService from "./mailman.service";
import UserService from "./user.service";

export default class AccountService extends BaseService<IAccount> {
  protected sentitiveInfo: any = ["-password", "-__v"];
  mailmanService: MailmanService;
  userService: UserService;
  repositoryActionToken: mongoose.Model<IActionToken>;

  constructor() {
    super(User);
    this.mailmanService = new MailmanService();
    this.userService = new UserService();
    this.repositoryActionToken = ActionTokenRepository;
  }

  protected validate(entity: any, payload: any): Promise<boolean> {
    return Promise.resolve(true);
  }

  /*
   create(user: any, payload: any): Promise<any>;
   update(user: any, id: any, payload: T): Promise<any>;
   delete(user: any, id: any): Promise<void>;
  */

  async create(user: any, payload: any): Promise<any> {
    const email = payload.email.toLowerCase();
    if (!payload.acceptTerms) throw Boom.badRequest("acceptTerms must be true");
    const emailExists = await this.Model.count({ email });
    if (emailExists > 0) throw Boom.badRequest("email already resgistred");
    const entity = super.create(user, {
      ...payload,
      email,
      password: bcrypt.hashSync(payload.password),
    });

    const token = await this.getJwtToken(entity);

    await this.repositoryActionToken.create({
      email,
      token,
    });

    await this.mailmanService.sendEmail(email, "ConfirmEmail", {
      user_name: payload.name,
      link: `${process.env.FRONT_URL}/confirm-email?token=${token}&email=${payload.email}`,
    });

    return entity;
  }

  async getById(u: any, id: any, projection?: any, populateOptions?: {
    path: any;
    select?: any;
  }): Promise<IAccount> {
    const user = await super.getById(u, id, projection, populateOptions);
    user.completedSignUp = await this.userService.getCompletedSignUp(user);
    const { password, ...userObj } = { ...user };
    return userObj as IAccount;
}

  async confirmEmail(payload: any) {
    const actionToken: any = await this.repositoryActionToken.findOne({
      token: payload.token,
      email: payload.email,
    });
    if (!actionToken) throw Boom.badRequest("Invalid token.");

    const user: any = await this.Model.findOne({
      email: payload.email,
    }).select([...this.sentitiveInfo]);

    if (!user) throw Boom.notFound("Account not found");

    const token = await this.getJwtToken(user);

    user.emailConfirmed = true;
    await user.save();

    return {
      token,
    };
  }

  async forgotPassword({ email }) {
    const user: any = await this.Model.findOne({
      email,
      emailConfirmed: true,
    }).select([...this.sentitiveInfo]);
    if (!user)
      throw Boom.badRequest("User not found or account not confirmed yet");

    const token = await this.getJwtToken(user);

    await this.repositoryActionToken.create({
      email,
      token,
    });

    await this.mailmanService.sendEmail(user.email, "ForgotPassword", {
      user_name: user.name,
      link: `${process.env.FRONT_URL}/recuperar-senha?token=${token}&email=${user.email}`,
    });

    return {
      token,
    };
  }

  async recoverAccount({
    token,
    email,
    password,
    newPassword: confirmPassword,
  }) {
    if (password !== confirmPassword)
      throw Boom.badRequest("Password do not match.");

    if (!(await this.validateJwtToken(token)))
      throw Boom.badRequest("Invalid token.");

    const actionToken: any = await this.repositoryActionToken.findOne({
      token,
      email,
    });
    if (!actionToken) throw Boom.badRequest("Invalid token.");

    const user: any = await this.Model.findOne({ email }).select([
      ...this.sentitiveInfo,
    ]);
    if (!user) throw Boom.badRequest("Invalid recovery token.");

    user.password = bcrypt.hashSync(password);
    await user.save();
    await actionToken.remove();

    return {
      email,
    };
  }
}
