import { DataSource } from "typeorm";
import { config } from "dotenv";
import {
  User,
  Site,
  AgentEntity,
  Vulnerability,
  SiteVulnerability,
  Threat,
  RemediationAction,
  SecurityMetric,
  Notification,
  Incident,
  ThreatIndicator,
} from "@lib/entities";

config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432", 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    User,
    Site,
    AgentEntity,
    Vulnerability,
    SiteVulnerability,
    Threat,
    RemediationAction,
    SecurityMetric,
    Notification,
    Incident,
    ThreatIndicator,
  ],
  migrations: ["../migrations/*.{ts,js}"],
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  ssl: {
    rejectUnauthorized: false,
  },
});
