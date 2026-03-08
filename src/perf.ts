import { EdgeSLM } from "../src/infer.js"
import { buildPrompt } from "../src/prompt.js"
import fs from "fs"

async function runPerf() {

  // correct model path
  const model = new EdgeSLM("./model/decoder_model.onnx")

  // memory before load
  const memBefore = process.memoryUsage().rss / 1024 / 1024

  const loadStart = Date.now()
  await model.loadModel()
  const loadEnd = Date.now()

  const modelLoad = loadEnd - loadStart

  let times: number[] = []
  let totalTokens = 0

  const inputText = "I paid Amazon 50 USD"

  for (let i = 0; i < 10; i++) {

    const prompt = buildPrompt(inputText)

    // simple token estimate (word count proxy)
    const tokenCount = prompt.split(" ").length
    totalTokens += tokenCount

    const start = Date.now()

    await model.generate(prompt)

    const end = Date.now()

    times.push(end - start)
  }

  const avg =
    times.reduce((a, b) => a + b, 0) / times.length

  const max = Math.max(...times)

  // real tokens/sec estimation
  const tokensPerSec =
    avg > 0 ? (totalTokens / (times.length * (avg / 1000))) : 0

  const memAfter = process.memoryUsage().rss / 1024 / 1024

  const report = {

    model_load_ms: modelLoad,

    avg_inference_ms: avg,

    max_inference_ms: max,

    tokens_per_sec_est: Math.round(tokensPerSec),

    memory_mb_peak: Math.round(memAfter)

  }

  if (!fs.existsSync("perf")) {
    fs.mkdirSync("perf")
  }

  fs.writeFileSync(
    "perf/report.json",
    JSON.stringify(report, null, 2)
  )

  console.log("Performance Report:")
  console.log(report)

}

runPerf()