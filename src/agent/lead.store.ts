export type LeadState = {
  customerName: string | null;
  propertyType: string | null;
  location: string | null;
  budget: number | null;
  purchaseTimeline: string | null;
  siteVisit: string | null;
  interest: "high" | "medium" | "low" | null;
};

const leads = new Map<string, LeadState>();

export function getLead(
  conversationId: string
): LeadState {

  if (!leads.has(conversationId)) {

    leads.set(conversationId, {
      customerName: null,
      propertyType: null,
      location: null,
      budget: null,
      purchaseTimeline: null,
      siteVisit: null,
      interest: null
    });

  }

  return leads.get(conversationId)!;
}

export function updateLead(
  conversationId: string,
  updates: Partial<LeadState>
): void {

  const lead = getLead(conversationId);

  Object.assign(lead, updates);
}