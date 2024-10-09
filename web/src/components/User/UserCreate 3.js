import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { userService } from '../../api'; // userServiceをインポート

function UserCreate() {
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.createUser(formData);
      // 成功時の処理（リダイレクトやメッセージ表示など）
    } catch (error) {
      console.error('ユーザー作成エラー:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>ユーザー作成</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="ユーザーID" name="user_id" value={formData.user_id} onChange={handleChange} fullWidth required />
        <TextField label="名前" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="メールアドレス" name="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField label="パスワード" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />
        <TextField
          select
          label="ロール"
          name="role"
          value={formData.role}
          onChange={handleChange}
          fullWidth
          SelectProps={{ native: true }}
        >
          <option value="user">ユーザー</option>
          <option value="client">クライアント</option>
          <option value="admin">管理者</option>
        </TextField>
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>作成</Button>
      </form>
    </Container>
  );
}

export default UserCreate;