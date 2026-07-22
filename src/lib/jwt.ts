import { TokenPayload } from "../types/user";
import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

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

const verifyAccessToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, env.jwtSecret) as TokenPayload;
  } catch (error) {
    throw new AppError(401, "Invalid or expired access token");
  }
};

export const JwtLib = {
  signAccessToken,
  verifyAccessToken,
};