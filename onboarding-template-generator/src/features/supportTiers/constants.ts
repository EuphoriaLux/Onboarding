// src/features/supportTiers/constants.ts
import { SupportTier } from './types';

/**
 * Support tier definitions
 */
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
    name: "Silver Support",
    color: "#C0C0C0",
    description: "Full product coverage with Critical Situation Support. Ideal for those with occasional support requests who need Crit Sit coverage.",
    criticalSituation: true,
    supportHours: "24 x 7 x 365",
    supportRequestSubmission: "Dedicated phone number or Email",
    tenants: 2,
    authorizedContacts: 6,
    supportRequestsIncluded: 12,
    products: ["Microsoft Azure", "Microsoft 365", "Microsoft Dynamics 365", "Microsoft Software on-premises"],
    severityLevels: "Level A, B or C"
  },
  gold: {
    name: "Gold Support",
    color: "#FFD700",
    description: "Three times the included cases and tenants. Double the customer contacts. Suited for complex organizational structures.",
    criticalSituation: true,
    supportHours: "24 x 7 x 365",
    supportRequestSubmission: "Dedicated phone number or Email",
    tenants: 6,
    authorizedContacts: 12,
    supportRequestsIncluded: 36,
    products: ["Microsoft Azure", "Microsoft 365", "Microsoft Dynamics 365", "Microsoft Software on-premises"],
    severityLevels: "Level A, B or C"
  },
  platinum: {
    name: "Platinum Support",
    color: "#E5E4E2",
    description: "Ideal for very complex organizational structures with highest number of tenants, contacts and support requests.",
    criticalSituation: true,
    supportHours: "24 x 7 x 365",
    supportRequestSubmission: "Dedicated phone number or Email",
    tenants: 100,
    authorizedContacts: 100,
    supportRequestsIncluded: 100,
    products: ["Microsoft Azure", "Microsoft 365", "Microsoft Dynamics 365", "Microsoft Software on-premises"],
    severityLevels: "Level A, B or C"
  }
};