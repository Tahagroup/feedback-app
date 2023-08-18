import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "src/types";
import { JWTPayload } from "./auth.service";

export function extractFromCookie(req: Request): string | null {
  if (!req || !req.cookies) return null;
  // console.log("token", req.cookies["access_token"]);
  return req.cookies["access_token"];
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractFromCookie,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_Secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JWTPayload) {
    req.userId = payload.sub;
    return payload;
  }
}
