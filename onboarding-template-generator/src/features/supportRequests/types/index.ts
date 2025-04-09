// Defines the structure for a support request object
export interface SupportRequest {
  id: string; // e.g., TICKET-001 (Consider if this comes from blob name or metadata)
  subject: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Pending Input' | 'Resolved'; // Example statuses
  priority: 'Low' | 'Medium' | 'High' | 'Critical'; // Example priorities
  createdDate: string; // ISO 8601 format string
  lastUpdated: string; // ISO 8601 format string
  // Add other relevant fields as needed
  // assignedTo?: string;
  // customerName?: string;
  // relatedTicketIds?: string[];
}

// You might add other related types here, e.g., for API responses or component props
