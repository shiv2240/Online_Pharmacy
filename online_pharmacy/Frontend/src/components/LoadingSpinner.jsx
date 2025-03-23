export default function LoadingSpinner({ fullScreen = false }) {
    return (
      <div className={`flex items-center justify-center ${fullScreen ? 'h-screen' : 'h-40'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }