import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { projectService } from '../../api'; // projectServiceをインポート

function ProjectCreate() {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    owner_id: '' // オーナーID
  });

  const handleChange = (e) => {
    setProjectData({ ...projectData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(projectData);
      // 成功時の処理（リダイレクトやメッセージ表示など）
    } catch (error) {
      console.error('プロジェクト作成エラー:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>プロジェクト作成</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="プロジェクト名" name="name" value={projectData.name} onChange={handleChange} fullWidth required />
        <TextField label="説明" name="description" value={projectData.description} onChange={handleChange} fullWidth required multiline rows={4} />
        <TextField label="オーナーID" name="owner_id" value={projectData.owner_id} onChange={handleChange} fullWidth required />

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>作成</Button>
      </form>
    </Container>
  );
}

export default ProjectCreate;