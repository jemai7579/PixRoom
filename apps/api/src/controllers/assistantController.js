import OpenAI from "openai";
import { env } from "../config/env.js";
import { getPlanFeatures } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

export const askAssistant = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message?.trim()) {
    throw new AppError("Please enter a message.");
  }

  const features = getPlanFeatures(req.user);

  if (!features.canUseAssistant) {
    throw new AppError("The AI assistant is available on premium and photographer plans.", 403);
  }

  if (!client) {
    res.json({
      reply:
        "The AI assistant is enabled for your plan, but the OpenAI API key is not configured yet. Add OPENAI_API_KEY on the server to activate live answers.",
    });
    return;
  }

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are the PixRoom+ assistant. Answer clearly and briefly about using PixRoom+, rooms, uploads, invitations, pricing, and account features.",
      },
      {
        role: "user",
        content: message.trim(),
      },
    ],
  });

  res.json({
    reply: completion.choices[0]?.message?.content || "I could not generate a reply right now.",
  });
});
