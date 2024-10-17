<?php
namespace App\Services;

use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    protected $projectRepository;

    public function __construct(ProjectRepositoryInterface $projectRepository)
    {
        $this->projectRepository = $projectRepository;
    }

    public function getAllProjects()
    {
        $user = Auth::user();

        if ($user->role === 'admin') {
            return $this->projectRepository->getAll();
        } else {
            $ownedProjects = $user->ownedProjects()->get();
            $participatingProjects = $user->participatingProjects()->get();
            return $ownedProjects->merge($participatingProjects);
        }
    }

    public function getProjectById($id)
    {
        return $this->projectRepository->findById($id);
    }

    public function createProject(array $data)
    {
        if (Auth::user()->role !== 'admin') {
            $data['owner_id'] = Auth::id();  // クライアントは自動的にオーナー
        }

        return $this->projectRepository->create($data);
    }

    public function updateProject($id, array $data)
    {
        $project = $this->projectRepository->findById($id);

        if (Auth::user()->id !== $project->owner_id) {
            return null;  // 許可されていない場合はnullを返す
        }

        return $this->projectRepository->update($id, $data);
    }

    public function deleteProject($id)
    {
        $project = $this->projectRepository->findById($id);

        if (Auth::user()->id !== $project->owner_id) {
            return false;
        }

        return $this->projectRepository->delete($id);
    }

    public function getProjectUsers($projectId)
    {
        return $this->projectRepository->getProjectUsers($projectId);
    }

    public function addUserToProject($projectId, $userId)
    {
        return $this->projectRepository->addUserToProject($projectId, $userId);
    }
}