import apiService from './apiService';  // 既存のAPIサービスを使用

const commentService = {
  // 特定のタスクに関連するコメントを取得
  getCommentsByTaskId: async (taskId) => {
    return await apiService.get(`tasks/${taskId}/comments`);
  },

  // コメントを追加
  addCommentToTask: async (taskId, commentData) => {
    return await apiService.post(`tasks/${taskId}/comments`, commentData);
  },

  // コメントを更新
  updateComment: async (commentId, updatedData) => {
    return await apiService.put(`comments/${commentId}`, updatedData);
  },

  // コメントを削除
  deleteComment: async (commentId) => {
    return await apiService.delete(`comments/${commentId}`);
  },
};

export default commentService;