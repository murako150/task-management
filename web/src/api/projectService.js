import apiService from './apiService';  // 基本のAPIサービスをインポート

const projectService = {
  // プロジェクト一覧の取得
  getAllProjects: async () => {
    try {
      const response = await apiService.get('projects');
      return response;
    } catch (error) {
      console.error('プロジェクト一覧の取得に失敗しました', error);
      throw error;
    }
  },

  // 特定のプロジェクトの詳細を取得
  getProjectById: async (projectId) => {
    try {
      const response = await apiService.get(`projects/${projectId}`);
      return response;
    } catch (error) {
      console.error(`プロジェクトID: ${projectId}の取得に失敗しました`, error);
      throw error;
    }
  },

  // プロジェクトの新規作成
  createProject: async (projectData) => {
    try {
      const response = await apiService.post('projects', projectData);
      return response;
    } catch (error) {
      console.error('プロジェクトの作成に失敗しました', error);
      throw error;
    }
  },

  // プロジェクトの更新
  updateProject: async (projectId, projectData) => {
    try {
      const response = await apiService.put(`projects/${projectId}`, projectData);
      return response;
    } catch (error) {
      console.error(`プロジェクトID: ${projectId}の更新に失敗しました`, error);
      throw error;
    }
  },

  // プロジェクトの削除
  deleteProject: async (projectId) => {
    try {
      const response = await apiService.delete(`projects/${projectId}`);
      return response;
    } catch (error) {
      console.error(`プロジェクトID: ${projectId}の削除に失敗しました`, error);
      throw error;
    }
  },

  // プロジェクトにユーザーを追加
  addUserToProject: async (projectId, userData) => {
    try {
      const response = await apiService.post(`projects/${projectId}/add-user`, userData);
      return response;
    } catch (error) {
      console.error(`プロジェクトID: ${projectId}にユーザー追加に失敗しました`, error);
      throw error;
    }
  },

  // プロジェクトに関連するタスクを取得
  getTasksByProject: async (projectId) => {
    try {
      const response = await apiService.get(`projects/${projectId}/tasks`);
      return response;
    } catch (error) {
      console.error(`プロジェクトID: ${projectId}のタスク取得に失敗しました`, error);
      throw error;
    }
  },
};

export default projectService;