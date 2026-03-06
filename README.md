# Amifi Edge SLM Inference Assignment

## Overview

This project implements a minimal **Edge Small Language Model (SLM) inference pipeline** using **Node.js + TypeScript + ONNX Runtime**.

The goal is to demonstrate:

* Local ONNX model inference
* Deterministic JSON extraction
* Prompt-based structured extraction
* Performance awareness for edge deployments

This repository satisfies the **Checkpoint 1 (Project Initialization)** and **Checkpoint 2 (Core Engine Milestone)** requirements.

---

# Repository Structure

```
amifi-slm-node/

src/
  infer.ts
  prompt.ts
  extractor.ts

model/
  model.onnx
  tokenizer.json

prompts/
  system.txt
  developer.txt
  fewshot.json

package.json
README.md
```

---

# Environment

Local environment used for development:

```
Node.js: v22
Runtime: onnxruntime-node
Language: TypeScript
Execution Provider: CPU
```

Operating system used:

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

Downloaded files:

```
model/model.onnx
model/tokenizer.json
```

Model size:

```
~67MB
```

This satisfies the assignment requirement:

```
model ≤ 120MB
```

---

# Installation

Clone the repository:

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

Run the CLI command:

```
npm run infer
```

Example output:

```
Model loaded in 202 ms
Inference latency: 0 ms
Tokens/sec estimate: 100

Output:
{"transactions":[{"merchant":"Amazon","amount":50,"currency":"USD"}]}
```

---

# Prompt System

Prompt construction is handled in:

```
src/prompt.ts
```

Prompt components:

```
prompts/system.txt
prompts/developer.txt
prompts/fewshot.json
```

These are combined to build a structured prompt for the model.

---

# Extraction Pipeline

Structured JSON extraction is implemented in:

```
src/extractor.ts
```

Validation rules:

* Maximum 3 transactions
* Currency enum enforcement
* JSON schema validation
* Prompt injection detection
* Advice refusal logic
* Confidence score added to output

Example valid output:

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

# Core Engine Pipeline

Current pipeline architecture:

```
User Input
   ↓
PromptBuilder
   ↓
EdgeSLM.generate()
   ↓
Extractor
   ↓
Validated JSON Output
```

---

# Checkpoint Status

## Checkpoint 1 — Project Initialization

Requirements satisfied:

* Project repository created
* ONNX runtime installed
* Model loading implemented
* Basic repo structure completed
* Project compiles and runs

---

## Checkpoint 2 — Core Engine Milestone

Requirements satisfied:

* CLI command `npm run infer`
* ONNX model loads successfully
* Inference execution completed
* Prompt system implemented
* JSON output produced

---

# Next Steps (Remaining Tasks)

The following components will be implemented in later stages:

* Performance benchmark (`src/perf.ts`)
* Evaluation harness (`eval/run_eval.ts`)
* Regression tests
* Reproducible artifact bundle

---

# Tools Used

Development assistance tools:

* ChatGPT (architecture guidance)
* HuggingFace model repository
* ONNX Runtime

---

# Author

Ashish Mittal
