<?php

namespace App\Repositories\Interfaces;

interface AuthRepositoryInterface
{
    public function findUserByUserId($userId);
    public function validatePassword($user, $password);
    public function createToken($user);
    public function revokeToken($user);
}