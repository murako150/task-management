// web/src/utils/validators.js

/**
 * メールアドレスの形式をチェックする関数
 * @param {string} email - メールアドレス
 * @returns {boolean} - 有効な形式かどうか
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * フィールドが空でないかをチェックする関数
 * @param {string} value - チェックする値
 * @returns {boolean} - 値が空でないか
 */
export const isNotEmpty = (value) => {
    return value.trim().length > 0;
};

/**
 * パスワードの強度をチェックする関数
 * @param {string} password - パスワード
 * @returns {boolean} - 強度が十分かどうか
 */
export const isStrongPassword = (password) => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};