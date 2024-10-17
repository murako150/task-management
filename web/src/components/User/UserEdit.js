import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useParams, useHistory } from 'react-router-dom';
import { userService } from '../../api'; // userServiceをインポート

function UserEdit() {
  const { id } = useParams();
  const history = useHistory();
  const [formData, setFormData] = useState({
    user_id: '',
    name: '',
    email: '',
    password: '', // パスワードは変更されない場合は空のままにする
    role: 'user',
    is_active: true,
  });

  useEffect(() => {
    // 初期データの取得
    const fetchUser = async () => {
      try {
        const response = await userService.getUserById(id);
        setFormData(response.data);
      } catch (error) {
        console.error('ユーザー取得エラー:', error);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userService.updateUser(id, formData);
      // 成功時の処理（リダイレクトやメッセージ表示など）
      history.push('/users');
    } catch (error) {
      console.error('ユーザー更新エラー:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>ユーザー編集</Typography>
      <form onSubmit={handleSubmit}>
        <TextField label="ユーザーID" name="user_id" value={formData.user_id} onChange={handleChange} fullWidth required disabled />
        <TextField label="名前" name="name" value={formData.name} onChange={handleChange} fullWidth required />
        <TextField label="メールアドレス" name="email" value={formData.email} onChange={handleChange} fullWidth required />
        <TextField label="パスワード" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth />
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
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>更新</Button>
      </form>
    </Container>
  );
}

export default UserEdit;