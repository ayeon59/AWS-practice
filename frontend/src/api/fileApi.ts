const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface FileInfo {
  key: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  size: number;
}

export const uploadFile = async (file: File): Promise<FileInfo> => {
  // 1. 백엔드에서 Presigned URL 받기
  const response = await fetch(`${API_URL}/files/presigned-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!response.ok) {
    throw new Error('Presigned URL 생성에 실패했습니다.');
  }

  const { presignedUrl, key, fileUrl } = await response.json();

  // 2. S3에 직접 업로드
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('파일 업로드에 실패했습니다.');
  }

  return {
    key,
    fileName: file.name,
    fileUrl,
    fileType: file.type,
    size: file.size,
  };
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
