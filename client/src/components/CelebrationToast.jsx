import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const CelebrationToast = ({ message, isVisible, onClose, type = 'success' }) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!shouldRender) return null;

  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-success-400 to-success-600 text-white';
      case 'celebration':
        return 'bg-gradient-to-r from-primary-400 to-purple-600 text-white';
      case 'encouragement':
        return 'bg-gradient-to-r from-purple-400 to-pink-600 text-white';
      default:
        return 'bg-gradient-to-r from-secondary-400 to-secondary-600 text-white';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${getToastStyle()} rounded-2xl p-4 shadow-2xl max-w-sm flex items-center gap-3 animate-celebrate`}>
        <CheckCircle className="w-6 h-6 flex-shrink-0" />
        <div className="flex-1">
          <div className="font-semibold text-sm">
            {message}
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CelebrationToast;