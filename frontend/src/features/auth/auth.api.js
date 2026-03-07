(function createAuthApi() {
  async function register(payload) {
    return window.finarchHttp.request('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  async function login(payload) {
    return window.finarchHttp.request('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }

  async function getAccounts(token) {
    return window.finarchHttp.request('/api/v1/accounts', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async function refreshToken() {
    if (!window.finarchConfig.refreshEndpoint) {
      return null;
    }

    return window.finarchHttp.request(window.finarchConfig.refreshEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  }

  window.finarchAuthApi = {
    register,
    login,
    getAccounts,
    refreshToken,
  };
})();
