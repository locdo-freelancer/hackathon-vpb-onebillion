import { PartialType } from "@nestjs/swagger";
import { CreateThreatIndicatorDto } from "./create-threat-indicator.dto";

export class UpdateThreatIndicatorDto extends PartialType(
  CreateThreatIndicatorDto
) {}

