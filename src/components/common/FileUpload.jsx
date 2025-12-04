import { useState } from 'react';
import { Upload, X, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';

const FileUpload = ({ label, accept, onChange, value, required = false }) => {
  const [preview, setPreview] = useState(value || null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB. Please compress or resize the file.');
        return;
      }

      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        
        // If it's an image, compress it
        if (file.type.startsWith('image/')) {
          compressImage(base64String, (compressed) => {
            setPreview(compressed);
            onChange(compressed, file.name);
          });
        } else {
          setPreview(base64String);
          onChange(base64String, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const compressImage = (base64, callback) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Resize if too large
      const maxDimension = 800;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = (height / width) * maxDimension;
          width = maxDimension;
        } else {
          width = (width / height) * maxDimension;
          height = maxDimension;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      
      // Compress to JPEG with 0.7 quality
      const compressed = canvas.toDataURL('image/jpeg', 0.7);
      callback(compressed);
    };
  };

  const handleRemove = () => {
    setPreview(null);
    setFileName('');
    onChange(null, '');
  };

  const isImage = preview && (preview.includes('image/') || preview.includes('data:image'));

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-primary-600">*</span>}
        </label>
      )}

      {!preview ? (
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            required={required}
          />
          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
          <p className="text-sm text-gray-600">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {accept || 'Any file type'}
          </p>
        </label>
      ) : (
        <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
          <div className="flex items-start gap-3">
            {isImage ? (
              <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
            ) : (
              <div className="w-16 h-16 bg-primary-100 rounded flex items-center justify-center">
                <FileText className="text-primary-600" size={32} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle className="text-success-600" size={16} />
                <span className="text-xs text-success-600">Uploaded</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X className="text-gray-500" size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
