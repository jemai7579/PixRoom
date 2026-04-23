import OpenAI from "openai";
import { pixroomKnowledge } from "../ai/pixroomKnowledge.js";
import { env } from "../config/env.js";
import { getPlanFeatures } from "../services/subscriptionService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/appError.js";

const client = env.openAiApiKey ? new OpenAI({ apiKey: env.openAiApiKey }) : null;

function normalizeContextValue(value, fallback = "Not provided") {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed || fallback;
}

export const askAssistant = asyncHandler(async (req, res) => {
  const { currentPage, message, userPlan, userRole } = req.body;

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

  const resolvedRole = req.user?.role || normalizeContextValue(userRole);
  const resolvedPlan = req.user?.subscriptionPlan || normalizeContextValue(userPlan);
  const resolvedStatus = req.user?.subscriptionStatus || "Not provided";
  const resolvedPage = normalizeContextValue(currentPage);

  const systemPrompt = `
You are the PixRoom+ AI Assistant.
Your job is to help users understand and use PixRoom+.
Use only the provided PixRoom+ knowledge.
Do not invent features.
Answer simply and clearly.
If the user asks about the current page, use the currentPage value.
If a feature does not exist in the knowledge, say it is not available yet in PixRoom+.
Politely redirect unrelated questions back to PixRoom+.
Do not discuss technical backend details unless the user explicitly asks for technical details.
`;

  const context = `
Current page: ${resolvedPage}
User role: ${resolvedRole}
User plan: ${resolvedPlan}
Subscription status: ${resolvedStatus}

PixRoom+ knowledge:
${pixroomKnowledge}
`;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "system",
        content: context,
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
