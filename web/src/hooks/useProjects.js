import { useState, useEffect } from 'react';
import { projectService } from '../api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const projectsResponse = await projectService.fetchProjects();
      setProjects(projectsResponse);
      setError(null);  // エラーがあればリセット
    } catch (err) {
      setError('プロジェクトの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData) => {
    setLoading(true);
    try {
      await projectService.createProject(projectData);
      await fetchProjects();  // プロジェクト作成後に最新のリストを取得
    } catch (err) {
      setError('プロジェクトの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (projectId, updatedData) => {
    setLoading(true);
    try {
      await projectService.updateProject(projectId, updatedData);
      await fetchProjects();  // プロジェクト更新後に最新のリストを取得
    } catch (err) {
      setError('プロジェクトの更新に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId) => {
    setLoading(true);
    try {
      await projectService.deleteProject(projectId);
      await fetchProjects();  // プロジェクト削除後に最新のリストを取得
    } catch (err) {
      setError('プロジェクトの削除に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();  // 初回レンダー時にプロジェクトを取得
  }, []);

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
  };
};