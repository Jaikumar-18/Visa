import { useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';

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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label} {required && <span className="text-primary-600">*</span>}
        </label>
      )}

      {!preview ? (
        <label className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200">
          <input
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            required={required}
          />
          <Upload className="mx-auto text-neutral-400 mb-2" size={28} />
          <p className="text-sm text-neutral-700 font-medium">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            {accept || 'Any file type'} • Max 2MB
          </p>
        </label>
      ) : (
        <div className="border border-neutral-300 rounded-lg p-3 bg-neutral-50">
          <div className="flex items-start gap-3">
            {isImage ? (
              <img src={preview} alt="Preview" className="w-14 h-14 object-cover rounded border border-neutral-200" />
            ) : (
              <div className="w-14 h-14 bg-primary-100 rounded flex items-center justify-center flex-shrink-0">
                <FileText className="text-primary-600" size={24} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{fileName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <CheckCircle className="text-success-600" size={14} />
                <span className="text-xs text-success-600 font-medium">Uploaded</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 hover:bg-neutral-200 rounded transition-colors"
              title="Remove file"
            >
              <X className="text-neutral-600" size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
