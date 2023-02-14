import jwt from "jsonwebtoken";
import { KEY } from "../../config.js";

let _tokens = [];

const addToken = (user, token) => {
  _tokens.push({ user, token });
};

const deleteToken = (u) => {
  try {
    _tokens = _tokens.filter((par) => {
      const { user } = par;
      return user.id !== u.id;
    });
  } catch (error) {}
};

export const createToken = (user) => {
  const token = jwt.sign({ id: user.id }, KEY, {
    algorithm: "HS256",
  });

  deleteToken(user);
  addToken(user, token);
  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, KEY);
};

export const getAllTokens = () => {
  return _tokens;
};

export const getToken = (user) => {
  return _tokens.find((token) => token.id === user.id);
};
