import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function ProjectCreate() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [clients, setClients] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user.role === 'admin') {
      const fetchClients = async () => {
        try {
          const response = await axios.get('http://localhost:33001/api/clients', {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
            },
          });
          setClients(response.data);
        } catch (error) {
          console.error('クライアントの取得に失敗しました', error);
        }
      };
      fetchClients();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      name,
      description,
      owner_id: user.role === 'admin' ? ownerId : user.id,
    };

    try {
      await axios.post('http://localhost:33001/api/projects', projectData, {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      });
      navigate('/projects');
    } catch (error) {
      console.error('プロジェクトの作成に失敗しました', error);
    }
  };

  return (
    <Container style={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        プロジェクト作成
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="プロジェクト名"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="説明"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
        />
        {user.role === 'admin' && (
          <FormControl fullWidth margin="normal" required>
            <InputLabel>クライアントを選択</InputLabel>
            <Select value={ownerId} onChange={(e) => setOwnerId(e.target.value)}>
              <MenuItem value="">
                <em>クライアントを選択</em>
              </MenuItem>
              {clients.map((client) => (
                <MenuItem key={client.id} value={client.id}>
                  {client.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          作成
        </Button>
      </form>
    </Container>
  );
}

export default ProjectCreate;