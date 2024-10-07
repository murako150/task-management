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
} from '@mui/material';
import { Link } from 'react-router-dom'; // 追加

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData(); // タスクとユーザーを取得
    fetchProjects(); // プロジェクトを取得
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      const tasksResponse = await axios.get('http://localhost:33001/api/tasks', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setTasks(tasksResponse.data);

      const usersResponse = await axios.get('http://localhost:33001/api/user_accounts', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setUsers(usersResponse.data);
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const projectsResponse = await axios.get('http://localhost:33001/api/projects', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
    }
  };

  const getProjectName = (projectId) => {
    const project = projects.find((project) => project.id === projectId);
    return project ? project.name : '不明';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>管理者ダッシュボード</Typography>

      <Typography variant="h6" gutterBottom>タスク一覧</Typography>
      <Link to="/tasks/add">
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>タスクを追加</Button>
      </Link>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>プロジェクト名</TableCell> {/* 追加 */}
              <TableCell>期限</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.assigned_to ? users.find(user => user.id === task.assigned_to)?.name : '不明'}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{getProjectName(task.project_id)}</TableCell> {/* プロジェクト名を表示 */}
                <TableCell>{task.due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ユーザー一覧 */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>ユーザー一覧</Typography>
      <Link to="/add-user">
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>ユーザーを追加</Button>
      </Link>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ユーザー名</TableCell>
              <TableCell>ロール</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.active_flag ? 'アクティブ' : '非アクティブ'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* プロジェクト一覧 */}
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>プロジェクト一覧</Typography>
      <Link to="/projects/add">
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>プロジェクトを追加</Button>
      </Link>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>プロジェクト名</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AdminDashboard;