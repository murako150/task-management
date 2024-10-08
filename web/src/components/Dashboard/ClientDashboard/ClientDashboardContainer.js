import React from 'react';
import ClientDashboard from './ClientDashboard';
import { useClientDashboardLogic } from './clientDashboardLogic';

const ClientDashboardContainer = () => {
  const {
    tasks,
    progressData,
    modalOpen,
    selectedTask,
    newTask,
    comments,
    projects,
    users,
    handleOpenModal,
    handleCloseModal,
    handleChangeNewTask,
    handleAddTask,
    handleStatusChange,
    handleCommentSubmit,
    handleTaskClick
  } = useClientDashboardLogic();

  return (
    <ClientDashboard
      tasks={tasks}
      progressData={progressData}
      modalOpen={modalOpen}
      selectedTask={selectedTask}
      newTask={newTask}
      comments={comments}
      projects={projects}
      users={users}
      handleOpenModal={handleOpenModal}
      handleCloseModal={handleCloseModal}
      handleChangeNewTask={handleChangeNewTask}
      handleAddTask={handleAddTask}
      handleStatusChange={handleStatusChange}
      handleCommentSubmit={handleCommentSubmit}
      handleTaskClick={handleTaskClick}
    />
  );
};

export default ClientDashboardContainer;