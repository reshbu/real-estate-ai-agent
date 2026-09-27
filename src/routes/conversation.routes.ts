import { Router, Request, Response } from "express";

import {
  generateConversationResponse
} from "../agent/conversation.service";

import { 
  getLead
} from "../agent/lead.store";
const router = Router();

router.post("/", async (req: Request, res: Response) => {

  try {

    const {
      conversationId,
      customerMessage
    } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        error: "conversationId is required"
      });
    }

    if (!customerMessage) {
      return res.status(400).json({
        error: "customerMessage is required"
      });
    }

    const aiResponse =
      await generateConversationResponse(
        conversationId,
        customerMessage
      );

    return res.json({
      conversationId,
      customerMessage,
      aiResponse
    });

  } catch (error) {

    console.error("AI conversation error:", error);

    return res.status(500).json({
      error: "Failed to generate AI response"
    });
  }
});
router.get("/:conversationId/lead", (req:  Request<{ conversationId: string }>, res: Response) => {

  const {
    conversationId
  } = req.params;

  const lead = getLead(conversationId);

  return res.json({
    conversationId,
    lead
  });
});

export default router;