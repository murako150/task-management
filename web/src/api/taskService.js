import apiService from './apiService';

const taskService = {
  // タスク一覧を取得
  getAllTasks: async () => {
    try {
      const tasks = await apiService.get('tasks');
      return tasks;
    } catch (error) {
      console.error('タスク取得エラー:', error);
      throw error;
    }
  },

  // 特定のタスクを取得
  getTaskById: async (taskId) => {
    try {
      const task = await apiService.get(`tasks/${taskId}`);
      return task;
    } catch (error) {
      console.error('タスク取得エラー:', error);
      throw error;
    }
  },

  // 新しいタスクを作成
  createTask: async (taskData) => {
    try {
      const newTask = await apiService.post('tasks', taskData);
      return newTask;
    } catch (error) {
      console.error('タスク作成エラー:', error);
      throw error;
    }
  },

  // タスクを更新
  updateTask: async (taskId, updatedData) => {
    try {
      const updatedTask = await apiService.put(`tasks/${taskId}`, updatedData);
      return updatedTask;
    } catch (error) {
      console.error('タスク更新エラー:', error);
      throw error;
    }
  },

  // タスクを削除
  deleteTask: async (taskId) => {
    try {
      await apiService.delete(`tasks/${taskId}`);
    } catch (error) {
      console.error('タスク削除エラー:', error);
      throw error;
    }
  },

  // タスクのステータスを更新
  updateTaskStatus: async (taskId, status) => {
    try {
      await apiService.put(`user/tasks/${taskId}/status`, { status });
    } catch (error) {
      console.error('ステータス更新エラー:', error);
      throw error;
    }
  },

  // プロジェクトに関連するタスクを取得
  getTasksByProject: async (projectId) => {
    try {
      const tasks = await apiService.get(`projects/${projectId}/tasks`);
      return tasks;
    } catch (error) {
      console.error('プロジェクトのタスク取得エラー:', error);
      throw error;
    }
  },

  // タスクにコメントを追加
  addCommentToTask: async (taskId, commentData) => {
    try {
      const comment = await apiService.post(`user/tasks/${taskId}/comments`, commentData);
      return comment;
    } catch (error) {
      console.error('コメント追加エラー:', error);
      throw error;
    }
  },

  // タスクのコメント一覧を取得
  getCommentsForTask: async (taskId) => {
    try {
      const comments = await apiService.get(`user/tasks/${taskId}/comments`);
      return comments;
    } catch (error) {
      console.error('コメント取得エラー:', error);
      throw error;
    }
  }
};

export default taskService;