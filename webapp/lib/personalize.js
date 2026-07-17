// Any editable text field across the (non-Exclusive) product pages can
// contain the token {{empresa}}. At render time it's swapped for the
// active client's name, or "sua empresa" for the generic/institutional
// view (no client, or the default Católica theme).
const TOKEN = "{{empresa}}";

export function personalize(text, clientName) {
  if (typeof text !== "string" || !text.includes(TOKEN)) return text;
  return text.split(TOKEN).join(clientName || "sua empresa");
}

// Walks an entire product object (including nested blocks/trilhas) and
// substitutes {{empresa}} everywhere it appears, so admins can drop the
// token into any editable text field, not just a fixed set of them.
export function deepPersonalize(value, clientName) {
  if (typeof value === "string") return personalize(value, clientName);
  if (Array.isArray(value)) return value.map((v) => deepPersonalize(v, clientName));
  if (value && typeof value === "object") {
    const out = {};
    for (const k in value) out[k] = deepPersonalize(value[k], clientName);
    return out;
  }
  return value;
}
