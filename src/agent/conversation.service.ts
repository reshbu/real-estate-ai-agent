import OpenAI from "openai";
import dotenv from "dotenv";

import {
  getConversation,
  addMessage
} from "./conversation.store";

import {
  extractLeadInformation
} from "./lead.service";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateConversationResponse(
  conversationId: string,
  customerMessage: string
): Promise<string> {

  // Get conversation history
  const conversation =
    getConversation(conversationId);

  // Save customer's message
  addMessage(conversationId, {
    role: "user",
    content: customerMessage
  });

  // Extract lead information
  await extractLeadInformation(
    conversationId,
    conversation
  );

  // Generate AI conversational response
  const response = await openai.responses.create({

    model: process.env.OPENAI_MODEL || "gpt-5.6-luna",

    instructions: `
You are an AI sales assistant for a real-estate company.

Your job is to have a natural conversation with potential property buyers.

Rules:

- Be polite and conversational.
- Keep responses short.
- Understand what the customer wants.
- Ask only relevant questions.
- Don't ask for information the customer has already provided.
- Never invent property information.
- If the customer is not interested, politely end the conversation.

The goal is to understand:

1. Property type
2. Preferred location
3. Budget
4. Purchase timeline
5. Whether the customer wants a site visit

Do not ask all questions at once.

Ask the most relevant next question based on the conversation.
`,

    input: conversation.map(message => ({
      role: message.role,
      content: message.content
    }))
  });

  const aiResponse = response.output_text;

  // Save AI response
  addMessage(conversationId, {
    role: "assistant",
    content: aiResponse
  });

  return aiResponse;
}