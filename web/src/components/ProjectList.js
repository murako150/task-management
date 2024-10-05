import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Button, List, ListItem, ListItemText, Paper } from '@mui/material';

function ProjectList() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')); // ログインユーザー情報を取得

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!user || !user.access_token) {
          throw new Error('ログインユーザーの情報が見つかりません');
        }

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

    fetchProjects();
  }, [user]);

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom style={{ marginTop: '20px' }}>
        プロジェクト一覧
      </Typography>

      {/* 管理者またはクライアントの場合のみプロジェクト追加リンクを表示 */}
      {(user.role === 'admin' || user.role === 'client') && (
        <Link to="/projects/add">
          <Button variant="contained" color="primary" style={{ marginBottom: '20px' }}>
            プロジェクトを追加
          </Button>
        </Link>
      )}

      <Paper>
        <List>
          {projects.map((project, index) => (
            <ListItem key={project.id} style={{ backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff' }}>
              <ListItemText>
                <Link to={`/projects/${project.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                  {project.name}
                </Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default ProjectList;