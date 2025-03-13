// data/supportTiers.ts
export interface SupportTier {
    name: string;
    color: string;
    description: string;
    criticalSituation: boolean;
    supportHours: string;
    supportRequestSubmission: string;
    tenants: number;
    authorizedContacts: number;
    supportRequestsIncluded: string | number;
    products: string[];
    severityLevels: string;
  }
  
  export const supportTiers: Record<string, SupportTier> = {
    bronze: {
      name: "Bronze Support",
      color: "#cd7f32",
      description: "Basic support availability for non-urgent cases for cloud products. No Critical Situation coverage.",
      criticalSituation: false,
      supportHours: "8 x 5",
      supportRequestSubmission: "Email",
      tenants: 1,
      authorizedContacts: 2,
      supportRequestsIncluded: "Pay As You Go",
      products: ["Microsoft Azure", "Microsoft 365"],
      severityLevels: "Level B or C"
    },
    silver: {
      // Silver tier details based on the image
    },
    gold: {
      // Gold tier details based on the image
    },
    platinum: {
      // Platinum tier details based on the image
    }
  };