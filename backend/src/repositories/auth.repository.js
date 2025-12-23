import bcrypt from "bcryptjs";
import RefreshToken from "../models/refreshToken.model.js";

class AuthRepository {
  createRefreshToken({ userId, token, expiresAt, userAgent, ip }) {
    const tokenHash = bcrypt.hashSync(token, 10);
    return RefreshToken.create({ user: userId, tokenHash, expiresAt, userAgent, ip });
  }

  async findValidRefresh({ userId, token }) {
    const all = await RefreshToken.find({ user: userId, revokedAt: null, expiresAt: { $gt: new Date() } });
    return all.find((rt) => bcrypt.compareSync(token, rt.tokenHash)) || null;
  }

  async revokeRefreshToken(id, replacedByToken = null) {
    return RefreshToken.findByIdAndUpdate(
      id,
      { revokedAt: new Date(), replacedByToken },
      { new: true }
    );
  }

  async revokeAllForUser(userId) {
    return RefreshToken.updateMany(
      { user: userId, revokedAt: null },
      { revokedAt: new Date(), replacedByToken: "logout" }
    );
  }
}

export default new AuthRepository();
