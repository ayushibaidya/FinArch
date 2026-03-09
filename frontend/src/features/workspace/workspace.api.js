(function createWorkspaceApi() {
  function authHeaders(token) {
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async function listAccounts(token) {
    return window.finarchHttp.request('/api/v1/accounts', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function createAccount(token, payload) {
    return window.finarchHttp.request('/api/v1/accounts', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
  }

  async function replaceAccount(token, accountId, payload) {
    return window.finarchHttp.request(`/api/v1/accounts/${accountId}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
  }

  async function deleteAccount(token, accountId) {
    return window.finarchHttp.request(`/api/v1/accounts/${accountId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function listCategories(token) {
    return window.finarchHttp.request('/api/v1/categories', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function createCategory(token, payload) {
    return window.finarchHttp.request('/api/v1/categories', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
  }

  async function createTransaction(token, payload) {
    return window.finarchHttp.request('/api/v1/transactions', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(payload),
    });
  }

  async function listTransactions(token, query) {
    const params = new URLSearchParams();

    Object.keys(query).forEach((key) => {
      const value = query[key];
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value));
      }
    });

    const suffix = params.toString() ? `?${params.toString()}` : '';

    return window.finarchHttp.request(`/api/v1/transactions${suffix}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  window.finarchWorkspaceApi = {
    listAccounts,
    createAccount,
    replaceAccount,
    deleteAccount,
    listCategories,
    createCategory,
    createTransaction,
    listTransactions,
  };
})();
