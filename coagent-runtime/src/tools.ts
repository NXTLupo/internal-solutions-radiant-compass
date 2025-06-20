import { TavilySearchResults } from "tavily";
import { ChatOpenAI } from "@langchain/openai";

// Initialize Tavily client
const tavilyClient = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
});

// Initialize OpenAI client
const llm = new ChatOpenAI({
  modelName: "gpt-4",
  temperature: 0,
  openAIApiKey: process.env.OPENAI_API_KEY,
});

export async function searchWeb(query: string): Promise<string> {
  try {
    console.log(`= Searching for: ${query}`);
    
    const results = await tavilyClient.invoke({
      query,
      maxResults: 5,
    });
    
    if (!results || results.length === 0) {
      return "No search results found for the given query.";
    }
    
    const formattedResults = results
      .map((result: any, index: number) => 
        `${index + 1}. **${result.title}**\n   ${result.content}\n   Source: ${result.url}\n`
      )
      .join('\n');
    
    console.log(` Found ${results.length} search results`);
    return formattedResults;
    
  } catch (error) {
    console.error('Search error:', error);
    return `Search error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}

export function calculate(expression: string): string {
  try {
    console.log(`>î Calculating: ${expression}`);
    
    // Basic safety check - only allow numbers, operators, and parentheses
    const safeExpression = expression.replace(/[^0-9+\-*/.() ]/g, '');
    
    if (safeExpression !== expression) {
      return `Calculation error: Invalid characters detected. Only numbers and basic operators (+, -, *, /, parentheses) are allowed.`;
    }
    
    // In production, use a safer math evaluator like mathjs
    const result = Function(`"use strict"; return (${safeExpression})`)();
    
    if (typeof result !== 'number' || !isFinite(result)) {
      return `Calculation error: Result is not a valid number.`;
    }
    
    console.log(` Calculation result: ${result}`);
    return String(result);
    
  } catch (error) {
    console.error('Calculation error:', error);
    return `Calculation error: ${error instanceof Error ? error.message : 'Invalid expression'}`;
  }
}

export async function analyzeWithLLM(text: string, context?: string): Promise<string> {
  try {
    console.log(`>à Analyzing text with LLM`);
    
    const prompt = context 
      ? `Context: ${context}\n\nAnalyze the following text and provide insights:\n\n${text}`
      : `Analyze the following text and provide insights:\n\n${text}`;
    
    const response = await llm.invoke(prompt);
    
    console.log(` LLM analysis completed`);
    return response.content as string;
    
  } catch (error) {
    console.error('LLM analysis error:', error);
    return `Analysis error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`;
  }
}

export function formatResults(data: any): string {
  try {
    if (typeof data === 'object') {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  } catch (error) {
    return `Formatting error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}