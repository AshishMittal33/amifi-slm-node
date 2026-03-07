import fs from "fs"

export function buildPrompt(userInput: string): string {

  const system = fs.readFileSync(
    "./prompts/system.txt",
    "utf-8"
  )

  const developer = fs.readFileSync(
    "./prompts/developer.txt",
    "utf-8"
  )

  const fewshot = JSON.parse(
    fs.readFileSync(
      "./prompts/fewshot.json",
      "utf-8"
    )
  )

  let examples = ""

  for (const ex of fewshot) {

    examples += `User: ${ex.input}\nAssistant: ${ex.output}\n\n`

  }

  const prompt = `
${system}

${developer}

Examples:
${examples}

User: ${userInput}
Assistant:
`

  return prompt
}