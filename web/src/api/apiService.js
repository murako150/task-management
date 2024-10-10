const API_BASE_URL = 'http://localhost:33001/api';

const handleError = async (response) => {
  const errorMessage = await response.text();
  throw new Error(errorMessage || 'Network response was not ok');
};

const apiService = {
  login: async (userId, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId, password }), // ユーザーIDとパスワードをJSON形式で送信
    });
    if (!response.ok) {
      await handleError(response); // エラーハンドリング
    }
    return await response.json(); // レスポンスをJSON形式で返す
  },
  get: async (endpoint) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${user.access_token}`,
      },
    });
    if (!response.ok) {
      await handleError(response);
    }
    return await response.json();
  },
  post: async (endpoint, data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      await handleError(response);
    }
    return await response.json();
  },
  put: async (endpoint, data) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.access_token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      await handleError(response);
    }
    return await response.json();
  },
  delete: async (endpoint) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.access_token}`,
      },
    });
    if (!response.ok) {
      await handleError(response);
    }
    return await response.json();
  },
};

export default apiService;