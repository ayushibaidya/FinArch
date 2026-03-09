(function createAuthUi() {
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout');
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
    sessionUser.textContent = '';

    if (window.finarchWorkspace) {
      window.finarchWorkspace.unmount();
    }
  }

  function showAppScreen(user, token) {
    authScreen.classList.add('hidden');
    appScreen.classList.remove('hidden');
    sessionUser.textContent = `Signed in as: ${user.email}`;

    if (window.finarchWorkspace) {
      window.finarchWorkspace.mount({ user, token });
    }
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

  function bindEvents() {
    registerForm.addEventListener('submit', onRegisterSubmit);
    loginForm.addEventListener('submit', onLoginSubmit);
    logoutButton.addEventListener('click', onLogout);

    window.addEventListener('finarch:session', (event) => {
      if (event.detail.isAuthenticated) {
        showAppScreen(event.detail.user, event.detail.token);
      } else {
        showAuthScreen();
      }
    });
  }

  function mount() {
    const session = window.finarchSession.getSession();
    if (session) {
      showAppScreen(session.user, session.token);
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
