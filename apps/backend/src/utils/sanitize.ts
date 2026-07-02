const INVALID_CHARACTERS = /[<>:"|?*\x00-\x1f]/g;
const PATH_TRAVERSAL = /\.\./g;
const RESERVED_NAMES = [
  "CON", "PRN", "AUX", "NUL",
  "COM1", "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
  "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", "LPT9",
];

export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== "string") return "untitled";

  let sanitized = filename.replace(INVALID_CHARACTERS, "_");
  sanitized = sanitized.replace(PATH_TRAVERSAL, "_");
  sanitized = sanitized.replace(/^[./\\]+|[./\\]+$/g, "");
  sanitized = sanitized.trim();

  if (!sanitized) return "untitled";

  const baseName = sanitized.split(".")[0].toUpperCase();
  if (RESERVED_NAMES.includes(baseName)) sanitized = "_" + sanitized;

  if (sanitized.length > 255) {
    const extIndex = sanitized.lastIndexOf(".");
    if (extIndex > 0) {
      const name = sanitized.substring(0, extIndex);
      const extension = sanitized.substring(extIndex);
      sanitized = name.substring(0, 255 - extension.length) + extension;
    } else {
      sanitized = sanitized.substring(0, 255);
    }
  }

  return sanitized;
}
