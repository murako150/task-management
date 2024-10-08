import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem } from '@mui/material';
import { taskService, projectService, userService } from '../../api'; // 各種サービスをインポート

function TaskCreate() {
  const [taskData, setTaskData] = useState({
    title: '',
    due_date: '',
    status: 'pending',
    assigned_user_id: '',
    project_id: ''
  });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getProjectsAndUsers = async () => {
      try {
        const projectsData = await projectService.getAllProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('プロジェクト取得エラー:', error);
      }
    };
    getProjectsAndUsers();
  }, []);

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskService.createTask(taskData);
      // 成功時の処理（リダイレクトやメッセージ表示など）
    } catch (error) {
      console.error('タスク作成エラー:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>タスク作成</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="タスク名" name="title" value={taskData.title} onChange={handleChange} fullWidth required />
        <TextField label="期限" name="due_date" type="date" value={taskData.due_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} required />

        <TextField
          select
          label="プロジェクト"
          name="project_id"
          value={taskData.project_id}
          onChange={handleChange}
          fullWidth
          required
        >
          <MenuItem value=""><em>プロジェクトを選択</em></MenuItem>
          {projects.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="担当者"
          name="assigned_user_id"
          value={taskData.assigned_user_id}
          onChange={handleChange}
          fullWidth
          required
        >
          <MenuItem value=""><em>担当者を選択</em></MenuItem>
          {users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </TextField>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>作成</Button>
      </form>
    </Container>
  );
}

export default TaskCreate;