import * as Boom from "@hapi/boom";
import * as bcrypt from "bcryptjs";

import User, { IAccount, UserType } from "../model/account";

import BaseService from "xhelpers-api/lib/base-service-mongoose";
import UserService from "./user.service";

export default class AuthService extends BaseService<IAccount> {
  protected sentitiveInfo: never[];
  protected userService : UserService;
  constructor() {
    super(User);
    this.userService = new UserService();
  }

  protected validate(entity: any, payload: any): Promise<boolean> {
    return Promise.resolve(true);
  }

  async ssoCallback(payload: {
    email: string;
    name: string;
    avatar: any;
    token: string;
    userType: any;
    meta: any;
    [key: string]: any;
  }) {
    const filter = { email: payload.email };
    let user: IAccount = (await this.Model.findOne(filter)) as IAccount;

    switch (payload.userType) {
      case "Google":
        payload.userType = UserType.Google;
        break;
      case "Facebook":
        payload.userType = UserType.Facebook;
        break;
      case "Github":
        payload.userType = UserType.Github;
        break;
      default:
        payload.userType = UserType.Default;
        break;
    }

    if (!user) {
      await this.create(null, {
        ...payload,
        metadata: payload.meta,
      });
      user = await User.findOne(filter);
    } else {
      if (user.userType !== UserType.Default) payload.metadata = payload.meta;
      await this.update(user, user._id, payload as any);
    }

    const userObj = user.toJSON();
    userObj.completedSignUp = await this.userService.getCompletedSignUp(user);
    const { password, ...userRest } = userObj;

    const token = await this.getJwtToken(userRest);
    return {
      url: `${process.env.FRONT_URL}/sso/callback/auth?token=${token}`,
    };
  }

  async authenticate({ email, password }) {
    const account: IAccount = (await this.Model.findOne({ email })) as IAccount;
    if (!account) throw Boom.notFound("User not found");
    if (!account.active) throw Boom.unauthorized("User is inactive.");
    if (account.userType === UserType.Default && !account.emailConfirmed)
      throw Boom.unauthorized("User must confirm the email before login.");

    if (bcrypt.compareSync(password, account.password)) {
      const accountObj = account.toObject();
      // tslint:disable-next-line: no-shadowed-variable
      const { email, name, id } = accountObj;
      accountObj.completedSignUp = await this.userService.getCompletedSignUp(account);
      // tslint:disable-next-line: no-shadowed-variable
      const { password, ...accountToken } = accountObj;
      const token = await this.getJwtToken(accountToken);
      return {
        id,
        email,
        name,
        token,
      };
    }
  }
}
