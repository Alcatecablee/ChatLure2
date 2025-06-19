const AppMinimal = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-400 mb-4">
          ChatLure is Loading...
        </h1>
        <p className="text-gray-300 mb-8">
          If you see this, the app structure is working!
        </p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white inline-block"
          >
            Go to Admin
          </a>
          <a
            href="/test"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded text-white inline-block"
          >
            Test Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default AppMinimal;
