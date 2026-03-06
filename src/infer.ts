import * as ort from "onnxruntime-node"

export class EdgeSLM {

  session: ort.InferenceSession | null = null
  modelPath: string

  constructor(modelPath: string) {
    this.modelPath = modelPath
  }

  async loadModel() {

    const start = Date.now()

    this.session = await ort.InferenceSession.create(
      this.modelPath,
      { executionProviders: ["cpu"] }
    )

    const loadTime = Date.now() - start

    console.log(`Model loaded in ${loadTime} ms`)
  }

}

async function test() {

  const model = new EdgeSLM("./model/model.onnx")

  await model.loadModel()

}

test()