import fs from "fs"
import crypto from "crypto"
import archiver from "archiver"

function sha256(file: string) {

  const data = fs.readFileSync(file)

  return crypto
    .createHash("sha256")
    .update(data)
    .digest("hex")

}

async function makeBundle() {

  if (!fs.existsSync("dist")) {
    fs.mkdirSync("dist")
  }

  const files = [

    "model/model.onnx",
    "prompts/system.txt",
    "prompts/developer.txt",
    "prompts/fewshot.json"

  ]

  const manifest: any = {}

  for (const f of files) {
    manifest[f] = sha256(f)
  }

  fs.writeFileSync(
    "dist/manifest.json",
    JSON.stringify(manifest, null, 2)
  )

  const output = fs.createWriteStream("dist/bundle.zip")

  const archive = archiver("zip")

  archive.pipe(output)

  archive.directory("model", "model")
  archive.directory("prompts", "prompts")
  archive.directory("src", "src")

  await archive.finalize()

  console.log("Bundle created")

}

makeBundle()