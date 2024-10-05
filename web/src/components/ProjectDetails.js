import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Paper, Button } from '@mui/material';
import { useParams, Link } from 'react-router-dom';

function ProjectDetails() {
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get(`http://localhost:33001/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${user.access_token}`,
          },
        });
        setProject(response.data);
      } catch (error) {
        setError('プロジェクトの取得に失敗しました。');
        console.error('プロジェクト詳細取得エラー:', error);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!project) {
    return <Typography>読み込み中...</Typography>;
  }

  return (
    <Container style={{ padding: '20px' }}>
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h5" gutterBottom>
          プロジェクト詳細
        </Typography>
        <Typography variant="subtitle1">
          <strong>名前:</strong> {project.name}
        </Typography>
        <Typography variant="subtitle1">
          <strong>説明:</strong> {project.description}
        </Typography>
        <Typography variant="subtitle1">
          <strong>作成日:</strong> {project.created_at}
        </Typography>
        <Typography variant="subtitle1">
          <strong>更新日:</strong> {project.updated_at}
        </Typography>
        <Typography variant="h6" gutterBottom>
          参加ユーザー
        </Typography>
        {project.users && project.users.length > 0 ? (
          <ul>
            {project.users.map(user => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        ) : (
          <Typography>参加ユーザーはいません。</Typography>
        )}
        <Link to={`/projects/${id}/add-user`}>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            ユーザーを追加
          </Button>
        </Link>
      </Paper>
    </Container>
  );
}

export default ProjectDetails;