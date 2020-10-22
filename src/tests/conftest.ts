import Account, { IAccount } from "../model/account";

export const createUser = async () => {
    const entity = await Account.create({
        name: "Lucas",
        email: "lucas@teste.com"
    } as IAccount)
    return entity
}
