import axios from 'axios';

export async function getCsrfToken() {
  try {
    await axios.get('http://localhost:33001/sanctum/csrf-cookie'); // CSRFトークンのクッキーを取得
    return document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  } catch (error) {
    console.error('CSRFトークンの取得に失敗しました:', error);
    return null;
  }
}