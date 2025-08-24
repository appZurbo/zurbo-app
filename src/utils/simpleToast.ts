// Sistema de toast simples sem React hooks
interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

class SimpleToastManager {
  private toasts: ToastMessage[] = [];
  private container: HTMLDivElement | null = null;
  private listeners: Array<(toasts: ToastMessage[]) => void> = [];

  constructor() {
    this.createContainer();
  }

  private createContainer() {
    if (typeof window === 'undefined') return;
    
    this.container = document.createElement('div');
    this.container.id = 'simple-toast-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private renderToast(toast: ToastMessage): HTMLDivElement {
    const toastEl = document.createElement('div');
    toastEl.style.cssText = `
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      max-width: 400px;
      pointer-events: auto;
      animation: slideIn 0.3s ease-out;
    `;

    const typeColors = {
      success: '#10b981',
      error: '#ef4444', 
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    const color = typeColors[toast.type || 'info'];
    toastEl.style.borderLeftColor = color;
    toastEl.style.borderLeftWidth = '4px';

    let content = '';
    if (toast.title) {
      content += `<div style="font-weight: 600; color: #111827; margin-bottom: 4px;">${toast.title}</div>`;
    }
    if (toast.description) {
      content += `<div style="color: #6b7280; font-size: 14px;">${toast.description}</div>`;
    }

    toastEl.innerHTML = content;

    return toastEl;
  }

  show(message: Omit<ToastMessage, 'id'>): string {
    const id = this.generateId();
    const toast: ToastMessage = { ...message, id };
    
    this.toasts.push(toast);
    
    if (this.container) {
      const toastEl = this.renderToast(toast);
      this.container.appendChild(toastEl);

      // Auto remove
      const duration = toast.duration || 5000;
      setTimeout(() => {
        this.remove(id);
        if (toastEl.parentNode) {
          toastEl.style.animation = 'slideOut 0.3s ease-in forwards';
          setTimeout(() => {
            if (toastEl.parentNode) {
              toastEl.parentNode.removeChild(toastEl);
            }
          }, 300);
        }
      }, duration);
    }

    this.notifyListeners();
    return id;
  }

  remove(id: string) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  subscribe(listener: (toasts: ToastMessage[]) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Global instance
const simpleToast = new SimpleToastManager();

// Add CSS animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

export { simpleToast };

// Export functions that match the original toast API
export const toast = {
  success: (message: string, title?: string) => 
    simpleToast.show({ title, description: message, type: 'success' }),
  error: (message: string, title?: string) => 
    simpleToast.show({ title, description: message, type: 'error' }),
  warning: (message: string, title?: string) => 
    simpleToast.show({ title, description: message, type: 'warning' }),
  info: (message: string, title?: string) => 
    simpleToast.show({ title, description: message, type: 'info' }),
};

export const useToast = () => {
  return {
    toast: (props: { 
      title?: string; 
      description?: string; 
      variant?: 'default' | 'destructive';
      duration?: number;
    }) => {
      const type = props.variant === 'destructive' ? 'error' : 'info';
      return simpleToast.show({
        title: props.title,
        description: props.description,
        type,
        duration: props.duration
      });
    },
    dismiss: (id?: string) => {
      if (id) simpleToast.remove(id);
    }
  };
};