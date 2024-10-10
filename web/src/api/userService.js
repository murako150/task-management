import apiService from './apiService';

const userService = {
  // ユーザー一覧取得
  getAllUsers: async () => {
    return await apiService.get('user_accounts');
  },
  
  // 特定ユーザーの詳細取得
  getUserById: async (id) => {
    return await apiService.get(`user_accounts/${id}`);
  },
  
  // 新しいユーザーを作成
  createUser: async (userData) => {
    return await apiService.post('user_accounts', userData);
  },
  
  // ユーザーの更新
  updateUser: async (id, userData) => {
    return await apiService.put(`user/${id}`, userData);
  },
  
  // ユーザーに割り当てられたタスク取得
  getUserTasks: async () => {
    return await apiService.get('user/tasks');
  },

  getUsersByProject: async (projectId) => {
    return await apiService.get(`projects/${projectId}/users`);
  },

    // ユーザーログイン
  login: async (credentials) => {
      return await apiService.post('login', credentials);
  }
};

export default userService;