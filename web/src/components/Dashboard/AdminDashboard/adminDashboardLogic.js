import { useState, useEffect } from 'react';
import { taskService, userService, projectService } from '../../../api';

export const useAdminDashboardLogic = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  const getAllTasks = async () => {
    try {
      const tasksResponse = await taskService.getAllasks();
      setTasks(tasksResponse);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  };

  const getAllUsers = async () => {
    try {
      const usersResponse = await userService.getAllUsers();
      setUsers(usersResponse);
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  };

  const getAllProjects = async () => {
    try {
      const projectsResponse = await projectService.getAllProjects();
      setProjects(projectsResponse);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
    }
  };

  useEffect(() => {
    getAllTasks();
    getAllUsers();
    getAllProjects(); // 初回レンダー時にタスク、ユーザー、プロジェクトを取得
  }, []);

  return {
    tasks,
    users,
    projects,
  };
};