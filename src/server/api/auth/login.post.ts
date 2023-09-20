import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const token = jwt.sign({ username: "foo" }, "secret", {
    expiresIn: "10s",
  });
  return {
    token,
  };
});
