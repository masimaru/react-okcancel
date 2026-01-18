import { useState } from 'react';
import { useOkCancel, OkCancelProvider } from './index';
import { shadcnPreset } from './registry'; // 데모용 - npm 패키지에는 미포함

const DemoContent = () => {
  const { confirm, alert } = useOkCancel();
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog((prev) => [msg, ...prev]);

  // 1. 기본 사용법 (Confirm)
  const handleConfirm = async () => {
    addLog('⏳ Confirm 요청...');
    const result = await confirm({
      title: '삭제하시겠습니까?',
      description: '이 작업은 되돌릴 수 없습니다.',
      confirmText: '삭제',
      cancelText: '취소',
    });
    addLog(`✅ Confirm 결과: ${result}`);
  };

  // 2. 비동기 처리
  const handleAsyncAlert = async () => {
    addLog('⏳ Alert 열림');
    await alert({
      title: '처리 완료',
      description: '모든 데이터가 성공적으로 저장되었습니다.',
    });
    addLog('✅ Alert 닫힘');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            @pop-kit/okcancel
          </h1>
          <p className="text-gray-500">UI-Agnostic Async Overlay Manager for React</p>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">🚀 기능 테스트</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleConfirm}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600 text-gray-700 rounded-xl transition-all shadow-sm font-medium cursor-pointer"
            >
              Basic Confirm
            </button>
            <button
              onClick={handleAsyncAlert}
              className="px-6 py-3 bg-white border border-gray-200 hover:border-green-500 hover:text-green-600 text-gray-700 rounded-xl transition-all shadow-sm font-medium cursor-pointer"
            >
              Simple Alert
            </button>
          </div>
        </section>

        <section className="bg-gray-900 rounded-2xl p-6 shadow-inner min-h-[200px]">
          <h2 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider">
            Activity Log
          </h2>
          <div className="space-y-2 font-mono text-sm max-h-60 overflow-y-auto">
            {log.length === 0 && (
              <span className="text-gray-600">이벤트 로그가 여기에 표시됩니다.</span>
            )}
            {log.map((msg, i) => (
              <div key={i} className="flex gap-2 animate-fade-in">
                <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span>
                <span className="text-green-400">{msg}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <OkCancelProvider components={shadcnPreset}>
      <DemoContent />
    </OkCancelProvider>
  );
}
