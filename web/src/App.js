import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CommonHeader from './components/CommonHeader';
import CommonFooter from './components/CommonFooter';
import AddUser from './components/AddUser';
import EditSelf from './components/EditSelf';
import AdminDashboard from './components/AdminDashboard';
import ClientDashboard from './components/ClientDashboard';
import UserDashboard from './components/UserDashboard';
import Login from './components/Login';
import ProjectList from './components/ProjectList';
import ProjectDetails from './components/ProjectDetails';
import ProjectCreate from './components/ProjectCreate'; 
import AddUserToProject from './components/AddUserToProject'; 
import TaskDetails from './components/TaskDetails';
import TaskList from './components/TaskList';
import TaskCreate from './components/TaskCreate';
import UserList from './components/UserList';
import EditProfile from './components/EditProfile';

function App() {
  const [user, setUser] = useState(null);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2',
      },
    },
  });
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); // ローカルストレージからユーザー情報を削除
    setUser(null); // 状態をnullに設定
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <CommonHeader user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/projects/add" element={user ? <ProjectCreate /> : <Navigate to="/login" />} />
          <Route path="/projects/:projectId/add-user" element={<AddUserToProject />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/users" element={<UserList />} />
          {user && (user.role === 'client' || user.role === 'admin') && (
            <Route path="/add-user" element={<AddUser />} />
          )}
          {user && (user.role === 'user' || user.role === 'client' || user.role === 'admin') && (
            <Route path="/edit-self" element={<EditSelf />} />
          )}
          <Route path="/edit-profile/:userId" element={<EditProfile />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/add" element={<TaskCreate />} />
          <Route path="/admin-dashboard" element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/client-dashboard" element={user && user.role === 'client' ? <ClientDashboard /> : <Navigate to="/login" />} />
          <Route path="/user-dashboard" element={user && user.role === 'user' ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        <CommonFooter />
      </Router>
    </ThemeProvider>
  );
}

export default App;