import { useState, useEffect } from "react";
import hybridResetPasswordService from "../../services/hybridResetPasswordService";

export default function HybridModeController() {
  const [isMockMode, setIsMockMode] = useState(true);
  const [showController, setShowController] = useState(false);

  useEffect(() => {
    // Set initial mode
    hybridResetPasswordService.setMockMode(isMockMode);
  }, [isMockMode]);

  const toggleMode = () => {
    const newMode = !isMockMode;
    setIsMockMode(newMode);
    hybridResetPasswordService.setMockMode(newMode);
  };

  const clearData = () => {
    hybridResetPasswordService.clearMockData();
    alert("Mock data cleared!");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {/* Toggle Button */}
      <button onClick={() => setShowController(!showController)} className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
        🔧 Hybrid Mode
      </button>

      {/* Controller Panel */}
      {showController && (
        <div className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Hybrid Reset Password Controller</h3>

          {/* Mode Toggle */}
          <div className="mb-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Mode:</span>
              <button onClick={toggleMode} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${isMockMode ? "bg-blue-100 text-blue-800 hover:bg-blue-200" : "bg-green-100 text-green-800 hover:bg-green-200"}`}>
                {isMockMode ? "🔧 Mock Mode" : "🌐 Real API Mode"}
              </button>
            </label>
          </div>

          {/* Mode Description */}
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 mb-2">
              <strong>{isMockMode ? "Mock Mode:" : "Real API Mode:"}</strong>
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              {isMockMode ? (
                <>
                  <li>• UI testing dengan mock data</li>
                  <li>• OTP ditampilkan langsung</li>
                  <li>• Data tersimpan di localStorage</li>
                  <li>
                    • <strong>Database TIDAK terupdate</strong>
                  </li>
                </>
              ) : (
                <>
                  <li>• Menggunakan real API backend</li>
                  <li>• Data tersimpan di database MySQL</li>
                  <li>• Password di-hash dengan bcrypt</li>
                  <li>
                    • <strong>Database TERUPDATE</strong>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button onClick={clearData} className="w-full px-3 py-2 bg-red-100 text-red-800 text-xs rounded hover:bg-red-200 transition-colors">
              Clear Mock Data
            </button>

            <button
              onClick={() => {
                const mockData = hybridResetPasswordService.getMockData();
                console.log("Mock Data:", mockData);
                alert("Mock data logged to console");
              }}
              className="w-full px-3 py-2 bg-blue-100 text-blue-800 text-xs rounded hover:bg-blue-200 transition-colors"
            >
              Log Mock Data
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Instructions:</strong>
              <br />
              • Mock Mode: Test UI tanpa backend
              <br />
              • Real API Mode: Test dengan database
              <br />• Toggle mode kapan saja untuk testing
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
