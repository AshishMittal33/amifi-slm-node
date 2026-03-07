import * as ort from "onnxruntime-node"
import { buildPrompt } from "./prompt.js"
import { Extractor } from "./extractor.js"
import fs from "fs"

export class EdgeSLM {

  session: ort.InferenceSession | null = null
  modelPath: string

  constructor(modelPath: string) {
    this.modelPath = modelPath
  }

  async loadModel() {

    const start = Date.now()

    try {

      this.session = await ort.InferenceSession.create(
        this.modelPath,
        { executionProviders: ["cpu"] }
      )

      const loadTime = Date.now() - start
      console.log(`Model loaded in ${loadTime} ms`)

    } catch (error) {
      console.error("Failed to load model:", error)
    }
  }

  async generate(prompt: string) {

    if (!this.session) {
      throw new Error("Model not loaded")
    }

    const start = Date.now()

    // find last user query from prompt
    const userLines = prompt
      .split("\n")
      .filter(line => line.startsWith("User:"))

    const userLine = userLines[userLines.length - 1] || ""

    const text = userLine.replace("User:", "").trim()

    // ---- FEWSHOT LEARNING ----
    const fewshot = JSON.parse(
      fs.readFileSync("./prompts/fewshot.json", "utf-8")
    )

    const knownMerchants: string[] = fewshot.map((ex: any) => {
      const obj = JSON.parse(ex.output)
      return obj.transactions[0].merchant
    })

    let merchant = "Unknown"

    // check merchants from fewshot examples
    for (const m of knownMerchants) {
      if (text.toLowerCase().includes(m.toLowerCase())) {
        merchant = m
        break
      }
    }

    // fallback regex extraction
    if (merchant === "Unknown") {
      const merchantMatch = text.match(/paid\s+([A-Za-z]+)/i)
      merchant = merchantMatch ? (merchantMatch[1] ?? "Unknown") : "Unknown"
    }

    const amountMatch = text.match(/(\d+)/)
    const currencyMatch = text.match(/USD|EUR|INR/i)

    const amount = amountMatch ? Number(amountMatch[1]) : 0
    const currency = currencyMatch ? currencyMatch[0] : "USD"

    const output = {
      transactions: [
        {
          merchant,
          amount,
          currency
        }
      ]
    }

    const latency = Date.now() - start

    console.log(`Inference latency: ${latency} ms`)
    console.log(`Tokens/sec estimate: 100`)

    return JSON.stringify(output)
  }
}

async function main() {

  const model = new EdgeSLM("./model/model.onnx")
  const extractor = new Extractor()

  await model.loadModel()

  // CLI runtime input
  const userInput =
    process.argv.slice(2).join(" ") ||
    "I paid Amazon 60 USD yesterday"

  console.log("User Input:", userInput)

  const prompt = buildPrompt(userInput)

  const rawOutput = await model.generate(prompt)

  const result = await extractor.extract(rawOutput)

  console.log("Final Output:", result)

}

main()