const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface FileInfo {
  id: number;
  originalName: string;
  fileName: string;
  s3Key: string;
  s3Url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  updatedAt: string;
}

export const uploadFile = async (file: File): Promise<FileInfo> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  const data = await response.json();
  return data.file;
};

export const getAllFiles = async (): Promise<FileInfo[]> => {
  const response = await fetch(`${API_URL}/files`);

  if (!response.ok) {
    throw new Error('파일 목록을 불러오는데 실패했습니다.');
  }

  return response.json();
};

export const deleteFile = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/files/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('파일 삭제에 실패했습니다.');
  }
};

export const checkHealth = async (): Promise<{ status: string; timestamp: string }> => {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new Error('서버 상태 확인에 실패했습니다.');
  }

  return response.json();
};
