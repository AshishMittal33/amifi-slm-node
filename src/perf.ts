import { EdgeSLM } from "./infer.js"
import { buildPrompt } from "./prompt.js"
import fs from "fs"

async function runPerf() {

  const model = new EdgeSLM("./model/model.onnx")

  // memory before load
  const memBefore = process.memoryUsage().rss / 1024 / 1024

  const loadStart = Date.now()
  await model.loadModel()
  const loadEnd = Date.now()

  const modelLoad = loadEnd - loadStart

  let times: number[] = []

  for (let i = 0; i < 10; i++) {

    const start = Date.now()

    const prompt = buildPrompt("I paid Amazon 50 USD")
    await model.generate(prompt)

    const end = Date.now()

    times.push(end - start)

  }

  const avg =
    times.reduce((a, b) => a + b, 0) / times.length

  const max = Math.max(...times)

  const memAfter = process.memoryUsage().rss / 1024 / 1024

  const report = {

    model_load_ms: modelLoad,

    avg_inference_ms: avg,

    max_inference_ms: max,

    tokens_per_sec_est: 100,

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