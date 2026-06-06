import { useState } from "react";
import { GEMINI_API_KEY } from "../config";

const GEMINI_MODEL = "gemini-2.5-flash-lite";

export function useStyleGen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [styledCode, setStyledCode] = useState(null); // { jsx, tailwind, css }

  const generate = async ({ baseCode, componentType, dimensions, stylePrompt }) => {
    if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
      setError("Add your Gemini API key to src/config.js — get one free at aistudio.google.com");
      return;
    }

    setLoading(true);
    setError(null);
    setStyledCode(null);

    const prompt = `You are a UI code generator. The user drew a "${componentType}" (${dimensions.w}×${dimensions.h}px) and wants it styled like: "${stylePrompt}".

Base JSX:
${baseCode}

Return ONLY a valid JSON object with exactly these 3 keys. No markdown, no backticks, no explanation:
{
  "jsx": "<full restyled JSX element with Tailwind classes>",
  "tailwind": "<space-separated Tailwind classes only>",
  "css": "<plain CSS properties as a string, e.g. width: 180px;\\nheight: 45px;>"
}

Rules:
- Keep the same HTML tag and structure
- Match the style theme: "${stylePrompt}"
- Use good contrast, realistic colors, proper font weights
- css field: plain CSS key-value pairs separated by newlines, no selectors or braces`;

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1200, temperature: 0.7 },
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message ?? `API error ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";

      // Strip markdown fences if model added them
      const clean = text.replace(/^```[a-z]*\n?/i, "").replace(/```$/i, "").trim();

      let parsed;
      try {
        parsed = JSON.parse(clean);
      } catch {
        // If JSON parse fails, treat entire response as jsx fallback
        parsed = { jsx: clean, tailwind: "/* Could not parse */", css: "/* Could not parse */" };
      }

      setStyledCode({
        jsx: parsed.jsx ?? "",
        tailwind: parsed.tailwind ?? "",
        css: parsed.css ?? "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStyledCode(null);
    setError(null);
  };

  return { generate, loading, error, styledCode, reset };
}
