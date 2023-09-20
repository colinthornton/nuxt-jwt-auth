import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const auth = getHeader(event, "Authorization");
  if (!auth) {
    throw createError({ status: 401 });
  }
  const token = auth.replace(/^Bearer\s+/, "");
  try {
    jwt.verify(token, "secret");
    return {
      message: "SECRET DATA",
    };
  } catch (error) {
    throw createError({ status: 401 });
  }
});
