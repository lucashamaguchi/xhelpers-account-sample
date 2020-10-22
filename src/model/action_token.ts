import * as mongoose from "mongoose";

export interface IActionToken extends mongoose.Document {
  email: string;
  token: string;
  createdAt: Date;
}

const schema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
schema.index({ createdAt: 1 }, { expires: "2h" });
schema.set("toJSON", { virtuals: true });

export default mongoose.model<IActionToken>(
  "ActionToken",
  schema,
  "action_token"
);
