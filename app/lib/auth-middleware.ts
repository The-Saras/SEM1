import { verifyJwt } from "./jwt";



export function requireAuth(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  try {
    return verifyJwt(token);
  } catch {
    return null;
  }
}
