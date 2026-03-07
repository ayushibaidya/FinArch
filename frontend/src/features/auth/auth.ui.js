(function createAuthUi() {
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout');
  const loadProtectedButton = document.getElementById('load-protected');
  const protectedOutput = document.getElementById('protected-output');
  const sessionUser = document.getElementById('session-user');
  const toast = document.getElementById('toast');

  function setToast(message, type) {
    toast.textContent = message || '';
    toast.className = 'toast';

    if (!message) return;
    toast.classList.add(type === 'error' ? 'error' : 'success');
  }

  function showAuthScreen() {
    authScreen.classList.remove('hidden');
    appScreen.classList.add('hidden');
    protectedOutput.textContent = 'No protected data loaded yet.';
    sessionUser.textContent = '';
  }

  function showAppScreen(user) {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    sessionUser.textContent = `Signed in as: ${user.email}`;
  }

  async function onRegisterSubmit(event) {
    event.preventDefault();
    setToast('', 'success');

    const formData = new FormData(registerForm);

    try {
      const payload = {
        fullName: String(formData.get('fullName') || ''),
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
      };

      const result = await window.finarchAuthApi.register(payload);
      window.finarchSession.setSession(result.token, result.user);
      setToast('Registration successful.', 'success');
      registerForm.reset();
    } catch (error) {
      setToast(error.message, 'error');
    }
  }

  async function onLoginSubmit(event) {
    event.preventDefault();
    setToast('', 'success');

    const formData = new FormData(loginForm);

    try {
      const payload = {
        email: String(formData.get('email') || ''),
        password: String(formData.get('password') || ''),
      };

      const result = await window.finarchAuthApi.login(payload);
      window.finarchSession.setSession(result.token, result.user);
      setToast('Login successful.', 'success');
      loginForm.reset();
    } catch (error) {
      setToast(error.message, 'error');
    }
  }

  function onLogout() {
    window.finarchSession.clearSession();
    setToast('Logged out.', 'success');
  }

  async function onLoadProtectedData() {
    const session = window.finarchSession.getSession();
    if (!session) {
      setToast('Please login first.', 'error');
      showAuthScreen();
      return;
    }

    try {
      const accounts = await window.finarchAuthApi.getAccounts(session.token);
      protectedOutput.textContent = JSON.stringify(accounts, null, 2);
      setToast('Protected data loaded.', 'success');
    } catch (error) {
      if (error.message.toLowerCase().includes('invalid') || error.message.toLowerCase().includes('expired')) {
        window.finarchSession.clearSession();
      }
      setToast(error.message, 'error');
    }
  }

  function bindEvents() {
    registerForm.addEventListener('submit', onRegisterSubmit);
    loginForm.addEventListener('submit', onLoginSubmit);
    logoutButton.addEventListener('click', onLogout);
    loadProtectedButton.addEventListener('click', onLoadProtectedData);

    window.addEventListener('finarch:session', (event) => {
      if (event.detail.isAuthenticated) {
        showAppScreen(event.detail.user);
      } else {
        showAuthScreen();
      }
    });
  }

  function mount() {
    const session = window.finarchSession.getSession();
    if (session) {
      showAppScreen(session.user);
    } else {
      showAuthScreen();
    }
  }

  window.finarchAuthUi = {
    bindEvents,
    mount,
    setToast,
  };
})();
