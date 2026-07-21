import { Router } from "express";
import { AuthService } from "../services/auth.service";
export const authRouter = Router();

/**
 * Registers a new user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns void
 */
authRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await AuthService.registerUser(email, password);

    res.status(201).json({
      succes: true,
      message: "Registration successfull. Please login to continue",
    });
  } catch (error) {
    next(error);
  }
});

/**
 * Logs in a user
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns void
 */
authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { accessToken } = await AuthService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: { accessToken },
    });
  } catch (error) {
    next(error);
  }
});