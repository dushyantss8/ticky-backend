import { TokenPayload } from "../types/user";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

/**
 * Signs an access token
 * @param payload - The payload to sign
 * @returns The signed access token
 */
const signAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpirationTime as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, env.jwtSecret, options);
};

export const JwtLib = {
  signAccessToken,
};