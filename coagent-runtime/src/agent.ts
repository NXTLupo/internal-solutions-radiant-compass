import { StateGraph, END } from "langgraph";
import { HumanMessage, AIMessage, BaseMessage } from "@langchain/core/messages";
import { searchWeb, calculate, analyzeWithLLM, formatResults } from './tools';

export interface AgentState {
  messages: BaseMessage[];
  currentStep?: string;
  searchResults?: string;
  analysis?: string;
  calculationResults?: string;
  finalResponse?: string;
}

// Define agent workflow nodes
async function routeNode(state: AgentState): Promise<AgentState> {
  console.log("=¦ Routing user request...");
  
  const lastMessage = state.messages[state.messages.length - 1];
  
  if (!(lastMessage instanceof HumanMessage)) {
    return {
      ...state,
      currentStep: "error",
      finalResponse: "Invalid message type received."
    };
  }
  
  const userInput = lastMessage.content as string;
  const lowerInput = userInput.toLowerCase();
  
  // Determine the appropriate workflow based on user input
  let nextStep = "respond";
  
  if (lowerInput.includes("search") || lowerInput.includes("find") || lowerInput.includes("look up")) {
    nextStep = "search";
  } else if (lowerInput.includes("calculate") || lowerInput.includes("math") || /[\d+\-*/]/.test(userInput)) {
    nextStep = "calculate";
  } else {
    nextStep = "analyze";
  }
  
  console.log(`=Í Routed to: ${nextStep}`);
  
  return {
    ...state,
    currentStep: nextStep,
    messages: [
      ...state.messages,
      new AIMessage(`I'll help you with that. Let me ${nextStep} for you.`)
    ]
  };
}

async function searchNode(state: AgentState): Promise<AgentState> {
  console.log("= Executing search node...");
  
  const lastHumanMessage = state.messages
    .filter(msg => msg instanceof HumanMessage)
    .pop() as HumanMessage;
  
  if (!lastHumanMessage) {
    return {
      ...state,
      currentStep: "error",
      finalResponse: "No search query found."
    };
  }
  
  const query = lastHumanMessage.content as string;
  const searchResults = await searchWeb(query);
  
  return {
    ...state,
    currentStep: "analyze",
    searchResults,
    messages: [
      ...state.messages,
      new AIMessage(`Search completed. Found relevant information. Now analyzing...`)
    ]
  };
}

async function calculateNode(state: AgentState): Promise<AgentState> {
  console.log(">î Executing calculation node...");
  
  const lastHumanMessage = state.messages
    .filter(msg => msg instanceof HumanMessage)
    .pop() as HumanMessage;
  
  if (!lastHumanMessage) {
    return {
      ...state,
      currentStep: "error",
      finalResponse: "No calculation expression found."
    };
  }
  
  const expression = lastHumanMessage.content as string;
  
  // Extract mathematical expression from the text
  const mathMatch = expression.match(/[\d+\-*/.() ]+/);
  const mathExpression = mathMatch ? mathMatch[0].trim() : expression;
  
  const calculationResults = calculate(mathExpression);
  
  return {
    ...state,
    currentStep: "respond",
    calculationResults,
    messages: [
      ...state.messages,
      new AIMessage(`Calculation completed: ${calculationResults}`)
    ]
  };
}

async function analyzeNode(state: AgentState): Promise<AgentState> {
  console.log(">à Executing analysis node...");
  
  const lastHumanMessage = state.messages
    .filter(msg => msg instanceof HumanMessage)
    .pop() as HumanMessage;
  
  if (!lastHumanMessage) {
    return {
      ...state,
      currentStep: "error",
      finalResponse: "No content to analyze."
    };
  }
  
  const textToAnalyze = state.searchResults || (lastHumanMessage.content as string);
  const context = state.searchResults ? "Based on search results" : "Direct analysis";
  
  const analysis = await analyzeWithLLM(textToAnalyze, context);
  
  return {
    ...state,
    currentStep: "respond",
    analysis,
    messages: [
      ...state.messages,
      new AIMessage("Analysis completed. Preparing response...")
    ]
  };
}

async function respondNode(state: AgentState): Promise<AgentState> {
  console.log("=¬ Generating final response...");
  
  let finalResponse = "";
  
  if (state.searchResults && state.analysis) {
    finalResponse = `Based on my search and analysis:\n\n${state.analysis}\n\n**Sources:**\n${state.searchResults}`;
  } else if (state.calculationResults) {
    finalResponse = `**Calculation Result:** ${state.calculationResults}`;
  } else if (state.analysis) {
    finalResponse = state.analysis;
  } else {
    const lastHumanMessage = state.messages
      .filter(msg => msg instanceof HumanMessage)
      .pop() as HumanMessage;
    
    const response = await analyzeWithLLM(
      lastHumanMessage?.content as string || "Hello",
      "Provide a helpful response"
    );
    finalResponse = response;
  }
  
  return {
    ...state,
    currentStep: "completed",
    finalResponse,
    messages: [
      ...state.messages,
      new AIMessage(finalResponse)
    ]
  };
}

async function errorNode(state: AgentState): Promise<AgentState> {
  console.log("L Error node reached");
  
  const errorResponse = state.finalResponse || "An error occurred while processing your request. Please try again.";
  
  return {
    ...state,
    currentStep: "completed",
    finalResponse: errorResponse,
    messages: [
      ...state.messages,
      new AIMessage(errorResponse)
    ]
  };
}

// Create the agent workflow
export const researchAgent = new StateGraph<AgentState>({
  channels: {
    messages: [],
    currentStep: undefined,
    searchResults: undefined,
    analysis: undefined,
    calculationResults: undefined,
    finalResponse: undefined
  }
})
  .addNode("route", routeNode)
  .addNode("search", searchNode)
  .addNode("calculate", calculateNode)
  .addNode("analyze", analyzeNode)
  .addNode("respond", respondNode)
  .addNode("error", errorNode)
  .addEdge("route", "search")
  .addEdge("route", "calculate") 
  .addEdge("route", "analyze")
  .addEdge("search", "analyze")
  .addEdge("calculate", "respond")
  .addEdge("analyze", "respond")
  .addEdge("respond", END)
  .addEdge("error", END)
  .setEntryPoint("route")
  .compile();

console.log(" Research agent compiled successfully");