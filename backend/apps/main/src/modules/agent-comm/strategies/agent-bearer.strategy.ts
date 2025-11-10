import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-http-bearer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Site } from "../../../../../../libs/entities";

@Injectable()
export class AgentBearerStrategy extends PassportStrategy(
  Strategy,
  "agent-bearer"
) {
  constructor(
    @InjectRepository(Site)
    private siteRepository: Repository<Site>
  ) {
    super();
  }

  async validate(token: string) {
    const site = await this.siteRepository.findOne({
      where: { entity_token: token },
      relations: ["agent"],
    });

    if (!site) {
      throw new UnauthorizedException("Invalid agent token");
    }

    return site;
  }
}
