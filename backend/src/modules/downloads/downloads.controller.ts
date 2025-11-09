import { Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { Response } from "express";
import * as path from "path";
import * as fs from "fs";
import { Public } from "../../../libs/decorators/src";

@ApiTags("downloads")
@Controller("downloads")
export class DownloadsController {
  /**
   * Download agent script for specified platform
   * GET /api/downloads/agent/:platform
   */
  @Public()
  @Get("agent/:platform")
  @ApiOperation({
    summary: "Download SecureVault Agent",
    description: "Download platform-specific agent installation script",
  })
  async downloadAgent(
    @Param("platform") platform: string,
    @Res() res: Response
  ) {
    try {
      // Map platform to file
      const fileMap: Record<string, string> = {
        linux: "securevault-agent.py",
        macos: "securevault-agent.py",
        windows: "securevault-agent.py",
        docker: "securevault-agent.py",
      };

      const filename = fileMap[platform] || fileMap.linux;
      const filePath = path.join(process.cwd(), "public", "agents", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Agent file not found",
        });
      }

      // Read file
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Set headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Send file
      return res.send(fileContent);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to download agent",
        error: error.message,
      });
    }
  }

  /**
   * Download installer script
   * GET /api/downloads/installer/:platform
   */
  @Public()
  @Get("installer/:platform")
  @ApiOperation({
    summary: "Download Installer Script",
    description: "Download platform-specific installer script",
  })
  async downloadInstaller(
    @Param("platform") platform: string,
    @Res() res: Response
  ) {
    try {
      // Map platform to file
      const fileMap: Record<string, string> = {
        linux: "install.sh",
        macos: "install.sh",
        windows: "install.ps1", // Future: PowerShell installer
      };

      const filename = fileMap[platform] || fileMap.linux;
      const filePath = path.join(process.cwd(), "public", "agents", filename);

      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: "Installer file not found",
        });
      }

      // Read file
      const fileContent = fs.readFileSync(filePath, "utf-8");

      // Set headers
      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );

      // Send file
      return res.send(fileContent);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Failed to download installer",
        error: error.message,
      });
    }
  }
}
