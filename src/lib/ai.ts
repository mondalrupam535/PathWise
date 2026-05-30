import { createServerFn } from "@tanstack/react-start";
import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY || import.meta.env.VITE_GROQ_API_KEY || "";
const client = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.groq.com/openai/v1",
});

export type PathwayMilestone = {
  id: number;
  title: string;
  status: "done" | "active" | "locked";
  desc: string;
};

export const getDynamicPathway = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data as { role: string; skills: string[] })
  .handler(async ({ data }): Promise<PathwayMilestone[]> => {
    const question = `Generate a personalized career roadmap for becoming a ${data.role || "Software Engineer"}. ` +
      `The user already has the following skills: ${data.skills?.join(", ") || "None"}. ` +
      `Return the response as a strict JSON array of objects. Do not wrap it in markdown block quotes. ` +
      `Each object must have the following exact keys: ` +
      `'id' (a sequential number starting from 1), ` +
      `'title' (a short title for the milestone), ` +
      `'status' (must be exactly 'done', 'active', or 'locked' based on a logical progression where earlier milestones are done, one is active, and the rest are locked), ` +
      `'desc' (a short 1-sentence description of what to learn/do). ` +
      `Generate exactly 6 milestones.`;

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: question }],
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content received.");
      const parsed = JSON.parse(content);
      
      let milestones: PathwayMilestone[] = [];
      if (Array.isArray(parsed)) milestones = parsed;
      else {
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) { milestones = parsed[key]; break; }
        }
      }
      return milestones;
    } catch (error) {
      console.error(error);
      return [];
    }
  });

export type JobMatch = {
  id: number;
  title: string;
  company: string;
  location: string;
  match: number;
  tags: string[];
  salary: string;
};

export const getDynamicJobs = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data as { role: string; skills: string[] })
  .handler(async ({ data }): Promise<JobMatch[]> => {
    const question = `Generate 5 realistic job postings that match a user seeking a role as a ${data.role || "Developer"}. ` +
      `The user has these skills: ${data.skills?.join(", ") || "None"}. ` +
      `Return the response as a strict JSON array of objects. ` +
      `Each object must have these exact keys: ` +
      `'id' (a sequential number), ` +
      `'title' (the job title), ` +
      `'company' (a realistic fake company name), ` +
      `'location' (e.g. 'Remote', 'New York', 'London'), ` +
      `'match' (a percentage match number between 70 and 99), ` +
      `'tags' (an array of 3 string tags related to the job), ` +
      `'salary' (a realistic salary range string, e.g. '$100k-$130k').`;

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: question }],
        response_format: { type: "json_object" }
      });
      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No content received.");
      const parsed = JSON.parse(content);
      
      let jobs: JobMatch[] = [];
      if (Array.isArray(parsed)) jobs = parsed;
      else {
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) { jobs = parsed[key]; break; }
        }
      }
      return jobs;
    } catch (error) {
      console.error(error);
      return [];
    }
  });

export const chatWithGuide = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data as { profile: any; message: string; history: any[] })
  .handler(async ({ data }): Promise<string> => {
    const systemPrompt = `You are an AI Career Mentor for PathWise AI. ` +
      `You are talking to a user named ${data.profile?.name || "there"}. ` +
      `Their goal is: ${data.profile?.goal || "Unknown"}. ` +
      `Their target role is: ${data.profile?.role || "Unknown"}. ` +
      `Their skills are: ${data.profile?.skillSet?.join(", ") || "Unknown"}. ` +
      `Be encouraging, concise (1-3 short sentences), and give actionable advice.`;

    // The Groq API requires the first non-system message to be from "user".
    // The history may start with the initial AI greeting (role: "ai"), so we
    // strip any leading assistant messages before building the payload.
    const mappedHistory = data.history.map((m: any) => ({
      role: (m.role === "ai" ? "assistant" : "user") as "user" | "assistant",
      content: m.text,
    }));
    let trimmedHistory = mappedHistory;
    while (trimmedHistory.length > 0 && trimmedHistory[0].role === "assistant") {
      trimmedHistory = trimmedHistory.slice(1);
    }

    const msgs = [
      { role: "system" as const, content: systemPrompt },
      ...trimmedHistory,
      { role: "user" as const, content: data.message }
    ];

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: msgs,
      });
      return response.choices[0]?.message?.content || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error(error);
      return "I'm having trouble connecting to my brain right now. Try again soon!";
    }
  });
