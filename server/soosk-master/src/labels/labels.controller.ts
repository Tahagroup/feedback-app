import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LabelsService } from "./labels.service";

interface AddLabelRequest {
  name: string;
  color: number;
}

@Controller("labels")
export class LabelsController {
  constructor(private labelsService: LabelsService) {}

  @Get()
  getLabels() {
    return this.labelsService.getLabels();
  }

  @Post()
  @UseGuards(AuthGuard("jwt"))
  addLabel(@Body() reqBody: AddLabelRequest) {
    return this.labelsService
      .addLabels(reqBody.name, reqBody.color)
      .then((label) => ({
        id: label.id,
      }));
  }

  @Delete(":labelId")
  @UseGuards(AuthGuard("jwt"))
  deleteLabel(@Param("labelId") labelId: string) {
    return this.labelsService.deleteLabel(Number(labelId));
  }
}
