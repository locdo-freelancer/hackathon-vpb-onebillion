import { SiteConfigData } from "@/types/onboarding.types";

export const validateStep = (step: number, data: SiteConfigData): string | null => {
  if (step === 1) {
    if (!data.siteName || !data.ipAddress || !data.port) return "Please fill in all required fields";

    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipPattern.test(data.ipAddress)) return "Please enter a valid IP address";

    const port = parseInt(data.port);
    if (isNaN(port) || port < 1 || port > 65535) return "Please enter a valid port number (1–65535)";
  }

  if (step === 2 && !data.serverType) return "Please select a server type";

  if (step === 4) {
    if (
      data.networkConnectivity !== "success" ||
      data.agentAuthentication !== "success" ||
      data.initialDataSync !== "success"
    ) {
      return "Please wait for all validation checks to complete";
    }
  }

  return null;
};
