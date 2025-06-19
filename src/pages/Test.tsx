const Test = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-purple-400">App Test Page</h1>
        <p className="text-gray-300">
          If you can see this, the app is working!
        </p>
        <div className="space-x-4">
          <a href="/" className="text-blue-400 hover:underline">
            Go to Home
          </a>
          <a href="/admin" className="text-green-400 hover:underline">
            Go to Admin
          </a>
        </div>
      </div>
    </div>
  );
};

export default Test;
