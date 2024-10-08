import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';
import { projectService } from '../../api'; // projectServiceをインポート

function ProjectList() {
  const [projects, setProjects] = useState([]);

  const getAllProjects = async () => {
    try {
      const projectList = await projectService.getAllProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('プロジェクト取得エラー:', error);
    }
  };

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>プロジェクト一覧</Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>プロジェクト名</TableCell>
              <TableCell>説明</TableCell>
              <TableCell>オーナー</TableCell>
              <TableCell>アクション</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>{project.owner_id}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" href={`/projects/${project.id}`}>詳細</Button>
                  <Button variant="contained" color="secondary" style={{ marginLeft: '10px' }}>編集</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default ProjectList;