import { ThreatDetail } from "@/types/threats.types";
import { fetchThreatsData } from "./mock-threat";

// Mock threat detail fetcher
export const fetchThreatDetail = async (id: string): Promise<ThreatDetail> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Find the indicator
  const data = await fetchThreatsData();
  const indicator = data.indicators.find((i) => i.id === id);

  if (!indicator) {
    throw new Error("Threat not found");
  }

  return {
    ...indicator,
    enrichment: {
      isp: "Unknown Hosting Provider",
      asn: "AS12345",
      organization: "Malicious Infrastructure Inc.",
      tags: ["malware", "c2", "botnet"],
      malwareFamily: "Emotet",
    },
    intelligence: [
      {
        category: "Malware Distribution",
        description: "Active C&C server for banking trojan",
        icon: "fas fa-shield-virus",
        iconColor: "text-red-400",
      },
      {
        category: "Botnet Activity",
        description: "Part of Emotet botnet infrastructure",
        icon: "fas fa-network-wired",
        iconColor: "text-orange-400",
      },
      {
        category: "Data Exfiltration",
        description: "Used for stealing credentials",
        icon: "fas fa-database",
        iconColor: "text-yellow-400",
      },
    ],
    relatedIndicators: [
      { id: "rel-1", indicator: "185.220.102.9", type: "ip" },
      { id: "rel-2", indicator: "malware-c2.net", type: "domain" },
      { id: "rel-3", indicator: "a1b2c3d4...", type: "hash" },
    ],
  };
};