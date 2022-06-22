import jwt from 'jsonwebtoken';

class TokenService {
  generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });
  }

  parseToken(req) {
    const bearerHeader = req.headers.authorization?.startsWith('Bearer');
    const token = req.headers.authorization?.split(' ')[1];

    if (!bearerHeader || !token) {
      throw new Error('No token');
    }

    return jwt.verify(token, process.env.JWT_SECRET);
  }
}

export default new TokenService();
