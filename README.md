# Amifi Edge SLM Inference Assignment

## Overview

This project implements a minimal **Edge Small Language Model (SLM) inference pipeline** using **Node.js + TypeScript + ONNX Runtime**.

The system demonstrates a lightweight **edge inference architecture** capable of:

* Local ONNX model execution
* Prompt-based structured extraction
* Deterministic JSON validation
* Performance benchmarking
* Evaluation harness
* Reproducible artifact bundling

The project is designed to simulate a **transaction extraction LLM pipeline** suitable for edge environments.

---

# Repository Structure

```
amifi-slm-node/

src/
  infer.ts
  prompt.ts
  extractor.ts
  perf.ts

model/
  model.onnx
  tokenizer.json

prompts/
  system.txt
  developer.txt
  fewshot.json

eval/
  run_eval.ts
  report.json
  report.md

perf/
  report.json

bundle/
  make_bundle.ts

dist/
  bundle.zip
  manifest.json

tests/
  regression.test.ts

package.json
README.md
```

---

# Environment

Local environment used during development:

```
Node.js: v22
Runtime: onnxruntime-node
Language: TypeScript
Execution Provider: CPU
```

Operating System:

```
Windows 11
```

---

# ONNX Model Used

Model:

```
DistilBERT (INT8 ONNX)
```

Source:

```
https://huggingface.co/Xenova/distilbert-base-uncased
```

Files included:

```
model/model.onnx
model/tokenizer.json
```

Model size:

```
~67 MB
```

This satisfies the assignment requirement:

```
model ≤ 120MB
```

---

# Installation

Clone repository:

```
git clone <your-repo-url>
cd amifi-slm-node
```

Install dependencies:

```
npm install
```

---

# Running Inference

Run inference from CLI:

```
npm run infer "I paid Uber 25 USD"
```

Example output:

```
Model loaded in 195 ms
Inference latency: 0 ms
Tokens/sec estimate: 100

Final Output:
{
  "transactions": [
    {
      "merchant": "Uber",
      "amount": 25,
      "currency": "USD"
    }
  ],
  "confidence": 0.95
}
```

<img width="1231" height="398" alt="Image" src="https://github.com/user-attachments/assets/edbb4fd3-fb1c-4ec2-9416-1daee0c1c8b5" />

---

# Prompt System

Prompt construction is implemented in:

```
src/prompt.ts
```

Prompt components:

```
prompts/system.txt
prompts/developer.txt
prompts/fewshot.json
```

Prompt flow:

```
system prompt
↓
developer instructions
↓
few-shot examples
↓
user input
↓
final prompt
```

The prompt guides the extraction engine to produce structured JSON output.

---

# Extraction Pipeline

Extraction validation is implemented in:

```
src/extractor.ts
```

The extractor enforces deterministic rules:

* Maximum **3 transactions**
* Currency must be **USD / EUR / INR**
* Strict **JSON schema validation**
* **Prompt injection detection**
* **Advice request refusal**
* Confidence scoring

Example validated output:

```
{
  "transactions":[
    {
      "merchant":"Amazon",
      "amount":50,
      "currency":"USD"
    }
  ],
  "confidence":0.95
}
```

---

# Core Pipeline Architecture

```
CLI Input
   ↓
PromptBuilder
   ↓
EdgeSLM.generate()
   ↓
Few-shot guided extraction
   ↓
Extractor validation
   ↓
Final JSON output
```

---

# Performance Benchmark

Performance testing is implemented in:

```
src/perf.ts
```

Run benchmark:

```
npm run perf
```

Metrics measured:

* Model cold start time
* Average inference latency
* Maximum inference latency
* Estimated tokens/sec
* Memory usage

Results stored in:

```
perf/report.json
```

<img width="1164" height="838" alt="Image" src="https://github.com/user-attachments/assets/00bfc2b6-a2fc-4973-8a41-45f3b45e81e7" />

---

# Evaluation Harness

Evaluation script:

```
eval/run_eval.ts
```

Run evaluation:

```
npm run eval
```

The harness runs **25 synthetic samples** and measures:

* JSON validity rate
* Advice refusal accuracy
* Multi-transaction truncation correctness

Outputs:

```
eval/report.json
eval/report.md
```

<img width="1210" height="950" alt="Image" src="https://github.com/user-attachments/assets/7357bce4-83bd-4334-99c5-1e18033d13a6" />

---

# Regression Tests

Basic regression tests validate the extraction rules.

Run tests:

```
node --loader ts-node/esm tests/regression.test.ts
```

Tests cover:

* Valid transaction parsing
* Currency enum validation
* Prompt injection handling

---

# Reproducible Artifact Bundle

To generate a portable artifact bundle:

```
npm run bundle
```

This produces:

```
dist/bundle.zip
dist/manifest.json
```

Bundle contents:

```
model/
prompts/
src/
```

The manifest file stores **SHA256 hashes** for artifact verification.

---


# Tools Used

* Node.js
* TypeScript
* ONNX Runtime
* HuggingFace Model Hub

Development assistance:

* ChatGPT (architecture guidance)

---

# Author

**Ashish Mittal**
