(function createTokenStorage() {
  const ACCESS_TOKEN_KEY = 'finarch.access_token';

  function saveToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  function getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  function clearToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  function decodePayload(token) {
    try {
      const payload = token.split('.')[1];
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch (error) {
      return null;
    }
  }

  function isExpired(token) {
    const payload = decodePayload(token);
    if (!payload || !payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  }

  window.finarchTokenStorage = {
    saveToken,
    getToken,
    clearToken,
    decodePayload,
    isExpired,
  };
})();
