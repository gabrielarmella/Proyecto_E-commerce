import bcrypt from "bcryptjs";
import userRepository from "../repositories/user.repository.js";
import authRepository from "../repositories/auth.repository.js";
import AppError from "../utils/appError.js";
import { signAccessToken, signRefreshToken} from "../utils/jwt.js";

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Faltan campos obligatorios", 400, "VALIDATION_ERROR");
  }

  const exists = await userRepository.findOne({ email });
  if (exists) throw new AppError("El email ya está registrado", 409, "EMAIL_EXISTS");

  const passwordHash = await bcrypt.hash(password, 10);
  try{
      const user = await userRepository.create({ name, email, passwordHash, role: "user" });
      return publicUser(user);
  }catch(err){
    if(err?.code === 11000){
        throw new AppError("El email ya esta registrado", 409, "EMAIL_EXISTS");
    }
    throw err;
  }
};

const login = async ({ email, password, userAgent, ip }) => {
  const user = await userRepository.findOne({ email });
  if (!user || !user.passwordHash) {
    throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new AppError("Credenciales inválidas", 401, "INVALID_CREDENTIALS");

  const accessToken = signAccessToken({ id: user._id, role: user.role });
  const { token: refreshToken, expiresAt } = signRefreshToken();
  await authRepository.createRefreshToken({
    userId: user._id,
    token: refreshToken,
    expiresAt,
    userAgent,
    ip,
  });

  return {
    user: publicUser(user),
    accessToken,
    refreshToken,
    refreshExpiresAt: expiresAt,
  };
};

const refreshSession = async ({ userId, refreshToken, userAgent, ip }) => {
  const saved = await authRepository.findValidRefresh({ userId, token: refreshToken });
  if (!saved) throw new AppError("Refresh token inválido o expirado", 401, "INVALID_REFRESH");

  // Revoque el anterior
  await authRepository.revokeRefreshToken(saved._id, "rotated");

  const accessToken = signAccessToken({ id: userId, role: "user" });
  const { token: newRefresh, expiresAt } = signRefreshToken();
  await authRepository.createRefreshToken({
    userId,
    token: newRefresh,
    expiresAt,
    userAgent,
    ip,
  });

  return { accessToken, refreshToken: newRefresh, refreshExpiresAt: expiresAt };
};

const logout = async (userId, refreshToken) => {
  if (refreshToken) {
    const saved = await authRepository.findValidRefresh({ userId, token: refreshToken });
    if (saved) await authRepository.revokeRefreshToken(saved._id, "logout");
  }
  await authRepository.revokeAllForUser(userId);
  return true;
};

export default {
  register,
  login,
  refreshSession,
  logout,
};
