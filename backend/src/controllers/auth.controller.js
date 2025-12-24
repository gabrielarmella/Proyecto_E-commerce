import authService from "../services/auth.service.js";
import AppError from "../utils/appError.js";

const buildFrontendRedirect = (path = "/products") => {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";
  return new URL(path, base).toString();
};

const register = async (req, res) => {
  const { user, accessToken } = await authService.register({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });
  res.status(201).json({
    success: true,
    data: {
      user,
      token: accessToken,
      redirectTo: buildFrontendRedirect(),
    },
  });
};

const login = async (req, res) => {
  const { user, accessToken } = await authService.login({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });
  res.json({
    success: true,
    data: {
      user,
      token: accessToken,
      redirectTo: buildFrontendRedirect(),
    },
  });
};

const googleCallback = async (req, res) => {
  if (!req.user) throw new AppError("Google auth failed", 401, "GOOGLE_AUTH_FAILED");

  const { accessToken } = await authService.createSession({
    user: req.user,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });

  const redirectUrl = new URL(buildFrontendRedirect());
  redirectUrl.searchParams.set("token", accessToken);
  return res.redirect(redirectUrl.toString());
};

const refresh = async (req, res) => {
  const rt = req.cookies?.refreshToken;
  if (!rt) throw new AppError("Refresh token faltante", 401, "INVALID_REFRESH");

  const userId =
    req.body?.userId ||
    (() => {
      try {
        const decoded = verifyAccessToken(req.cookies?.accessToken);
        return decoded.id;
      } catch {
        return null;
      }
    })();

  if (!userId) throw new AppError("No se pudo resolver el usuario", 401, "INVALID_REFRESH");

  const { accessToken, refreshToken, refreshExpiresAt } = await authService.refreshSession({
    userId,
    refreshToken: rt,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });

  setAuthCookies(res, { accessToken, refreshToken, refreshExpiresAt });
  res.json({ success: true, data: { ok: true } });
};

const logout = async (req, res) => {
  const rt = req.cookies?.refreshToken;
  const uid = req.user?.id; 
  if (uid) await authService.logout(uid, rt);
  clearAuthCookies(res);
  res.json({ success: true, data: { ok: true } });
};

const me = async (req, res) => {
  res.json({ success: true, data: req.user });
};

export default {
  register,
  login,
  refresh,
  logout,
  googleCallback,
  me,
};
