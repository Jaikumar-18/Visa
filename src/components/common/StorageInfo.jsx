import { useState, useEffect } from 'react';
import { HardDrive, Trash2 } from 'lucide-react';
import { storage } from '../../utils/storage';
import Button from './Button';

const StorageInfo = () => {
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    calculateStorageSize();
  }, []);

  const calculateStorageSize = () => {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    setStorageSize((total / 1024).toFixed(2)); // Convert to KB
  };

  const handleClearStorage = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      storage.clearAll();
      window.location.href = '/';
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="text-gray-600" size={20} />
          <div>
            <p className="text-sm font-medium text-gray-900">Storage Used</p>
            <p className="text-xs text-gray-600">{storageSize} KB</p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleClearStorage}
          icon={Trash2}
          className="text-sm py-1 px-3"
        >
          Clear All Data
        </Button>
      </div>
    </div>
  );
};

export default StorageInfo;
