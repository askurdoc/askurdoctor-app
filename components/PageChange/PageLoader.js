export default function PageLoader() {
  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-gray-200 border-0">
      <div className="text-center items-center rounded-t bg-white mb-0 px-6 py-6">
        <div className="text-center flex-1 justify-between">
          <i className="animate-spin fas fa-spinner fa-4x"></i>
        </div>
        <div className="flex-1 mt-3">Loading...</div>
      </div>
    </div>
  );
}
