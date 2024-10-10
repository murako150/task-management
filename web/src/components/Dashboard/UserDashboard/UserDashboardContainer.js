import React from 'react';
import { useUserDashboardLogic } from './userDashboardLogic';
import UserDashboard from './UserDashboard';

function UserDashboardContainer() {
  const {
    tasks,
    progressData,
    modalOpen,
    selectedTask,
    newTask,
    comment,
    comments,
    projects,
    users,
    handleOpenModal,
    handleCloseModal,
    handleChangeNewTask,
    handleAddTask,
    handleStatusChange,
    handleCommentSubmit,
    handleTaskClick,
  } = useUserDashboardLogic();

  return (
    <UserDashboard
      tasks={tasks}
      progressData={progressData}
      modalOpen={modalOpen}
      selectedTask={selectedTask}
      newTask={newTask}
      comment={comment}
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
}

export default UserDashboardContainer;