import { createOpenAI } from "@ai-sdk/openai";

// -- openRouter Model Client Setup ---
const MODEL=process.env.OPENROUTER_MODEL || "openrouter/free";

const MAX_CONCURRENCY=parseInt(process.env.AI_MAX_CONCURRENCY  || "6",10)

//Configure OpenRouter provider using @ai-sdk/openai
const openrouter=createOpenAI({
    baseURL:"https://openrouter.ai/api/v1",
    apiKey:process.env.OPENROUTER_API_KEY
})

const model=openrouter(MODEL);



