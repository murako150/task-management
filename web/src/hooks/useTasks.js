import { useState, useEffect } from 'react';
import { taskService } from '../api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const tasksResponse = await taskService.fetchTasks();
      setTasks(tasksResponse);
      setError(null);  // エラーがあればリセット
    } catch (err) {
      setError('タスクの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      await taskService.createTask(taskData);
      await fetchTasks();  // タスク作成後に最新のリストを取得
    } catch (err) {
      setError('タスクの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (taskId, updatedData) => {
    setLoading(true);
    try {
      await taskService.updateTask(taskId, updatedData);
      await fetchTasks();  // タスク更新後に最新のリストを取得
    } catch (err) {
      setError('タスクの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await taskService.deleteTask(taskId);
      await fetchTasks();  // タスク削除後に最新のリストを取得
    } catch (err) {
      setError('タスクの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();  // 初回レンダー時にタスクを取得
  }, []);

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
};