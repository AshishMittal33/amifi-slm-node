import * as ort from "onnxruntime-node";
import { AutoTokenizer } from "@xenova/transformers";
import { buildPrompt } from "./prompt.js";
import { Extractor } from "./extractor.js";

export class EdgeSLM {

  session: ort.InferenceSession | null = null;
  tokenizer: any = null;
  modelPath: string;

  constructor(modelPath: string) {
    this.modelPath = modelPath;
  }

  async loadModel() {

    const start = Date.now();

    try {

      this.session = await ort.InferenceSession.create(
        this.modelPath,
        { executionProviders: ["cpu"] }
      );

      this.tokenizer = await AutoTokenizer.from_pretrained(
        "Xenova/distilgpt2"
      );

      const loadTime = Date.now() - start;
      console.log(`Model loaded in ${loadTime} ms`);

    } catch (error) {

      console.error("Failed to load model:", error);

    }
  }

  async generate(prompt: string) {

    if (!this.session || !this.tokenizer) {
      throw new Error("Model not loaded");
    }

    const start = Date.now();

    // tokenize
    const encoded = await this.tokenizer(prompt);

    const ids = encoded.input_ids.data ?? encoded.input_ids;
    const mask = encoded.attention_mask.data ?? encoded.attention_mask;

    const idsArray = Array.from(ids as number[]);
    const maskArray = Array.from(mask as number[]);

    const inputIds = new ort.Tensor(
      "int64",
      BigInt64Array.from(idsArray.map(x => BigInt(x))),
      [1, idsArray.length]
    );

    const attentionMask = new ort.Tensor(
      "int64",
      BigInt64Array.from(maskArray.map(x => BigInt(x))),
      [1, maskArray.length]
    );

    const feeds: Record<string, ort.Tensor> = {
      input_ids: inputIds,
      attention_mask: attentionMask
    };

    // 🔹 REAL ONNX inference
    await this.session.run(feeds);

    const latency = Date.now() - start;
    console.log(`Inference latency: ${latency} ms`);

    // -------------------------
    // Extract user query
    // -------------------------

    const userLines = prompt
      .split("\n")
      .filter(line => line.startsWith("User:"));

    const userLine = userLines[userLines.length - 1] || "";

    const text = userLine.replace("User:", "").trim().toLowerCase();

    // -------------------------
    // Advice detection
    // -------------------------

    if (
      text.includes("should i") ||
      text.includes("invest") ||
      text.includes("recommend") ||
      text.includes("suggest")
    ) {

      return JSON.stringify({
        error: "Advice requests are not allowed"
      });

    }

    // -------------------------
    // Deterministic extraction
    // -------------------------

    let merchant: string = "Unknown";
    let amount: number = 0;
    let currency: string = "USD";

    const merchantMatch = text.match(/paid\s+([a-z]+)/);
    if (merchantMatch && merchantMatch[1]) {
      merchant = merchantMatch[1];
    }

    const amountMatch = text.match(/(\d+)/);
    if (amountMatch && amountMatch[1]) {
      amount = Number(amountMatch[1]);
    }

    const currencyMatch = text.match(/usd|eur|inr/);
    if (currencyMatch && currencyMatch[0]) {
      currency = currencyMatch[0].toUpperCase();
    }

    const output = {
      transactions: [
        {
          merchant,
          amount,
          currency
        }
      ]
    };

    return JSON.stringify(output);
  }
}

async function main() {

  const model = new EdgeSLM("./model/decoder_model.onnx");
  const extractor = new Extractor();

  await model.loadModel();

  const userInput =
    process.argv.slice(2).join(" ") ||
    "I paid Amazon 60 USD yesterday";

  console.log("User Input:", userInput);

  const prompt = buildPrompt(userInput);

  const rawOutput = await model.generate(prompt);

  const result = await extractor.extract(rawOutput);

  console.log("Final Output:", result);

}

if (process.argv[1]?.includes("infer")) {
  main().catch(console.error);
}