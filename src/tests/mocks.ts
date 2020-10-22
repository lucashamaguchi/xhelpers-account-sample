const baseSignUpData = {
    fullName: "Lucas Hamaguchi Mota",
    documentNumber: "12345678-x",
    cpf: "46902379807",
    birthDate: "1997-05-20",
    motherName: "Arlete Hamaguchi",
    street: "Rua Rocha",
    number: "184",
    neighborhood: "Bela Vista",
    city: "São Paulo",
    state: "SP",
    zipCode: "01330000"
}

export const payloadCompleteSignUp = {
    ...baseSignUpData,
    identityFilename: "abc/identity",
    selfieFilename: "abc/selfie"
}
