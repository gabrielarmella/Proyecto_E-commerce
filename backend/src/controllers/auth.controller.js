import authService from "../services/auth.service.js";
import AppError from "../utils/appError.js";
/*import { setAuthCookies, clearAuthCookies, verifyAccessToken } from "../utils/jwt.js";*/

const register = async (req, res) => {
  const user = await authService.register(req.body);
  res.status(201).json({ success: true, data: user });
};

const login = async (req, res) => {
  const { user, accessToken } = await authService.login({
    email: req.body.email,
    password: req.body.password,
    userAgent: req.get("user-agent"),
    ip: req.ip,
  });
  // Devolvemos token en el body para que el front lo guarde en localStorage
  res.json({ success: true, data: { user, token: accessToken } });
};

const refresh = async (req, res) => {
  const rt = req.cookies?.refreshToken;
  if (!rt) throw new AppError("Refresh token faltante", 401, "INVALID_REFRESH");

  // Extraer userId del access si existe (aunque expirado) o del body
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
  const uid = req.user?.id; // viene del middleware de auth
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
 /* refresh,
  logout,*/
  me,
};
