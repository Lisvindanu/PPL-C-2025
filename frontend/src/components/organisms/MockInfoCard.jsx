import { useState, useEffect } from "react";
import hybridResetPasswordService from "../../services/hybridResetPasswordService";

export default function MockInfoCard({ email }) {
  const [currentOTP, setCurrentOTP] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    if (email) {
      const otp = hybridResetPasswordService.getCurrentOTP(email);
      setCurrentOTP(otp);

      // Get user info from mock data
      const mockData = hybridResetPasswordService.getMockData();
      const user = mockData.users.find((u) => u.email === email);
      setUserInfo(user);
    }
  }, [email]);

  if (!currentOTP) return null;

  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-blue-800">🔧 Mock Development Info</h3>
          <p className="text-sm text-blue-600 mt-1">
            Current OTP for <strong>{email}</strong>: <code className="bg-blue-100 px-2 py-1 rounded">{currentOTP}</code>
          </p>
          {userInfo && (
            <p className="text-xs text-blue-500 mt-1">
              User: {userInfo.nama_depan} {userInfo.nama_belakang} ({userInfo.role})
            </p>
          )}
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="text-blue-600 hover:text-blue-800 text-sm underline">
          {showInfo ? "Hide" : "Show"} Details
        </button>
      </div>

      {showInfo && (
        <div className="mt-3 pt-3 border-t border-blue-200">
          <p className="text-xs text-blue-600 mb-2">
            <strong>Mock Testing Instructions:</strong>
          </p>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
            <li>Copy the OTP code above</li>
            <li>Paste it in the OTP input field</li>
            <li>Click "Kirim" to proceed</li>
            <li>Set your new password in the next step</li>
          </ol>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(currentOTP);
                alert("OTP copied to clipboard!");
              }}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
            >
              Copy OTP
            </button>
            <button
              onClick={() => {
                hybridResetPasswordService.clearMockData();
                window.location.reload();
              }}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-800 px-2 py-1 rounded"
            >
              Clear Mock Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
