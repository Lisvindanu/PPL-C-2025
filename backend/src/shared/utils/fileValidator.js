const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB
const ALLOWED_MIMES = ['image/jpeg', 'image/png'];
const ALLOWED_EXT_RE = /\.(jpe?g|png)(?:\?|$)/i;

function isDataUrl(s) {
  return typeof s === 'string' && s.startsWith('data:');
}

function isUrl(s) {
  return typeof s === 'string' && /^https?:\/\//i.test(s);
}

function throwBad(fieldName, msg) {
  const err = new Error(`${fieldName} ${msg}`);
  err.statusCode = 400;
  throw err;
}

/**
 * Validate file type for image inputs (allow jpg/jpeg/png)
 * Accepts data URLs, plain base64, or http/https URLs (basic extension check for URLs)
 */
function validateFileType(fileData, fieldName) {
  if (!fileData) return;

  // 1) Data URL: check mime directly
  if (isDataUrl(fileData)) {
    const mimeEnd = fileData.indexOf(';');
    const mime = mimeEnd > 5 ? fileData.slice(5, mimeEnd) : null;
    if (!mime || !ALLOWED_MIMES.includes(mime.toLowerCase())) {
      throwBad(fieldName, 'must be JPG/JPEG/PNG');
    }
    return;
  }

  // 2) URL: check extension (basic check)
  if (isUrl(fileData)) {
    if (!ALLOWED_EXT_RE.test(fileData)) {
      throwBad(fieldName, 'URL must end with .jpg/.jpeg/.png');
    }
    return;
  }

  // 3) Plain base64 without data URL prefix: detect magic bytes
  try {
    const b64 = fileData.replace(/\s+/g, '');
    const buffer = Buffer.from(b64, 'base64');
    if (buffer.length >= 4) {
      // PNG magic bytes
      if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return;
      // JPEG magic bytes
      if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return;
    }
  } catch (e) {
    // fallthrough to error
  }

  throwBad(fieldName, 'must be a valid JPG/JPEG/PNG image');
}

/**
 * Validate file size (for base64 or data URL strings)
 * For URLs this function will skip size validation (use remote check if needed)
 */
function validateFileSize(fileData, fieldName) {
  if (!fileData) return;
  if (isUrl(fileData)) return; // skip URL size check here

  let fileSizeInBytes = 0;
  // If it's a data URL
  if (isDataUrl(fileData)) {
    const base64Data = (fileData.split(',')[1] || '');
    fileSizeInBytes = Math.ceil((base64Data.length * 3) / 4);
  } else {
    // Assume plain base64
    const b64 = fileData.replace(/\s+/g, '');
    fileSizeInBytes = Math.ceil((b64.length * 3) / 4);
  }

  if (fileSizeInBytes > MAX_FILE_SIZE) {
    const err = new Error(`${fieldName} exceeds maximum size of 3 MB`);
    err.statusCode = 400;
    throw err;
  }
}

module.exports = {
  MAX_FILE_SIZE,
  ALLOWED_MIMES,
  validateFileType,
  validateFileSize,
  isDataUrl,
  isUrl
};
