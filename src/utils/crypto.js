import padLeft from "lodash/padStart";
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
export async function digestMessage(message, algorithm = "SHA-512") {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const buffer = await crypto.subtle.digest(algorithm, data);
  return bufferToHex(buffer);
}
