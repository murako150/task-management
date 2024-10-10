<?php

return [

    'defaults' => [
        'guard' => 'web',
        'passwords' => 'user_accounts',  // 変更
    ],

    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'user_accounts',  // 変更
        ],
    ],

    'providers' => [
        'user_accounts' => [  // 変更
            'driver' => 'eloquent',
            'model' => App\Models\UserAccount::class,  // 変更
        ],
    ],

    'passwords' => [
        'user_accounts' => [  // 変更
            'provider' => 'user_accounts',
            'table' => 'password_resets',
            'expire' => 60,
            'throttle' => 60,
        ],
    ],

    'password_timeout' => 10800,

];