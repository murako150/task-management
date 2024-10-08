import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { taskService } from '../../api'; // taskServiceをインポート

function TaskList() {
  const [tasks, setTasks] = useState([]);

  const getAllTasks = async () => {
    try {
      const taskList = await taskService.getAllTasks();
      setTasks(taskList);
    } catch (error) {
      console.error('タスク取得エラー:', error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>タスク一覧</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>タスク名</TableCell>
              <TableCell>期限</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.due_date}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" href={`/tasks/${task.id}`}>詳細</Button>
                  <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>削除</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default TaskList;