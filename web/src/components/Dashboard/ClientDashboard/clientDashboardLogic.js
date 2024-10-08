import { useState, useEffect } from 'react';
import { taskService, projectService, userService } from '../../../api'; 

export const useClientDashboardLogic = () => {
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
    const tasksResponse = await taskService.getAllTasks();
    setTasks(tasksResponse);
    const progress = {
      pending: tasksResponse.filter(task => task.status === 'pending').length,
      in_progress: tasksResponse.filter(task => task.status === 'in_progress').length,
      completed: tasksResponse.filter(task => task.status === 'completed').length,
    };
    setProgressData(progress);
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
      getCommentsForTask(task.id);
    } else {
      setSelectedTask(null);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedTask(null);
    setComments([]);
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
        await taskService.addCommentToTask(selectedTask.id, comment);
        setComment('');
        getCommentsForTask(selectedTask.id);
      } catch (error) {
        console.error('コメント追加エラー:', error);
      }
    }
  };

  const getCommentsForTask = async (taskId) => {
    try {
      const commentsResponse = await taskService.fgetCommentsForTask(taskId);
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