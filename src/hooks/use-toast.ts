// Ultra-simple toast system - NO React hooks at all

interface SimpleToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

// DOM-only toast system
const showToast = (options: SimpleToastOptions) => {
  if (typeof window === 'undefined') return;

  const toastEl = document.createElement('div');
  toastEl.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 9999;
    max-width: 400px;
    animation: slideIn 0.3s ease-out;
  `;

  if (options.variant === 'destructive') {
    toastEl.style.borderLeftColor = '#ef4444';
    toastEl.style.borderLeftWidth = '4px';
  } else {
    toastEl.style.borderLeftColor = '#3b82f6';
    toastEl.style.borderLeftWidth = '4px';
  }

  let content = '';
  if (options.title) {
    content += `<div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${options.title}</div>`;
  }
  if (options.description) {
    content += `<div style="color: #6b7280; font-size: 14px;">${options.description}</div>`;
  }

  toastEl.innerHTML = content;

  // Add animations
  if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toastEl);

  // Auto remove
  const duration = options.duration || 5000;
  setTimeout(() => {
    toastEl.style.animation = 'slideOut 0.3s ease-in forwards';
    setTimeout(() => {
      if (toastEl.parentNode) {
        toastEl.parentNode.removeChild(toastEl);
      }
    }, 300);
  }, duration);

  return Math.random().toString(36);
};

// Export hook that DOESN'T use React hooks
export const useToast = () => {
  return {
    toast: showToast,
    dismiss: () => {} // Not implemented for simplicity
  };
};

// Export standalone toast functions
export const toast = showToast;