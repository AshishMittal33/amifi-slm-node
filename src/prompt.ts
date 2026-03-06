import fs from "fs"

export class PromptBuilder {

  systemPromptPath = "./prompts/system.txt"
  developerPromptPath = "./prompts/developer.txt"
  fewshotPath = "./prompts/fewshot.json"

  readFile(path: string): string {
    return fs.readFileSync(path, "utf-8")
  }

  buildPrompt(userInput: string): string {

    const system = this.readFile(this.systemPromptPath)

    const developer = this.readFile(this.developerPromptPath)

    const fewshot = JSON.parse(
      this.readFile(this.fewshotPath)
    )

    let examples = ""

    for (const ex of fewshot) {
      examples += `User: ${ex.input}\nAssistant: ${ex.output}\n\n`
    }

    const finalPrompt = `
${system}

${developer}

Examples:
${examples}

User: ${userInput}
Assistant:
`

    return finalPrompt
  }

}

const builder = new PromptBuilder()

const prompt = builder.buildPrompt("I paid Uber 20 USD yesterday")

console.log(prompt)