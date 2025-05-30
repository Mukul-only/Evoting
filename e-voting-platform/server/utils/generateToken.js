import jwt from "jsonwebtoken";
import config from "../config/index.js";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.JWT_SECRET, {
    expiresIn: "30d", // Adjust as needed
  });
};

export default generateToken;
