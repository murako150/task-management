<?php

namespace App\Repositories;

use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Models\Project;

class ProjectRepository implements ProjectRepositoryInterface
{
    public function getAll()
    {
        return Project::all();
    }

    public function findById($id)
    {
        return Project::with('users')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function update($id, array $data)
    {
        $project = Project::findOrFail($id);
        $project->update($data);
        return $project;
    }

    public function delete($id)
    {
        $project = Project::findOrFail($id);
        $project->delete();
        return true;
    }

    public function getProjectUsers($projectId)
    {
        $project = Project::findOrFail($projectId);
        return $project->participants()->get();
    }

    public function addUserToProject($projectId, $userId)
    {
        $project = Project::findOrFail($projectId);
        $project->users()->attach($userId);
        return true;
    }
}