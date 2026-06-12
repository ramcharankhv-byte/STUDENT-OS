import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

import { prisma } from "../../config/db.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateTemporaryToken, registerUser } from "./auth.services.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, college, branch, year, bio } = req.body();

  const userExists = await prisma.user.findUnique({ where: { email } });

  if (userExists) {
    throw new ApiError(401, "User already exists");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await registerUser(
    name,
    email,
    hashPassword,
    college,
    year,
    branch,
    bio,
  );

  const { unHashedToken, hashedToken, tokenExpiry } =
    await generateTemporaryToken;

  const emailVerificationToken = await prisma.user.create({
    data: {
      email: email,
      token: hashedToken,
      type: "EMAIL_VERIFY",
      expiresAt: tokenExpiry,
    },
  });
});
