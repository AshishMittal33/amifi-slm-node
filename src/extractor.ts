import Ajv from "ajv"

export class Extractor {

  ajv = new Ajv.default({ allErrors: true })

  schema = {
    type: "object",
    properties: {
      transactions: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            merchant: { type: "string" },
            amount: { type: "number" },
            currency: {
              type: "string",
              enum: ["USD", "EUR", "INR"]
            }
          },
          required: ["merchant", "amount", "currency"]
        }
      },
      confidence: { type: "number" }
    },
    required: ["transactions"]
  }

  async extract(text: string) {

    const lower = text.toLowerCase()

    if (
      lower.includes("ignore previous") ||
      lower.includes("system prompt") ||
      lower.includes("developer message")
    ) {
      return {
        error: "Prompt injection detected"
      }
    }

    if (
      lower.includes("should i invest") ||
      lower.includes("financial advice")
    ) {
      return {
        error: "Advice requests are not allowed"
      }
    }

    let parsed

    try {
      parsed = JSON.parse(text)
    } catch {
      return {
        error: "Invalid JSON output"
      }
    }

    const validate = this.ajv.compile(this.schema)

    const valid = validate(parsed)

    if (!valid) {
      return {
        error: "Schema validation failed",
        details: validate.errors
      }
    }

    parsed.confidence = 0.95

    return parsed
  }

}