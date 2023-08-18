import { Injectable } from "@nestjs/common";
import { PrismaClient, User, UserRole } from "@prisma/client";
import { createHmac } from "crypto";
import { hmac } from "src/utils/crypto";

export type UpdateUserFields = Partial<Pick<User, "name" | "email">>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaClient) {}

  findUser(email: string) {
    return this.prisma.user.findFirst({
      where: { email: email },
      include: { profile: true },
    });
  }

  async createUser(email: string, name: string, password: string) {
    const passwordHmac = await hmac(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        verified: false,
        profile: { create: { password: passwordHmac, role: UserRole.Normal } },
      },
    });

    return user.id;
  }

  async getUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw Error("NotFound");
    return user;
  }

  async updateUserInfo(id: number, partialIssue: UpdateUserFields) {
    return this.prisma.user.update({ where: { id }, data: partialIssue });
  }
}
