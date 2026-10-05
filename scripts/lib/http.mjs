const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const DEFAULT_TIMEOUT = 25_000;
const DEFAULT_RETRIES = 3;

export async function fetchWithRetry(url, { retries = DEFAULT_RETRIES, timeout = DEFAULT_TIMEOUT } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, Accept: 'application/json, text/html;q=0.9, */*;q=0.8' },
        redirect: 'follow',
        signal: AbortSignal.timeout(timeout),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const wait = attempt * 900;
        process.stderr.write(`      retry ${attempt}/${retries - 1} in ${wait}ms (${err.message})\n`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }
  }

  throw new Error(`${url} — ${lastError.message}`);
}

export const pause = (ms) => new Promise((r) => setTimeout(r, ms));