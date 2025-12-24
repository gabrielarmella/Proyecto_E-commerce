import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES || "15m";
const REFRESH_EXPIRES_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

export const signAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

export const signRefreshToken = () => {
  const token = crypto.randomBytes(64).toString("hex"); 
  const expiresAt = new Date(Date.now() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);
  return { token, expiresAt };
};

export const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const cookieOptions = {
  httpOnly: true,
  secure: false, 
  sameSite: "strict",
  path: "/",
};

export const setAuthCookies = (res, { accessToken, refreshToken, refreshExpiresAt }) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15m
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: refreshExpiresAt.getTime() - Date.now(),
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);
};