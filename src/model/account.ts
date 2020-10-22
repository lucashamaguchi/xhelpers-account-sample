import * as mongoose from "mongoose";

export interface File {
  bucket: string,
  type: string,
  filename: string,
}

export interface IPersonInfo extends mongoose.Document {
  fullName: string;
  cpf: string;
  documentNumber: string;
  birthDate: Date;
  motherName: string;

  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;

  files: File[]

  // auto
  active: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
}

export enum UserType {
  Default = 0,
  Google = 1,
  Facebook = 2,
  Github = 3,
}

export interface IAccount extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  active: boolean;
  userType: UserType;
  emailConfirmed: boolean;
  termsOfUseConfirmed: boolean;
  personInfo: IPersonInfo;
  completedSignUp: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: any;
}

const personInfoSchema = new mongoose.Schema({
  fullName: { type: String },
  cpf: { type: String },
  documentNumber: { type: String },
  birthDate: { type: Date },
  motherName: { type: String },

  street: { type: String },
  number: { type: String },
  complement: { type: String, required: false },
  neighborhood: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },

  files: [{ type: Object }],

  // auto
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const schema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  phone: { type: String },
  userType: {
    type: String,
    enum: [UserType.Default, UserType.Google, UserType.Facebook],
    default: UserType.Default,
  },
  active: { type: Boolean, default: true },
  emailConfirmed: { type: Boolean, default: false },
  termsOfUseConfirmed: { type: Boolean, default: false },
  personInfo: personInfoSchema,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  metadata: { type: Object },
});

schema.set("toJSON", { virtuals: true });

export default mongoose.models.Account || mongoose.model<IAccount>("Account", schema, "account");
