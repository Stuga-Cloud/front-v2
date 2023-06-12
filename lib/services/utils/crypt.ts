import crypto from "crypto";


export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
        process.env.CRYPTO_ALGO! as crypto.CipherCCMTypes,
        process.env.CRYPTO_SECRET!,
        iv,
    );

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export const decrypt = (content: string): string => {
    const hashParts = content.split(":");
    console.log(hashParts)
    const decipher = crypto.createDecipheriv(
        process.env.CRYPTO_ALGO! as crypto.CipherCCMTypes,
        process.env.CRYPTO_SECRET!,
        Buffer.from(hashParts[0], "hex"),
    );

    const decrpyted = Buffer.concat([
        decipher.update(Buffer.from(hashParts[1], "hex")),
        decipher.final(),
    ]);

    return decrpyted.toString();
}
