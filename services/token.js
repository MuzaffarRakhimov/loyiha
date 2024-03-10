import jwt from "jsonwebtoken";

const generateJwtToken = userId => {
  const acsesToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" })
  return acsesToken;

}

export { generateJwtToken };