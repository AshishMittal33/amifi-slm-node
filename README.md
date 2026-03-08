## Amifi Edge SLM Inference Assignment

## Download link:
https://drive.google.com/file/d/1gzaZUl9qOZ0QXaxsSOGuBUslem8eAi0g/view?usp=sharing

## Demo

https://youtu.be/8w5a5aa-x3Q

## Overview

This project implements a minimal Edge Small Language Model (SLM) inference pipeline using Node.js + TypeScript + ONNX Runtime.

The system demonstrates a lightweight edge inference architecture capable of:

- Local ONNX model execution

- Prompt-based structured extraction

- Deterministic JSON validation

- Performance benchmarking

- Evaluation harness

- Reproducible artifact bundling

The project simulates a transaction extraction LLM pipeline suitable for edge environments.

## Repository Structure

amifi-slm-node/

│ 

├── src/

│   ├── infer.ts

│   ├── prompt.ts

│   ├── extractor.ts

│   └── perf.ts

│

├── model/

│   └── decoder_model.onnx

│

├── prompts/

│   ├── system.txt

│   ├── developer.txt

│   └── fewshot.json

│

├── eval/

│   ├── run_eval.ts

│   ├── report.json

│   └── report.md

│

├── perf/

│   └── report.json

│

├── bundle/

│   └── make_bundle.ts

│

├── dist/

│   ├── bundle.zip

│   └── manifest.json

│

├── tests/

│   └── regression.test.ts

│

├── package.json

└── README.md

## Environment

Local environment used during development:

- Node.js: v22

- Runtime: onnxruntime-node

- Language: TypeScript

- Execution Provider: CPU

Operating System: Windows 11

## ONNX Model Used

- Model: DistilGPT2 (Quantized ONNX)

- Source: [Xenova/distilgpt2_onnx-quantized](https://huggingface.co/Xenova/distilgpt2_onnx-quantized)

- File used: model/decoder_model.onnx

- Model size: ~250 MB

Because the model size exceeds GitHub limits, the complete project bundle including the model is hosted on Google Drive.

## Project Download

Since the model file is large, the entire runnable project is provided as a ZIP bundle.

## Download link:
https://drive.google.com/file/d/1gzaZUl9qOZ0QXaxsSOGuBUslem8eAi0g/view?usp=sharing

Steps:

- Download the ZIP file from Google Drive

- Extract the project folder

- Open the folder in VS Code

- Open terminal inside the project

## Installation

Install dependencies:

~~~
npm install
~~~

Install tokenizer runtime:

~~~
npm install @xenova/transformers
~~~

## CLI Commands

Command	

- npm run infer "I paid Uber 25 USD"	Run inference
- npm run perf	Run performance benchmark
- npm run eval	Run evaluation harness
- npm run bundle	Generate reproducible artifact bundle

## Running Inference
Example:

~~~
npm run infer "I paid Uber 25 USD"
~~~

Example output:
~~~
Model loaded in 571 ms
User Input: I paid Uber 25 USD
Inference latency: 138 ms

Final Output:
{
  "transactions": [
    {
      "merchant": "uber",
      "amount": 25,
      "currency": "USD"
    }
  ],
  "confidence": 0.95
}
~~~
## Prompt System

Prompt construction is implemented in:

- src/prompt.ts

Prompt components:

- prompts/system.txt

- prompts/developer.txt

- prompts/fewshot.json

Prompt flow:

system prompt

    ↓

developer instructions

    ↓

few-shot examples
 
    ↓
user input

    ↓

final prompt

This guides the model to produce structured transaction JSON.

## Extraction Pipeline

Extraction validation is implemented in:

- src/extractor.ts

The extractor enforces deterministic rules:

✅ Maximum 3 transactions

✅ Currency must be USD / EUR / INR

✅ Strict JSON schema validation

✅ Prompt injection detection

✅ Advice request refusal

✅ Confidence scoring

Example validated output:

~~~
{
  
  "transactions": 
  [

    {
      "merchant": "Amazon",
      "amount": 50,
      "currency": "USD"
    }
  ],
  "confidence": 0.95
}
~~~

## Core Pipeline Architecture

CLI Input

    ↓
PromptBuilder

    ↓
Tokenizer

    ↓
ONNX Runtime (session.run)

    ↓
Deterministic extraction

    ↓
Extractor validation

    ↓
Final JSON output

## Performance Benchmark

Performance testing implemented in:

- src/perf.ts

Run benchmark:

~~~
npm run perf
~~~

Metrics measured:

- Model cold start time

- Average inference latency

- Maximum inference latency

- Estimated tokens/sec

- Memory usage

Example result:
~~~
json
{
  "model_load_ms": 642,
  "avg_inference_ms": 122.6,
  "max_inference_ms": 140,
  "tokens_per_sec_est": 1052,
  "memory_mb_peak": 755
}
~~~

Results stored in:

- perf/report.json

## Evaluation Harness

Evaluation script:

- eval/run_eval.ts

Run evaluation:

~~~
npm run eval
~~~

The harness runs synthetic samples and measures:

- JSON validity rate

- Advice refusal accuracy

- Multi-transaction truncation correctness

Example output:

~~~
{
  "json_validity_rate": 1,
  "advice_refusal_accuracy": 1,
  "multi_txn_truncation_correct": true
}
~~~

Outputs:

- eval/report.json

- eval/report.md

## Regression Tests

Basic regression tests validate the extraction rules.

Run tests:

~~~
node --loader ts-node/esm tests/regression.test.ts
~~~

Tests cover:

- Valid transaction parsing

- Currency validation

- Prompt injection handling

## Reproducible Artifact Bundle

Generate portable artifact bundle:

~~~
npm run bundle
~~~
This produces:

- dist/bundle.zip

- dist/manifest.json

Bundle contents:

- model/

- prompts/

- src/

The manifest stores SHA256 hashes for verification.

## Key Capabilities Demonstrated

✅ ONNX Runtime inference pipeline

✅ Tokenizer → Tensor → ONNX execution flow

✅ Prompt-guided structured extraction

✅ JSON schema validation with AJV

✅ Prompt injection protection

✅ Edge inference performance benchmarking

✅ Evaluation harness for reliability testing

✅ Reproducible artifact bundling

## Tools Used

- Node.js

- TypeScript

- ONNX Runtime

- HuggingFace Model Hub

Development assistance:

- ChatGPT (architecture guidance)

Author
Ashish Mittal
