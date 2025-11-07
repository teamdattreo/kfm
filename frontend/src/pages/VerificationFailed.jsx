import { useSearchParams, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function VerificationFailed() {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason');
  const navigate = useNavigate();

  const getErrorMessage = () => {
    switch(reason) {
      case 'no_token': return 'Verification link is incomplete.';
      case 'invalid_token': return 'This verification link is invalid or expired.';
      case 'server_error': return 'A server error occurred.';
      default: return 'Email verification failed.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Verification Failed</h1>
        <p className="mb-6">{getErrorMessage()}</p>
        <div className="flex flex-col space-y-3">
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Return to Registration
          </button>
          <button
            onClick={() => navigate('/resend-verification')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Resend Verification Email
          </button>
        </div>
      </div>
    </div>
  );
}