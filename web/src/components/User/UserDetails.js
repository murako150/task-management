import React, { useEffect, useState } from 'react';
import { Container, Typography, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import { userService } from '../../api'; // userServiceをインポート

function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const userData = await userService.fetchUserById(id);
      setUser(userData);
    } catch (error) {
      console.error('ユーザー詳細取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) return <Typography>読み込み中...</Typography>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>ユーザー詳細</Typography>
      <TextField label="ユーザーID" value={user.user_id} fullWidth disabled />
      <TextField label="名前" value={user.name} fullWidth disabled />
      <TextField label="メールアドレス" value={user.email} fullWidth disabled />
      <TextField label="ロール" value={user.role} fullWidth disabled />
    </Container>
  );
}

export default UserDetails;