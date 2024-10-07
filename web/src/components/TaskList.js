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
import { Link } from 'react-router-dom';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));

      // タスクの取得
      const tasksResponse = await axios.get('http://localhost:33001/api/tasks', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setTasks(tasksResponse.data);

      // プロジェクト情報を取得
      const projectsResponse = await axios.get('http://localhost:33001/api/projects', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('データ取得エラー:', error);
    }
  };

  // プロジェクトIDからプロジェクト名を取得する関数
  const getProjectName = (projectId) => {
    const project = projects.find(proj => proj.id === projectId);
    return project ? project.name : '不明なプロジェクト';
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>タスク管理</Typography>
      
      <Link to="/tasks/add">
        <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>タスクを追加</Button>
      </Link>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>プロジェクト</TableCell> {/* プロジェクト名を表示する列 */}
              <TableCell>担当者</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>期限</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{getProjectName(task.project_id)}</TableCell> {/* プロジェクト名を取得して表示 */}
                <TableCell>{task.assigned_to ? task.assigned_to : '担当者なし'}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.due_date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TaskList;