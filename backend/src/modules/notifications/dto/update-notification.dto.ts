import { PartialType } from "@nestjs/swagger";
import { CreateNotificationDto } from "./create-notification.dto";
import { IsOptional, IsBoolean, IsNumber } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiPropertyOptional({
    description: "Whether the notification has been read",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;

  @ApiPropertyOptional({ description: "Timestamp when notification was read" })
  @IsOptional()
  @IsNumber()
  read_at?: number;
}

