import { useState } from 'react';
import { OkCancelProvider, useOkCancel } from './index';
import './App.scss';

function DemoComponent() {
  const { confirm, alert, toast } = useOkCancel();
  const [result, setResult] = useState<string>('');

  const handleConfirm = async () => {
    const confirmed = await confirm({
      title: '삭제 확인',
      description: '정말로 이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
      kind: 'danger',
    });
    setResult(`확인 결과: ${confirmed ? '승인' : '취소'}`);
  };

  const handleAlert = async () => {
    await alert({
      title: '성공!',
      description: '작업이 성공적으로 완료되었습니다.',
      kind: 'success',
    });
    setResult('알림이 표시되었습니다.');
  };

  const handleToastSuccess = () => {
    toast.success({
      title: '성공',
      description: '작업이 완료되었습니다.',
    });
    setResult('성공 토스트가 표시되었습니다.');
  };

  const handleToastError = () => {
    toast.error({
      title: '오류 발생',
      description: '요청을 처리하는 중 문제가 발생했습니다.',
    });
    setResult('오류 토스트가 표시되었습니다.');
  };

  const handleToastInfo = () => {
    toast.info({
      title: '정보',
      description: '새로운 업데이트가 사용 가능합니다.',
    });
    setResult('정보 토스트가 표시되었습니다.');
  };

  const handleMultipleToasts = () => {
    toast.success({ title: '첫 번째', description: '첫 번째 토스트입니다.' });
    setTimeout(() => {
      toast.error({ title: '두 번째', description: '두 번째 토스트입니다.' });
    }, 500);
    setTimeout(() => {
      toast.info({ title: '세 번째', description: '세 번째 토스트입니다.' });
    }, 1000);
    setResult('여러 토스트가 순차적으로 표시됩니다.');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>React OkCancel 라이브러리 데모</h1>

      <div style={{ marginBottom: '2rem' }}>
        <h2>확인 다이얼로그 (Confirm)</h2>
        <p>사용자의 확인이 필요한 작업에 사용합니다. Promise&lt;boolean&gt;을 반환합니다.</p>
        <button onClick={handleConfirm} style={{ marginRight: '1rem' }}>
          삭제 확인 다이얼로그 열기
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>알림 다이얼로그 (Alert)</h2>
        <p>사용자에게 중요한 정보를 전달할 때 사용합니다. Promise&lt;void&gt;를 반환합니다.</p>
        <button onClick={handleAlert} style={{ marginRight: '1rem' }}>
          성공 알림 다이얼로그 열기
        </button>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>토스트 알림 (Toast)</h2>
        <p>비차단형 피드백을 제공합니다. 자동으로 사라집니다.</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleToastSuccess}>성공 토스트</button>
          <button onClick={handleToastError}>오류 토스트</button>
          <button onClick={handleToastInfo}>정보 토스트</button>
          <button onClick={handleMultipleToasts}>여러 토스트</button>
        </div>
      </div>

      {result && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px',
            marginTop: '2rem',
          }}
        >
          <strong>결과:</strong> {result}
        </div>
      )}

      <div
        style={{
          marginTop: '3rem',
          padding: '1rem',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
        }}
      >
        <h3>사용법</h3>
        <pre
          style={{
            backgroundColor: '#f9fafb',
            padding: '1rem',
            overflow: 'auto',
          }}
        >
          {`// Provider로 앱을 감싸주세요
<OkCancelProvider>
  <App />
</OkCancelProvider>

// 컴포넌트에서 사용
const { confirm, alert, toast } = useOkCancel();

// 확인 다이얼로그
const confirmed = await confirm({
  title: '삭제 확인',
  description: '정말 삭제하시겠습니까?',
  kind: 'danger'
});

// 알림 다이얼로그  
await alert({
  title: '완료',
  description: '작업이 완료되었습니다.'
});

// 토스트
toast.success({ title: '성공!', description: '저장되었습니다.' });
toast.error({ title: '오류', description: '실패했습니다.' });`}
        </pre>
      </div>
    </div>
  );
}

function App() {
  return (
    <OkCancelProvider>
      <DemoComponent />
    </OkCancelProvider>
  );
}

export default App;
