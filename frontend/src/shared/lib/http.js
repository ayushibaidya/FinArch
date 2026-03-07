(function createHttpClient() {
  async function parseJson(response) {
    const raw = await response.text();
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      return { message: raw };
    }
  }

  async function request(path, options) {
    const response = await fetch(`${window.finarchConfig.apiBaseUrl}${path}`, options);
    const data = await parseJson(response);

    if (!response.ok) {
      const message = data && data.message ? data.message : `Request failed (${response.status})`;
      throw new Error(message);
    }

    return data;
  }

  window.finarchHttp = {
    request,
  };
})();
