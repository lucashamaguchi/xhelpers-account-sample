import BaseService from "xhelpers-api/lib/base-service-mongoose";
import Account, { IAccount } from "../model/account";
import FileUploadService from "./fileUpload.service";
import * as Boom from "@hapi/boom";


export default class UserService extends BaseService<IAccount> {
  protected fileUploadService: FileUploadService;
  protected sentitiveInfo: any = [
    "-password",
  ];

  constructor() {
    super(Account);
    this.fileUploadService = new FileUploadService();
  }

  protected async validate(entity: any, payload: any): Promise<boolean> {
    return true;
  }

  public async completeSignup(user: any, payload: any): Promise<object>{
    const oldUser = await this.Model.findById(user._id) as IAccount;
    if(!oldUser) throw Boom.notFound("user not found");
    const newPayloadUser = {
      ...user,
      id: user?._id,
    };
    if (payload.cpf) {
      payload.cpf = payload.cpf.replace(/\D/g, "");
    } else {
      payload.cpf = oldUser.personInfo.cpf;
    }
    await this.validate(null, payload);
    if (payload.zipCode) payload.zipCode = payload.zipCode.replace(/\D/g, "");

    try {
      payload.files = await this.parseFiles(user, payload, oldUser);
    } catch (err) {
      console.error(err);
      throw Boom.badRequest("error parsing files");
    }

    payload.updatedAt = new Date();

    const payloadToUpdate: IAccount = {
      personInfo: {
        ...oldUser.personInfo?.toJSON(),
        ...payload
      }
    } as IAccount

    await super.update(newPayloadUser, user._id, payloadToUpdate);

    const entity = await this.Model.findById(user._id) as IAccount;
    const { password, ...userObj } = entity.toJSON();

    userObj.completedSignUp = await this.getCompletedSignUp(entity);

    const token = await this.getJwtToken(userObj);

    return {
      token
    }
  }

  public async getCompletedSignUp(entity: IAccount): Promise<boolean> {
    const hasSelfieFile = await this.getHasFile(entity, "SELFIE_FILE");
    const hasIdentityFile = await this.getHasFile(entity, "IDENTITY_FILE");

    const hasFilledForm = !!(
      entity.personInfo?.fullName &&
      entity.personInfo?.documentNumber &&
      entity.personInfo?.cpf &&
      entity.personInfo?.birthDate &&
      entity.personInfo?.motherName &&
      entity.personInfo?.street &&
      entity.personInfo?.number &&
      entity.personInfo?.neighborhood &&
      entity.personInfo?.city &&
      entity.personInfo?.state &&
      entity.personInfo?.zipCode
    );
    return !!(
      hasFilledForm &&
      hasSelfieFile &&
      hasIdentityFile
    );
  }

  public async getHasFile(entity: IAccount, fileType: string): Promise<boolean> {
    const parsedFileTypes = entity.personInfo?.files.map(file => {
      return file.type;
    });
    return !!(parsedFileTypes && parsedFileTypes.indexOf(fileType) !== -1);
  }

  private async parseFiles(user, payload, oldUser): Promise<File[]> {
    const response = [];
    if (payload.identityFilename) {
      // identityFile
      const {
        url: identityUrl, bucket: identityBucket, filename: identityFilename
      } = await this.fileUploadService.makeFilePermanent(
        user,
        payload.identityFilename,
        `${payload.cpf}/identityFile-${payload.identityFilename}`
      );
      response.push({
        url: identityUrl,
        bucket: identityBucket,
        filename: identityFilename,
        type: "IDENTITY_FILE"
      });
    } else if (await this.getHasFile(oldUser, "IDENTITY_FILE")){
      response.push(await this.getFile(oldUser, "IDENTITY_FILE"))
    }

    if (payload.selfieFilename) {
      // selfieFile
      const {
        url: selfieUrl, bucket: selfieBucket, filename: selfieFilename
      } = await this.fileUploadService.makeFilePermanent(
        user,
        payload.selfieFilename,
        `${payload.cpf}/selfieFile-${payload.selfieFilename}`
      );
      response.push({
        url: selfieUrl,
        bucket: selfieBucket,
        filename: selfieFilename,
        type: "SELFIE_FILE"
      });
    } else if (await this.getHasFile(oldUser, "SELFIE_FILE")){
      response.push(await this.getFile(oldUser, "SELFIE_FILE"))
    }
    return response;
  }

  async getFile(entity, fileType) {
    const filteredFiles = entity.personInfo.files.filter(file => {
      return file.type === fileType
    })
    return filteredFiles ? filteredFiles[0] : undefined
  }

}
