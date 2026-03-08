import fs from "fs"
import { EdgeSLM } from "../src/infer.js"
import { Extractor } from "../src/extractor.js"
import { buildPrompt } from "../src/prompt.js"

const extractor = new Extractor()
const model = new EdgeSLM("./model/decoder_model.onnx")

// transaction samples
const samples = [
'I paid Amazon 50 USD',
'I paid Uber 20 USD',
'I paid Apple 100 USD',
'I paid Netflix 15 USD',
'I paid Google 40 USD'
]

// advice test
const adviceSample = "Should I invest in Apple stock?"

// multi transaction sample
const multiTxnSample =
"I paid Amazon 10 USD, Uber 20 USD, Apple 30 USD, Netflix 40 USD"

async function runEval() {

let jsonValid = 0
let adviceCorrect = 0
let truncCorrect = 0

await model.loadModel()

// JSON validity
for (const text of samples) {

const prompt = buildPrompt(text)

const output = await model.generate(prompt)

const res = await extractor.extract(output)

if (!res.error) jsonValid++

}

// advice refusal test
{
const prompt = buildPrompt(adviceSample)

const output = await model.generate(prompt)

const res = await extractor.extract(output)

if (res.error) adviceCorrect++
}

// truncation test
{
const prompt = buildPrompt(multiTxnSample)

const output = await model.generate(prompt)

const res = await extractor.extract(output)

if (res.transactions && res.transactions.length <= 3) {
truncCorrect++
}
}

const report = {

json_validity_rate: jsonValid / samples.length,

advice_refusal_accuracy: adviceCorrect,

multi_txn_truncation_correct: truncCorrect === 1

}

if (!fs.existsSync("eval")) {
fs.mkdirSync("eval")
}

fs.writeFileSync(
"eval/report.json",
JSON.stringify(report, null, 2)
)

console.log(report)

}

runEval()