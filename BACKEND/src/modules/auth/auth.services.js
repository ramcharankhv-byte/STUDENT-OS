import { asyncHandler } from "../../utils/asynchandler.js";
import { ApiError } from "../../utils/api-error.js";
import { ApiResponse } from "../../utils/api-response.js";

import { prisma } from "../../config/db.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

export const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(20).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiry = Date.now() + 20 * 20 * 1000; // 20 minutes

  return { unHashedToken, hashedToken, tokenExpiry };
};

export const registerUser = async (
  name,
  email,
  hashPassword,
  college,
  year,
  branch,
  bio,
) => {
  const user = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashedPass,
      college: college,
      branch: branch,
      year: year,
      bio: bio,
    },
  });

  return user;
};
