import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function TaskCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [projectId, setProjectId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projectId) {
      fetchUsers(projectId);
    }
  }, [projectId]);

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('http://localhost:33001/api/projects', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setProjects(response.data);
    } catch (error) {
      console.error('プロジェクトの取得に失敗しました:', error);
    }
  };

  const fetchUsers = async (projectId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`http://localhost:33001/api/projects/${projectId}/users`, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('担当者の取得に失敗しました:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await axios.post('http://localhost:33001/api/tasks', {
        title,
        description,
        assigned_to: assignedTo,
        project_id: projectId,
        due_date: dueDate,
      }, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      navigate('/tasks');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'タスク追加に失敗しました');
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        タスクの追加
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="タイトル"
          variant="outlined"
          fullWidth
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          label="説明"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>プロジェクト</InputLabel>
          <Select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <MenuItem value="">
              <em>プロジェクトを選択</em>
            </MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>担当者</InputLabel>
          <Select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <MenuItem value="">
              <em>担当者を選択</em>
            </MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="期限日"
          type="date"
          variant="outlined"
          fullWidth
          margin="normal"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          追加
        </Button>
      </form>
    </Container>
  );
}

export default TaskCreate;