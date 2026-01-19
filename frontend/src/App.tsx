import { useState, useEffect, useRef } from 'react';
import type { FileInfo } from './api/fileApi';
import { uploadFile, getAllFiles, deleteFile, checkHealth } from './api/fileApi';
import './App.css';

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [serverStatus, setServerStatus] = useState<string>('확인 중...');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFiles();
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const health = await checkHealth();
      setServerStatus(`연결됨 (${health.timestamp})`);
    } catch {
      setServerStatus('연결 실패');
    }
  };

  const loadFiles = async () => {
    try {
      const fileList = await getAllFiles();
      setFiles(fileList);
      setError(null);
    } catch (err) {
      setError('파일 목록을 불러오는데 실패했습니다.');
      console.error(err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      await uploadFile(file);
      await loadFiles();
    } catch (err) {
      setError('파일 업로드에 실패했습니다.');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteFile(id);
      await loadFiles();
    } catch (err) {
      setError('파일 삭제에 실패했습니다.');
      console.error(err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="container">
      <h1>AWS S3 파일 업로드</h1>

      <div className="status">
        서버 상태: <span className={serverStatus.includes('연결됨') ? 'connected' : 'disconnected'}>
          {serverStatus}
        </span>
      </div>

      <div className="upload-section">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          disabled={uploading}
        />
        {uploading && <span>업로드 중...</span>}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="file-list">
        <h2>업로드된 파일 목록</h2>
        {files.length === 0 ? (
          <p>업로드된 파일이 없습니다.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>파일명</th>
                <th>크기</th>
                <th>업로드 일시</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.id}>
                  <td>
                    <a href={file.s3Url} target="_blank" rel="noopener noreferrer">
                      {file.originalName}
                    </a>
                  </td>
                  <td>{formatFileSize(Number(file.size))}</td>
                  <td>{new Date(file.createdAt).toLocaleString('ko-KR')}</td>
                  <td>
                    <button onClick={() => handleDelete(file.id)} className="delete-btn">
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button onClick={loadFiles} className="refresh-btn">
        새로고침
      </button>
    </div>
  );
}

export default App;
