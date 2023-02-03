import jwt from "jsonwebtoken";
import { KEY } from "../../config.js";

let _tokens = [];

const addToken = (user, token) => {
  _tokens.push({ user, token });
};

const deleteToken = (user) => {
  _tokens = _tokens.filter((json) => {
    json.user !== user;
  });
};

export const createToken = (user) => {
  const token = jwt.sign({ id: user.id }, KEY, {
    algorithm: "HS256",
  });
  deleteToken(user);
  addToken(user, token);
  return { user, token };
};

export const validateToken = (token) => {
  return jwt.verify(token, KEY.secret);
};

export const getAllTokens = () => {
  return _tokens;
};

export const getToken = (user) => {
  return _tokens.find((token) => token.id === user.id);
};
