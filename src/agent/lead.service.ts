import OpenAI from "openai";
import dotenv from "dotenv";

import { Message } from "./conversation.store";
import { updateLead } from "./lead.store";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

type ExtractedLeadData = {
  customerName?: string;
  propertyType?: string;
  location?: string;
  budget?: number;
  purchaseTimeline?: string;
  siteVisit?: string;
};

export async function extractLeadInformation(
  conversationId: string,
  conversation: Message[]
): Promise<void> {

  const response = await openai.responses.create({

    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",

    instructions: `
You extract real-estate lead information from the conversation.

Extract only information that the customer explicitly provides.

Possible fields:

- customerName
- propertyType
- location
- budget
- purchaseTimeline
- siteVisit

Rules:

- Do not guess information.
- Do not invent information.
- If information is not present, do not include that field.
- Return only valid JSON.
`,

    input: conversation.map(message => ({
      role: message.role,
      content: message.content
    }))
  });

  const extractedData: ExtractedLeadData =
    JSON.parse(response.output_text);

  updateLead(
    conversationId,
    extractedData
  );
}