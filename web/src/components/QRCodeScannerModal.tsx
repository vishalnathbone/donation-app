import React, { useState } from 'react';
import { QrCode, X, Camera } from '../utils/icons';

interface QRCodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: string) => void;
}

export const QRCodeScannerModal: React.FC<QRCodeScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess,
}) => {
  const [manualCode, setManualCode] = useState('');

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    const code = manualCode.trim() || 'REC-2026-000001';
    onScanSuccess(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-sm">
            <QrCode size={20} />
            <span>Scan Receipt QR Code</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Camera Simulator */}
        <div className="bg-slate-950 border border-dashed border-indigo-500/50 rounded-2xl p-8 text-center space-y-3 relative overflow-hidden">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-indigo-600/10 border-2 border-indigo-500 flex items-center justify-center text-indigo-400 animate-pulse">
            <Camera size={36} />
          </div>
          <p className="text-xs font-bold text-slate-200">Position QR Code within camera viewport</p>
          <p className="text-[10px] text-slate-400">Supported formats: REC-2026-XXXXXX / DON-2026-XXXXXX</p>
        </div>

        {/* Manual Code Entry */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-300">Or Enter Receipt / Transaction Reference</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. REC-2026-000001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleSimulateScan}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold cursor-pointer"
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
