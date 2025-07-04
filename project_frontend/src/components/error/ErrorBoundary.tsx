import { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-lg w-full text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-warning-500" />
            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Une erreur est survenue
            </h1>
            <p className="mt-4 text-gray-600">
              Nous nous excusons pour ce désagrément. Notre équipe a été notifiée et travaille à résoudre le problème.
            </p>
            <div className="mt-8 space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Rafraîchir la page
              </button>
              <Link
                to="/"
                className="block text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Retourner à l'accueil
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;