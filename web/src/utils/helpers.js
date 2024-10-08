// web/src/utils/helpers.js

/**
 * ディスプレイ用の日付フォーマットを整形する関数
 * @param {string} dateString - 日付の文字列
 * @returns {string} - 整形された日付
 */
export const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

/**
 * ランダムな整数を生成する関数
 * @param {number} min - 最小値
 * @param {number} max - 最大値
 * @returns {number} - 生成されたランダムな整数
 */
export const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * 配列の中からユニークな値を取得する関数
 * @param {Array} array - 入力配列
 * @returns {Array} - ユニークな値の配列
 */
export const uniqueArray = (array) => {
    return [...new Set(array)];
};