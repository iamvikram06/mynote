export function exportAsJson(notes) {
  const blob = new Blob([JSON.stringify(notes, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAsMarkdown(notes) {
  const md = notes
    .map(
      (n) =>
        `# ${n.title || "Untitled"}\n\n${(n.tags || [])
          .map((t) => `#${t}`)
          .join(" ")}\n\n${n.content || ""}\n\n---\n`
    )
    .join("\n");
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.md";
  a.click();
  URL.revokeObjectURL(url);
}

export async function importFromJson(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) return [];
  return parsed.map((n) => ({
    id: n.id || crypto.randomUUID(),
    title: n.title || "Untitled",
    content: n.content || "",
    tags: Array.isArray(n.tags) ? n.tags : [],
    updatedAt: Date.now(),
  }));
}
