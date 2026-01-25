import { useState, useRef } from 'react';
import type { FileInfo } from './api/fileApi';
import { uploadFile } from './api/fileApi';
import './App.css';

function App() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedFile = await uploadFile(file);
      setFiles((prev) => [uploadedFile, ...prev]);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="container">
      <h1>AWS S3 파일 업로드</h1>

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
                <th>링크</th>
              </tr>
            </thead>
            <tbody>
              {files.map((file) => (
                <tr key={file.key}>
                  <td>{file.originalName}</td>
                  <td>{formatFileSize(file.size)}</td>
                  <td>
                    <a href={file.location} target="_blank" rel="noopener noreferrer">
                      보기
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
