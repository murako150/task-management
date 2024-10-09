import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { projectService, taskService } from '../../api'; // projectService, taskServiceをインポート

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);

  const getProjectDetails = async () => {
    try {
      const projectData = await projectService.getProjectById(id);
      setProject(projectData);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
    }
  };

  const getProjectTasks = async () => {
    try {
      const tasksData = await taskService.getTasksByProject(id);
      setTasks(tasksData);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  };

  useEffect(() => {
    getProjectDetails();
    getProjectTasks();
  }, [id]);

  if (!project) return <Typography>読み込み中...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>プロジェクト詳細</Typography>
      <Typography variant="h6">プロジェクト名: {project.name}</Typography>
      <Typography variant="body1">説明: {project.description}</Typography>
      <Typography variant="body1">オーナー: {project.owner_id}</Typography>

      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>タスク一覧</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>期限</TableCell>
              <TableCell>ステータス</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>{task.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ProjectDetails;