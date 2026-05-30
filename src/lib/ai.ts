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

export const getRecommendedResource = createServerFn({ method: "POST" })
  .inputValidator((data: any) => data as { 
    type: "video" | "course"; 
    milestoneTitle: string; 
    milestoneDesc: string;
    role: string; 
    skills: string[]; 
  })
  .handler(async ({ data }): Promise<{ url: string }> => {
    const systemPrompt = `You are a professional educational resource curator. ` +
      `Your task is to analyze the student's profile and current milestone, and provide a direct, high-quality, completely free URL for learning the topic. ` +
      `For type = 'course': return a direct link to a completely free course on platforms like freeCodeCamp, Coursera (free audit tier), MDN Web Docs, edX, or Khan Academy that matches the milestone. ` +
      `For type = 'video': return a direct YouTube video URL (e.g., https://www.youtube.com/watch?v=...) of an extremely popular, high-view, high-quality tutorial (like those from freeCodeCamp, Programming with Mosh, Traversy Media, Fireship, Net Ninja) that perfectly matches the milestone. ` +
      `Ensure the URL is a real, direct, and well-known working URL. ` +
      `If you are not 100% sure about a specific valid YouTube video ID, generate a search URL sorted by view count, which looks like: 'https://www.youtube.com/results?search_query=[topic]+tutorial&sp=CAM%253D'. This will ensure they see the most popular videos instantly. ` +
      `Return the response as a strict JSON object with a single key 'url'. Do not include any other text, explanation, or markdown block quotes. ` +
      `Example: { "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }`;

    const userMessage = `Student profile:\n` +
      `- Target Role: ${data.role || "Software Engineer"}\n` +
      `- Current Skills: ${data.skills?.join(", ") || "None"}\n` +
      `Milestone:\n` +
      `- Title: ${data.milestoneTitle}\n` +
      `- Description: ${data.milestoneDesc}\n` +
      `Resource Type requested: ${data.type}`;

    try {
      const response = await client.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error("No response from AI");
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed.url === "string" && parsed.url.startsWith("http")) {
        return { url: parsed.url };
      }
      throw new Error("Invalid URL in AI response");
    } catch (error) {
      console.error("Error fetching recommended resource:", error);
      const query = encodeURIComponent(data.milestoneTitle);
      if (data.type === "video") {
        return { url: `https://www.youtube.com/results?search_query=${query}+tutorial&sp=CAM%253D` };
      } else {
        return { url: `https://www.google.com/search?q=free+course+${query}+site:coursera.org+OR+site:freecodecamp.org+OR+site:udemy.com+OR+site:edx.org` };
      }
    }
  });

