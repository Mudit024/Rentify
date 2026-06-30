import jwt from 'jsonwebtoken';

export const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const cookieOptions = () => {
  const days = Number(process.env.COOKIE_EXPIRES_DAYS) || 7;
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: days * 24 * 60 * 60 * 1000,
  };
};

// Issues the JWT cookie on the response — used by register, login, and Google OAuth callback
export const sendTokenCookie = (res, userId, role) => {
  const token = generateToken(userId, role);
  res.cookie('token', token, cookieOptions());
  return token;
};
