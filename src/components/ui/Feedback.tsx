import { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

type AlertType = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
  type: AlertType;
  message: string;
  children?: ReactNode;
}

const config: Record<AlertType, { icon: typeof Info; styles: string }> = {
  success: { icon: CheckCircle2, styles: 'text-green-400 border-green-500/30 bg-green-500/10' },
  error: { icon: XCircle, styles: 'text-red-400 border-red-500/30 bg-red-500/10' },
  info: { icon: Info, styles: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  warning: { icon: AlertCircle, styles: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' },
};

export function Alert({ type, message, children }: AlertProps) {
  const { icon: Icon, styles } = config[type];
  return (
    <div className={`flex items-start gap-3 rounded-lg border p-4 ${styles}`}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: {
  icon: typeof Info;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-4 rounded-full bg-blanco-elevated">
        <Icon className="h-8 w-8 text-blanco-muted" />
      </div>
      <h3 className="text-lg font-semibold text-blanco-white mb-2">{title}</h3>
      {description && <p className="text-sm text-blanco-muted max-w-md mb-4">{description}</p>}
      {action}
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' };
  return (
    <div className="flex items-center justify-center">
      <svg className={`animate-spin ${sizes[size]} text-blanco-gold`} viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );
}
