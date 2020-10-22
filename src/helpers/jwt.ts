import jwt from 'jsonwebtoken';

const options = {expiresIn: '30 minutes'};
const privateKey = process.env.JWT_PRIVATE_KEY ?? '';

const verify = (token: string) => {
  return jwt.verify(token, privateKey);
};

const Auth = {
  generate: (payload: string | object) => {
    return jwt.sign(payload, privateKey, options);
  },
  mapContext: ({req}: any) => {
    let user: any;
    const token = req.headers.authorization;

    if (typeof token === 'string') {
      try {
        const decoded = verify(token.slice(7, token.length));
        user = decoded;
      } catch (e) {}
    }

    return {user};
  },
  authChecker: ({context}: any) => {
    const user = context.user;

    if (!user) return false;
    return true;
  },
};

export default Auth;
