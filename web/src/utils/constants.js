// web/src/utils/constants.js

// APIの基本URL
export const API_BASE_URL = 'http://localhost:33001/api';

// ユーザーロール
export const USER_ROLES = {
    ADMIN: 'admin',
    CLIENT: 'client',
    USER: 'user',
};

// ステータス
export const TASK_STATUSES = {
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

// エラーメッセージ
export const ERROR_MESSAGES = {
    REQUIRED: 'このフィールドは必須です。',
    INVALID_EMAIL: '無効なメールアドレスです。',
};