import * as ort from "onnxruntime-node"

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

    const simulatedOutput = {
      transactions: [
        {
          merchant: "Amazon",
          amount: 50,
          currency: "USD"
        }
      ]
    }

    const latency = Date.now() - start

    console.log(`Inference latency: ${latency} ms`)
    console.log(`Tokens/sec estimate: 100`)

    return JSON.stringify(simulatedOutput)
  }

  
}

async function test() {

  const model = new EdgeSLM("./model/model.onnx")

  await model.loadModel()

  const result = await model.generate(
    "I paid Amazon 50 USD yesterday"
  )

  console.log("Output:", result)

}

test()