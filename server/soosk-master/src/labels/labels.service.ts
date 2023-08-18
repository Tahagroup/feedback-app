import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class LabelsService {
  constructor(private prisma: PrismaClient) {}

  getLabels() {
    return this.prisma.label.findMany();
  }

  async addLabels(name: string, color: number) {
    const label = await this.prisma.label.findFirst({ where: { name } });

    if (label) throw new Error("Label is already defined");

    return this.prisma.label.create({ data: { name, color } });
  }

  async deleteLabel(id: number) {
    const label = await this.prisma.label.findUnique({ where: { id } });

    if (!label) throw new Error("Label not found.");

    return this.prisma.label.delete({ where: { id } });
  }
}
