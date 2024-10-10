import { useState, useEffect } from 'react';
import { taskService, projectService, userService } from '../../../api'; 

export const useUserDashboardLogic = () => {
  const [tasks, setTasks] = useState([]);
  const [progressData, setProgressData] = useState({ pending: 0, in_progress: 0, completed: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: '' });
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const getAllTasks = async () => {
    try {
        const tasksResponse = await taskService.getAllTasks();
        const tasksWithProjects = await Promise.all(
          tasksResponse.map(async (task) => {
            const projectResponse = await projectService.getProjectById(task.project_id);
            return { ...task, project_name: projectResponse.name };
          })
        );
  
        setTasks(tasksWithProjects);
  
        const progress = {
          pending: tasksWithProjects.filter(task => task.status === 'pending').length,
          in_progress: tasksWithProjects.filter(task => task.status === 'in_progress').length,
          completed: tasksWithProjects.filter(task => task.status === 'completed').length,
        };
        setProgressData(progress);
      } catch (error) {
        console.error('タスク取得エラー:', error);
        setProgressData({ pending: 0, in_progress: 0, completed: 0 }); // エラー時に初期値を設定
      }
  };

  const getAllProjects = async () => {
    const projectsResponse = await projectService.getAllProjects();
    setProjects(projectsResponse);
  };

  const getUsersByProject = async (projectId) => {
    const usersResponse = await userService.getUsersByProject(projectId);
    setUsers(usersResponse);
  };

const handleOpenModal = (task = null) => {
    if (task) {
      setSelectedTask(task);
      getComments(task.id);
    } else {
      setSelectedTask(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setComments([]);
    setNewTask((prevTask) => ({ ...prevTask, comment: '' }));  // コメントをクリア
  };

  const handleTaskClick = (task) => {
    handleOpenModal(task);
  };

  const handleChangeNewTask = (value, field) => {
    setNewTask(prevState => ({ ...prevState, [field]: value }));
    if (field === 'project_id') {
      getUsersByProject(value);
    }
  };

  const handleAddTask = async () => {
    try {
      await taskService.createTask(newTask);
      setNewTask({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: '' });
      handleCloseModal();
      getAllTasks();
    } catch (error) {
      console.error('タスク作成エラー:', error);
    }
  };

  const handleStatusChange = async (status) => {
    if (selectedTask) {
      try {
        await taskService.updateTaskStatus(selectedTask.id, status);
        setSelectedTask(prev => ({ ...prev, status }));
        getAllTasks();
      } catch (error) {
        console.error('ステータス変更エラー:', error);
      }
    }
  };

  const handleCommentSubmit = async () => {
    if (selectedTask) {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // ログインしているユーザーの情報を取得
        if (!user || !user.id) {
            throw new Error('ユーザーIDが取得できませんでした');
        }
        const commentData = {
            comment: newTask.comment,
            user_id: user.id,  // user_idを追加
        };
        await taskService.addCommentToTask(selectedTask.id, commentData);
        setNewTask((prevTask) => ({ ...prevTask, comment: '' }));  // コメント入力欄をクリア
        getComments(selectedTask.id);
        handleCloseModal();

      } catch (error) {
        console.error('コメント追加エラー:', error);
      }
    }
  };

  const getComments = async (taskId) => {
    try {
      const commentsResponse = await taskService.getCommentsForTask(taskId);
      setComments(commentsResponse);
    } catch (error) {
      console.error('コメント取得エラー:', error);
    }
  };

  useEffect(() => {
    getAllTasks();
    getAllProjects();
  }, []);

  return {
    tasks,
    progressData,
    modalOpen,
    selectedTask,
    newTask,
    comment,
    comments,
    projects,
    users,
    handleOpenModal,
    handleCloseModal,
    handleChangeNewTask,
    handleAddTask,
    handleStatusChange,
    handleCommentSubmit,
    handleTaskClick,
  };
};