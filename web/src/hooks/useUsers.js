import { useState, useEffect } from 'react';
import { userService } from '../api';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersResponse = await userService.fetchUsers();
      setUsers(usersResponse);
      setError(null);  // エラーがあればリセット
    } catch (err) {
      setError('ユーザーの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData) => {
    setLoading(true);
    try {
      await userService.createUser(userData);
      await fetchUsers();  // ユーザー作成後に最新のリストを取得
    } catch (err) {
      setError('ユーザーの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId, updatedData) => {
    setLoading(true);
    try {
      await userService.updateUser(userId, updatedData);
      await fetchUsers();  // ユーザー更新後に最新のリストを取得
    } catch (err) {
      setError('ユーザーの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await userService.deleteUser(userId);
      await fetchUsers();  // ユーザー削除後に最新のリストを取得
    } catch (err) {
      setError('ユーザーの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();  // 初回レンダー時にユーザーを取得
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
  };
};