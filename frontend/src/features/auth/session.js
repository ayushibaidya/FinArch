(function createSessionManager() {
  let refreshTimer = null;

  function readUserFromToken(token) {
    const payload = window.finarchTokenStorage.decodePayload(token);
    if (!payload) return { email: 'Unknown user', id: null };

    return {
      id: payload.sub || null,
      email: payload.email || 'Unknown user',
    };
  }

  function clearRefreshTimer() {
    if (!refreshTimer) return;
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  async function tryRefresh() {
    try {
      const response = await window.finarchAuthApi.refreshToken();
      if (!response || !response.token) {
        clearSession();
        return null;
      }

      setSession(response.token, response.user);
      return getSession();
    } catch (error) {
      clearSession();
      return null;
    }
  }

  function scheduleRefresh(token) {
    clearRefreshTimer();

    const payload = window.finarchTokenStorage.decodePayload(token);
    if (!payload || !payload.exp) return;

    const expiresAtMs = payload.exp * 1000;
    const refreshAtMs = expiresAtMs - 30000;
    const delayMs = refreshAtMs - Date.now();

    if (delayMs <= 0) {
      if (window.finarchConfig.refreshEndpoint) {
        void tryRefresh();
      } else {
        clearSession();
      }
      return;
    }

    refreshTimer = setTimeout(() => {
      if (window.finarchConfig.refreshEndpoint) {
        void tryRefresh();
      } else {
        clearSession();
      }
    }, delayMs);
  }

  function setSession(token, user) {
    window.finarchTokenStorage.saveToken(token);
    scheduleRefresh(token);

    const resolvedUser = user || readUserFromToken(token);

    window.dispatchEvent(
      new CustomEvent('finarch:session', {
        detail: {
          isAuthenticated: true,
          user: resolvedUser,
          token,
        },
      }),
    );
  }

  function clearSession() {
    clearRefreshTimer();
    window.finarchTokenStorage.clearToken();

    window.dispatchEvent(
      new CustomEvent('finarch:session', {
        detail: {
          isAuthenticated: false,
          user: null,
          token: null,
        },
      }),
    );
  }

  function getSession() {
    const token = window.finarchTokenStorage.getToken();
    if (!token) return null;

    if (window.finarchTokenStorage.isExpired(token)) {
      clearSession();
      return null;
    }

    return {
      token,
      user: readUserFromToken(token),
    };
  }

  function requireAuth() {
    const session = getSession();
    return Boolean(session && session.token);
  }

  window.finarchSession = {
    setSession,
    clearSession,
    getSession,
    requireAuth,
    tryRefresh,
  };
})();
