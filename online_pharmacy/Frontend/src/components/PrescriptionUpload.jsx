import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const PrescriptionUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setFile(file);
      setPreview(URL.createObjectURL(file));
    }
  });

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Handle successful upload
      console.log('Upload successful:', res.data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-300 p-8 text-center cursor-pointer hover:border-primary-500"
      >
        <input {...getInputProps()} />
        <p>Drag & drop prescription here, or click to select</p>
      </div>

      {preview && (
        <div className="mt-4">
          <img src={preview} alt="Prescription preview" className="max-h-64 mx-auto" />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-4 bg-primary-500 text-white px-6 py-2 rounded hover:bg-primary-600 disabled:bg-gray-400"
          >
            {uploading ? 'Uploading...' : 'Upload Prescription'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PrescriptionUpload;