// Function HTTP errors have a Response context; transport errors may have none.
export async function functionErrorMessage(error, fallback) {
  try {
    if (typeof error?.context?.json === 'function') {
      const body = await error.context.json();
      if (typeof body?.error === 'string' && body.error.trim()) return body.error;
    }
  } catch { /* Preserve a usable retry message when the response isn't JSON. */ }
  return fallback;
}
