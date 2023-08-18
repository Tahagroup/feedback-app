import { Request } from "src/types";

export function getUserId(req: Request) {
  return Number(req.userId);
}
