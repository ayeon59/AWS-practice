const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface FileInfo {
  key: string;
  location: string;
  originalName: string;
  size: number;
}

export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  const data = await response.json();
  return data.file;
};
