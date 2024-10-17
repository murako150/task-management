<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\UserAccountRepository;
use App\Repositories\Interfaces\UserAccountRepositoryInterface;
use App\Repositories\ProjectRepository;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\TaskRepository;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\CommentRepository;
use App\Repositories\Interfaces\CommentRepositoryInterface;
use App\Repositories\AuthRepository;
use App\Repositories\Interfaces\AuthRepositoryInterface;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(AuthRepositoryInterface::class, AuthRepository::class);
        $this->app->bind(UserAccountRepositoryInterface::class, UserAccountRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(CommentRepositoryInterface::class, CommentRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
