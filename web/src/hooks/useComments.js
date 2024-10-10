import { useState, useEffect } from 'react';
import { commentService } from '../api';

export const useComments = (taskId) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentsResponse = await commentService.fetchComments(taskId);
      setComments(commentsResponse);
      setError(null);  // エラーがあればリセット
    } catch (err) {
      setError('コメントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (commentData) => {
    setLoading(true);
    try {
      await commentService.addComment(taskId, commentData);
      await fetchComments();  // コメント追加後に最新のリストを取得
    } catch (err) {
      setError('コメントの追加に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();  // タスクIDが変わった場合にコメントを取得
  }, [taskId]);

  return {
    comments,
    loading,
    error,
    addComment,
  };
};