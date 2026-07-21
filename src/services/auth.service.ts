import { AppError } from "../errors/AppError";
import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { JwtLib } from "../lib/jwt";

/**
 * Registers a new user
 * @param email - The email of the user to register
 * @param password - The password of the user to register
 * @returns void
 */
const registerUser = async (
  email: string,
  password: string,
): Promise<void> => {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  if (password.length < 6) {
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  const normalizedEmail = email.toLowerCase().trim();

  // find the user if its already present in db or not
  // if yes then we will not allow to register with same email again
  const existingUser = await UserRepository.findUserByEmail(normalizedEmail);
  if (existingUser) {
    throw new AppError(409, "Email already present");
  }

  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  await UserRepository.createUser(normalizedEmail, hashedPassword);
};

/**
 * Logs in a user
 * @param email - The email of the user to login
 * @param password - The password of the user to login
 * @returns The access token
 */
const loginUser = async (
  email: string,
  password: string,
): Promise<{ accessToken: string }> => {
  if (!email || !password) {
    throw new AppError(400, "Email and password are required");
  }

  const normalizeEmail = email.toLowerCase().trim();
  const user = await UserRepository.findUserByEmailWithPassword(normalizeEmail);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new AppError(401, "Invalid email or password");
  }

  const accessToken = JwtLib.signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return { accessToken };
};

export const AuthService = {
  registerUser,
  loginUser,
};
