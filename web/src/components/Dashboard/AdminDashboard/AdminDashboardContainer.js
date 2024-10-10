import React from 'react';
import AdminDashboard from './AdminDashboard';
import { useAdminDashboardLogic } from './adminDashboardLogic';

function AdminDashboardContainer() {
  const { tasks, users, projects } = useAdminDashboardLogic();

  return (
    <AdminDashboard tasks={tasks} users={users} projects={projects} />
  );
}

export default AdminDashboardContainer;