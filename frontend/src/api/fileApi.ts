const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('photos', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  return response.json();
};
