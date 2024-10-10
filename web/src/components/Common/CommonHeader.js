import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function CommonHeader({ user, onLogout }) {
  const navigate = useNavigate(); // useNavigateフックを使用
  const handleLogout = () => {
    localStorage.removeItem('user'); // ローカルストレージからユーザー情報を削除
    onLogout(); // ユーザーの状態を更新
    navigate('/'); // トップページにリダイレクト
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          My Project
        </Typography>
        {user && (
          <Typography variant="body1" style={{ marginRight: '20px', color: 'white' }}>
            {`${user.name} (${user.role}) - ${user.user_id}`}
          </Typography>
        )}
        {user && (
          <>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} to="/admin-dashboard">管理者ダッシュボード</Button>
            )}
            {user.role === 'client' && (
              <Button color="inherit" component={Link} to="/client-dashboard">クライアントダッシュボード</Button>
            )}
            {user.role === 'user' && (
              <Button color="inherit" component={Link} to="/user-dashboard">ユーザーダッシュボード</Button>
            )}
            <Button color="inherit" component={Link} to="/projects">プロジェクト管理</Button>
            <Button color="inherit" component={Link} to="/tasks">タスク管理</Button>
            {/* 一般ユーザーには「ユーザー管理」ボタンを表示しない */}
            {user.role !== 'user' && (
              <Button color="inherit" component={Link} to="/users">ユーザー管理</Button>
            )}
            <Button color="inherit" component={Link} to="/edit-self">プロフィール変更</Button>
            <Button color="inherit" onClick={handleLogout}>ログアウト</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default CommonHeader;