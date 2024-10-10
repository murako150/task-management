// web/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import CommonHeader from './components/Common/CommonHeader';
import CommonFooter from './components/Common/CommonFooter';
import UserDashboardContainer from './components/Dashboard/UserDashboard/UserDashboardContainer';
import AdminDashboardContainer from './components/Dashboard/AdminDashboard/AdminDashboardContainer';
import ClientDashboardContainer from './components/Dashboard/ClientDashboard/ClientDashboardContainer';
import ProjectList from './components/Project/ProjectList';
import TaskList from './components/Task/TaskList';
import UserList from './components/User/UserList';
import TaskDetails from './components/Task/TaskDetails';
import ProjectCreate from './components/Project/ProjectCreate';
import ProjectDetails from './components/Project/ProjectDetails';
import TaskCreate from './components/Task/TaskCreate';
import Login from './components/Login';
import EditSelf from './components/EditSelf';
import { Container } from '@mui/material';

function App() {
    const user = JSON.parse(localStorage.getItem('user')); // ローカルストレージからユーザー情報を取得

    return (
        <Router>
            <CommonHeader user={user} onLogout={() => console.log('Logout')} />
            <Container>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/user-dashboard" element={<UserDashboardContainer />} />
                    <Route path="/admin-dashboard" element={<AdminDashboardContainer />} />
                    <Route path="/client-dashboard" element={<ClientDashboardContainer />} />
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/projects/:id" element={<ProjectDetails />} />
                    <Route path="/tasks" element={<TaskList />} />
                    <Route path="/tasks/:id" element={<TaskDetails />} />
                    <Route path="/users" element={<UserList />} />
                    <Route path="/create-project" element={<ProjectCreate />} />
                    <Route path="/create-task" element={<TaskCreate />} />
                    <Route path="/edit-self" element={<EditSelf />} />
                </Routes>
            </Container>
            <CommonFooter />
        </Router>
    );
}

export default App;