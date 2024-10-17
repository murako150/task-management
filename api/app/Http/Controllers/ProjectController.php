<?php

namespace App\Http\Controllers;

use App\Services\ProjectService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    // プロジェクトの一覧を取得
    public function index()
    {
        $projects = $this->projectService->getAllProjects();
        return response()->json($projects);
    }

    // 特定のプロジェクトの詳細を取得
    public function show($id)
    {
        $project = $this->projectService->getProjectById($id);
        return response()->json($project);
    }

    // 新しいプロジェクトを作成
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'owner_id' => 'required|exists:user_accounts,id',  // クライアントを選択する
        ]);

        // サービスを通じてプロジェクトを作成
        $project = $this->projectService->createProject($validatedData);
        return response()->json($project, 201);
    }

    // プロジェクトの更新
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        // サービスを通じてプロジェクトを更新
        $project = $this->projectService->updateProject($id, $validated);
        if ($project === null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($project);
    }

    // プロジェクトの削除
    public function destroy($id)
    {
        $result = $this->projectService->deleteProject($id);
        if (!$result) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['message' => 'Project deleted successfully']);
    }

    // プロジェクトに参加しているユーザーを取得
    public function getProjectUsers($projectId)
    {
        $users = $this->projectService->getProjectUsers($projectId);
        return response()->json($users);
    }

    // プロジェクトにユーザーを追加
    public function addUserToProject(Request $request, $projectId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:user_accounts,id',
        ]);

        // サービスを通じてプロジェクトにユーザーを追加
        $result = $this->projectService->addUserToProject($projectId, $validated['user_id']);
        if (!$result) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json(['message' => 'ユーザーがプロジェクトに追加されました。']);
    }
}