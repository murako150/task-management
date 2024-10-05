import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

function ClientDashboard() {
  const [projects, setProjects] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newTask, setNewTask] = useState({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: '' });
  const [users, setUsers] = useState([]); // 参加ユーザーの状態を追加

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get('http://localhost:33001/api/projects', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });

      const projectsData = response.data;

      const updatedProjects = await Promise.all(projectsData.map(async (project) => {
        const tasksResponse = await axios.get(`http://localhost:33001/api/projects/${project.id}/tasks`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });

        const tasks = tasksResponse.data;

        const totalTasks = tasks.length;

        const progress = {
          pending: tasks.filter(task => task.status === 'pending').length,
          in_progress: tasks.filter(task => task.status === 'in_progress').length,
          completed: tasks.filter(task => task.status === 'completed').length,
        };

        return {
          ...project,
          totalTasks,
          progress,
        };
      }));

      setProjects(updatedProjects);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
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
      setUsers(response.data); // 参加ユーザーの状態を更新
    } catch (error) {
      console.error('ユーザー取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchProjects(); // 初回マウント時にプロジェクトを取得
  }, []);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
    setNewTask({ title: '', due_date: '', status: 'pending', assigned_user_id: '', project_id: project.id }); // プロジェクトIDを設定
    fetchUsers(project.id); // プロジェクトに参加しているユーザーを取得
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  const handleChangeNewTask = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleAddTask = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      // assigned_user_idをassigned_toに変更
      const taskData = { 
        ...newTask, 
        project_id: selectedProject.id, // プロジェクトIDを追加
        assigned_to: newTask.assigned_user_id // 修正: assigned_toを使用
      };
      await axios.post(`http://localhost:33001/api/projects/${selectedProject.id}/tasks`, taskData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setNewTask({ title: '', due_date: '', status: 'pending', assigned_user_id: '' }); // フォームリセット
      handleCloseModal();
      fetchProjects(); // プロジェクトを再取得して更新
    } catch (error) {
      console.error('タスク追加エラー:', error.response ? error.response.data : error.message);
    }
};

  return (
    <Container>
      <Typography variant="h4" gutterBottom>クライアントダッシュボード</Typography>
      
      <Typography variant="h6" gutterBottom>プロジェクトの進捗状況</Typography>
      {projects.length > 0 ? (
        <div style={{ position: 'relative', height: '40vh', width: '40vw' }}>
          <Pie data={{
            labels: ['Pending', 'In Progress', 'Completed'],
            datasets: [{
              data: [
                projects.reduce((acc, project) => acc + project.progress?.pending || 0, 0),
                projects.reduce((acc, project) => acc + project.progress?.in_progress || 0, 0),
                projects.reduce((acc, project) => acc + project.progress?.completed || 0, 0),
              ],
              backgroundColor: ['#FF6384', '#36A2EB', '#4CAF50'],
            }],
          }} options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
            },
          }} />
        </div>
      ) : (
        <Typography variant="body1">プロジェクトがありません。</Typography>
      )}
      
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>プロジェクト一覧</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>プロジェクト名</TableCell>
              <TableCell>タスクの総数</TableCell>
              <TableCell>進捗状況</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.totalTasks || 0}</TableCell>
                <TableCell>
                  {project.totalTasks > 0 ? (
                    <div>
                      Pending: {project.progress?.pending || 0}, 
                      In Progress: {project.progress?.in_progress || 0}, 
                      Completed: {project.progress?.completed || 0}
                    </div>
                  ) : 'タスクなし'}
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleOpenModal(project)}>タスク追加</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* タスク追加モーダル */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ padding: 2, backgroundColor: 'white', margin: 'auto', marginTop: '20%', maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom>新しいタスクを追加</Typography>
          <TextField label="タスク名" name="title" value={newTask.title} onChange={handleChangeNewTask} fullWidth />
          <TextField label="期限" name="due_date" type="date" value={newTask.due_date} onChange={handleChangeNewTask} fullWidth InputLabelProps={{ shrink: true }} />
          
          {/* 参加ユーザーのプルダウン */}
          <TextField
            select
            label="割り当てユーザー"
            name="assigned_user_id"
            value={newTask.assigned_user_id}
            onChange={handleChangeNewTask}
            fullWidth
            required
          >
            <MenuItem value=""><em>ユーザーを選択</em></MenuItem>
            {users.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.name} {/* ユーザー名を表示 */}
              </MenuItem>
            ))}
          </TextField>
          
          <Button variant="contained" color="primary" onClick={handleAddTask}>追加</Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default ClientDashboard;