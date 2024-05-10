import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { User } from "../model/index.js";
import { HttpErrors } from "../helpers/HttpErrors.js";

const { SECRET_KEY } = process.env;

export const signup = async (
  parent,
  { name, email, password, confirmPassword }
) => {
  if (password !== confirmPassword) {
    throw HttpErrors(400, "Passwords must match");
  }

  const user = await User.findOne({ email });

  if (user) {
    throw HttpErrors(409, "Email already has been register");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ email, name, password: hashPassword });

  const payload = {
    id: newUser._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  await User.findByIdAndUpdate(newUser._id, { token });

  return { name, email, token };
};

export const signin = async (parent, { email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpErrors(401, "Email or password invalid ");
  }

  const comparePassword = await bcrypt.compare(password, user.password);
  if (!comparePassword) {
    throw HttpErrors(401, "Email or password invalid ");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, SECRET_KEY);

  await User.findByIdAndUpdate(user._id, { token });

  return { name: user.name, email: user.email, token };
};

export const logout = async (_, args, { user }) => {
  if (!user) {
    throw new Error("Unauthorized!");
  }

  await User.findByIdAndUpdate(user._id, { token: "" });

  return user;
};

export const getCurrentUser = async (_, args, { user }) => {
  if (!user) {
    throw new Error("Unauthorized!");
  }

  const currentUser = await User.findById(user._id);

  return currentUser;
};
