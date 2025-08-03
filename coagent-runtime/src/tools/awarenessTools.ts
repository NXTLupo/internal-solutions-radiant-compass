export const awarenessTools = [
  {
    name: "say",
    description: "Says the given text.",
    parameters: [
      {
        name: "text",
        type: "string" as const,
        description: "The text to say.",
        required: true,
      },
    ],
    handler: async (args: any) => {
      return args.text;
    },
  },
];