<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\UserAccountService;
use Illuminate\Support\Facades\Auth;

class UserAccountController extends Controller
{
    protected $userAccountService;

    public function __construct(UserAccountService $userAccountService)
    {
        $this->userAccountService = $userAccountService;
    }

    public function index()
    {
        $users = $this->userAccountService->getAllUsers();
        if ($users === null) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|unique:user_accounts,user_id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:user_accounts,email',
            'role' => 'required|in:admin,client,user',
            'password' => 'required|string|min:8',
        ]);

        $user = $this->userAccountService->createUser($request->all());
        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:user_accounts,email,'.$id,
            'password' => 'sometimes|nullable|string|min:8',
            'active_flag' => 'sometimes|boolean',
        ]);

        $user = $this->userAccountService->updateUser($id, $validated);
        return response()->json($user);
    }

    public function destroy($id)
    {
        $result = $this->userAccountService->deleteUser($id);
        if (!$result) {
            return response()->json(['message' => 'Cannot delete this user'], 403);
        }
        return response()->json(['message' => 'User marked as deleted']);
    }

    public function getAvailableUsersForProject($projectId)
    {
        $users = $this->userAccountService->getAvailableUsersForProject($projectId);
        return response()->json($users);
    }

    public function getUserTasks()
    {
        $user = Auth::user();
        $tasks = $this->userAccountService->getUserTasks($user->id);
        return response()->json($tasks);
    }
}
