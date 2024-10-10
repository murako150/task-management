<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return mixed
     */
    public function handle($request, Closure $next, $role)
    {
        // ログインユーザーのロールを確認
        if (Auth::check() && Auth::user()->role === $role) {
            return $next($request);
        }

        // 権限がない場合はリダイレクト
        return redirect('/login')->withErrors('You do not have permission to access this page.');
    }
}