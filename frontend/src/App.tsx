import { useState, useRef } from 'react';
import { uploadFile } from './api/fileApi';
import './App.css';

function App() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    try {
      await uploadFile(file);
      setMessage('업로드 성공!');
    } catch (err) {
      setMessage('업로드 실패');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
