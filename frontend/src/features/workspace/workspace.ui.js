(function createWorkspaceUi() {
  const state = {
    token: null,
    user: null,
    accounts: [],
    categories: [],
    transactions: [],
    filters: {
      page: 1,
      limit: 10,
      type: '',
      accountId: '',
      categoryId: '',
      startDate: '',
      endDate: '',
    },
    pagination: {
      page: 1,
      pages: 1,
      total: 0,
      limit: 10,
    },
    editingAccountId: null,
  };

  const tabs = Array.from(document.querySelectorAll('.tab-button'));
  const tabPanels = Array.from(document.querySelectorAll('.tab-panel'));

  const accountForm = document.getElementById('account-form');
  const accountFormTitle = document.getElementById('account-form-title');
  const accountSubmit = document.getElementById('account-submit');
  const accountCancelEdit = document.getElementById('account-cancel-edit');
  const accountsTableBody = document.getElementById('accounts-table-body');

  const categoryForm = document.getElementById('category-form');
  const categoriesList = document.getElementById('categories-list');

  const transactionForm = document.getElementById('transaction-form');
  const txTypeSelect = document.getElementById('tx-type');
  const txAccountSelect = document.getElementById('tx-account-id');
  const txCategorySelect = document.getElementById('tx-category-id');

  const txFilterForm = document.getElementById('tx-filter-form');
  const txPrev = document.getElementById('tx-prev');
  const txNext = document.getElementById('tx-next');
  const txPageIndicator = document.getElementById('tx-page-indicator');
  const txClearFilters = document.getElementById('tx-clear-filters');
  const transactionsTableBody = document.getElementById('transactions-table-body');

  const filterType = document.getElementById('filter-type');
  const filterAccountId = document.getElementById('filter-account-id');
  const filterCategoryId = document.getElementById('filter-category-id');
  const filterStart = document.getElementById('filter-start');
  const filterEnd = document.getElementById('filter-end');
  const filterLimit = document.getElementById('filter-limit');

  function toast(message, type) {
    if (window.finarchAuthUi && typeof window.finarchAuthUi.setToast === 'function') {
      window.finarchAuthUi.setToast(message, type);
    }
  }

  function requireToken() {
    if (!state.token) {
      throw new Error('Missing auth token. Please login again.');
    }
  }

  function activateTab(tabName) {
    tabs.forEach((tab) => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    tabPanels.forEach((panel) => {
      panel.classList.toggle('hidden', panel.dataset.tabPanel !== tabName);
    });
  }

  function setDefaultTransactionDate() {
    const txDate = document.getElementById('tx-date');
    txDate.value = new Date().toISOString().slice(0, 10);
  }

  function resetAccountEditor() {
    state.editingAccountId = null;
    accountFormTitle.textContent = 'Create Account';
    accountSubmit.textContent = 'Create';
    accountCancelEdit.classList.add('hidden');
    accountForm.reset();
    document.getElementById('account-type').value = 'checking';
    document.getElementById('account-balance').value = '0';
    document.getElementById('account-currency').value = 'USD';
  }

  function renderAccountRows() {
    if (!state.accounts.length) {
      accountsTableBody.innerHTML = '<tr><td colspan="4">No accounts yet.</td></tr>';
      return;
    }

    accountsTableBody.innerHTML = state.accounts
      .map(
        (account) => `
          <tr>
            <td>${account.name}</td>
            <td>${account.type}</td>
            <td>${Number(account.balance).toFixed(2)} ${account.currency}</td>
            <td>
              <div class="actions compact">
                <button type="button" class="mini" data-account-edit="${account.id}">Edit</button>
                <button type="button" class="mini danger" data-account-delete="${account.id}">Delete</button>
              </div>
            </td>
          </tr>
        `,
      )
      .join('');
  }

  function renderCategoryRows() {
    if (!state.categories.length) {
      categoriesList.innerHTML = '<li>No categories yet.</li>';
      return;
    }

    categoriesList.innerHTML = state.categories
      .map((category) => `<li><strong>${category.name}</strong> <span class="pill">${category.type}</span></li>`)
      .join('');
  }

  function renderTransactionRows() {
    if (!state.transactions.length) {
      transactionsTableBody.innerHTML = '<tr><td colspan="6">No transactions found.</td></tr>';
      return;
    }

    transactionsTableBody.innerHTML = state.transactions
      .map(
        (row) => `
          <tr>
            <td>${row.transaction_date}</td>
            <td>${row.transaction_type}</td>
            <td>${Number(row.amount).toFixed(2)}</td>
            <td>${row.account_name}</td>
            <td>${row.category_name}</td>
            <td>${row.description || '-'}</td>
          </tr>
        `,
      )
      .join('');
  }

  function renderPagination() {
    txPageIndicator.textContent = `Page ${state.pagination.page} / ${state.pagination.pages || 1} • Total ${state.pagination.total}`;
    txPrev.disabled = state.pagination.page <= 1;
    txNext.disabled = state.pagination.page >= (state.pagination.pages || 1);
  }

  function renderSelectOptions() {
    const accountOptions = state.accounts
      .map((account) => `<option value="${account.id}">${account.name} (${account.type})</option>`)
      .join('');

    txAccountSelect.innerHTML = accountOptions || '<option value="">No accounts</option>';
    filterAccountId.innerHTML = '<option value="">all</option>' + accountOptions;

    const categoryOptions = state.categories
      .filter((category) => category.type === txTypeSelect.value)
      .map((category) => `<option value="${category.id}">${category.name}</option>`)
      .join('');

    txCategorySelect.innerHTML = categoryOptions || '<option value="">No matching categories</option>';

    const filterCategoryOptions = state.categories
      .map((category) => `<option value="${category.id}">${category.name} (${category.type})</option>`)
      .join('');
    filterCategoryId.innerHTML = '<option value="">all</option>' + filterCategoryOptions;
  }

  async function loadAccounts() {
    requireToken();
    state.accounts = await window.finarchWorkspaceApi.listAccounts(state.token);
    renderAccountRows();
    renderSelectOptions();
  }

  async function loadCategories() {
    requireToken();
    state.categories = await window.finarchWorkspaceApi.listCategories(state.token);
    renderCategoryRows();
    renderSelectOptions();
  }

  async function loadTransactions() {
    requireToken();

    const result = await window.finarchWorkspaceApi.listTransactions(state.token, state.filters);
    state.transactions = result.data;
    state.pagination = result.pagination;

    renderTransactionRows();
    renderPagination();
  }

  async function refreshWorkspace() {
    await loadAccounts();
    await loadCategories();
    await loadTransactions();
  }

  async function onAccountSubmit(event) {
    event.preventDefault();

    const formData = new FormData(accountForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      type: String(formData.get('type') || ''),
      balance: Number(formData.get('balance')),
      currency: String(formData.get('currency') || '').trim().toUpperCase(),
    };

    const check = window.finarchWorkspaceValidation.validateAccount(payload);
    if (!check.valid) {
      toast(check.errors[0], 'error');
      return;
    }

    try {
      if (state.editingAccountId) {
        await window.finarchWorkspaceApi.replaceAccount(state.token, state.editingAccountId, payload);
        toast('Account updated.', 'success');
      } else {
        await window.finarchWorkspaceApi.createAccount(state.token, payload);
        toast('Account created.', 'success');
      }

      resetAccountEditor();
      await loadAccounts();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function onAccountTableClick(event) {
    const editId = event.target.getAttribute('data-account-edit');
    const deleteId = event.target.getAttribute('data-account-delete');

    if (editId) {
      const account = state.accounts.find((item) => String(item.id) === String(editId));
      if (!account) return;

      state.editingAccountId = Number(account.id);
      accountFormTitle.textContent = 'Edit Account';
      accountSubmit.textContent = 'Save';
      accountCancelEdit.classList.remove('hidden');

      document.getElementById('account-name').value = account.name;
      document.getElementById('account-type').value = account.type;
      document.getElementById('account-balance').value = Number(account.balance);
      document.getElementById('account-currency').value = account.currency;
      return;
    }

    if (deleteId) {
      const confirmed = window.confirm('Delete this account? It must not have existing transactions.');
      if (!confirmed) return;

      try {
        await window.finarchWorkspaceApi.deleteAccount(state.token, deleteId);
        toast('Account deleted.', 'success');
        await loadAccounts();
      } catch (error) {
        toast(error.message, 'error');
      }
    }
  }

  async function onCategorySubmit(event) {
    event.preventDefault();

    const formData = new FormData(categoryForm);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      type: String(formData.get('type') || ''),
    };

    const check = window.finarchWorkspaceValidation.validateCategory(payload);
    if (!check.valid) {
      toast(check.errors[0], 'error');
      return;
    }

    try {
      await window.finarchWorkspaceApi.createCategory(state.token, payload);
      categoryForm.reset();
      document.getElementById('category-type').value = 'expense';
      await loadCategories();
      toast('Category created.', 'success');
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function onTransactionSubmit(event) {
    event.preventDefault();

    const formData = new FormData(transactionForm);
    const payload = {
      accountId: Number(formData.get('accountId')),
      categoryId: Number(formData.get('categoryId')),
      type: String(formData.get('type') || ''),
      amount: Number(formData.get('amount')),
      description: String(formData.get('description') || '').trim(),
      transactionDate: String(formData.get('transactionDate') || ''),
    };

    const check = window.finarchWorkspaceValidation.validateTransaction(payload);
    if (!check.valid) {
      toast(check.errors[0], 'error');
      return;
    }

    try {
      await window.finarchWorkspaceApi.createTransaction(state.token, payload);
      toast('Transaction created.', 'success');
      transactionForm.reset();
      setDefaultTransactionDate();
      txTypeSelect.value = 'expense';
      renderSelectOptions();
      await refreshWorkspace();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function updateFilterStateFromUi() {
    state.filters.type = filterType.value;
    state.filters.accountId = filterAccountId.value;
    state.filters.categoryId = filterCategoryId.value;
    state.filters.startDate = filterStart.value;
    state.filters.endDate = filterEnd.value;
    state.filters.limit = Number(filterLimit.value || 10);
  }

  async function onFilterSubmit(event) {
    event.preventDefault();
    state.filters.page = 1;
    updateFilterStateFromUi();

    try {
      await loadTransactions();
      toast('Filters applied.', 'success');
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function onClearFilters() {
    txFilterForm.reset();
    filterLimit.value = '10';
    state.filters = {
      page: 1,
      limit: 10,
      type: '',
      accountId: '',
      categoryId: '',
      startDate: '',
      endDate: '',
    };

    try {
      await loadTransactions();
      toast('Filters cleared.', 'success');
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function onPageMove(direction) {
    const nextPage = state.filters.page + direction;
    if (nextPage < 1 || nextPage > (state.pagination.pages || 1)) {
      return;
    }

    state.filters.page = nextPage;
    updateFilterStateFromUi();

    try {
      await loadTransactions();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function bindTabEvents() {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => activateTab(tab.dataset.tab));
    });
  }

  function bindEvents() {
    bindTabEvents();

    accountForm.addEventListener('submit', onAccountSubmit);
    accountCancelEdit.addEventListener('click', resetAccountEditor);
    accountsTableBody.addEventListener('click', onAccountTableClick);

    categoryForm.addEventListener('submit', onCategorySubmit);

    transactionForm.addEventListener('submit', onTransactionSubmit);
    txTypeSelect.addEventListener('change', renderSelectOptions);

    txFilterForm.addEventListener('submit', onFilterSubmit);
    txClearFilters.addEventListener('click', onClearFilters);
    txPrev.addEventListener('click', () => onPageMove(-1));
    txNext.addEventListener('click', () => onPageMove(1));

    setDefaultTransactionDate();
  }

  async function mount(session) {
    state.token = session.token;
    state.user = session.user;

    try {
      await refreshWorkspace();
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function unmount() {
    state.token = null;
    state.user = null;
    state.accounts = [];
    state.categories = [];
    state.transactions = [];
    state.editingAccountId = null;

    renderAccountRows();
    renderCategoryRows();
    renderTransactionRows();
  }

  bindEvents();

  window.finarchWorkspace = {
    mount,
    unmount,
  };
})();
