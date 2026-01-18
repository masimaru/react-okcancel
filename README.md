# @pop-kit/okcancel

[![npm version](https://badge.fury.io/js/@pop-kit/okcancel.svg)](https://www.npmjs.com/package/@pop-kit/okcancel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blue?style=flat&logo=stackblitz)](https://stackblitz.com/edit/vitejs-vite-wszi61bn?file=src%2FApp.tsx)

**React + TypeScript 기반의 비동기 UI 인터랙션 라이브러리 (Headless & Logic-First)**입니다.
`confirm`, `alert` 뿐만 아니라 다양한 오버레이(Sheet, Toast 등)를 `await` 함수 호출로 제어할 수 있습니다.

## ✨ 주요 특징

- **Promise 기반 로직** - `await confirm()` 한 줄로 복잡한 상태 관리 대체
- **Headless 아키텍처** - UI와 로직의 완전한 분리, Shadcn/MUI 등 어떤 스타일과도 호환
- **DX (개발자 경험) 중심** - 자동 로딩 상태 관리, TypeScript 지원
- **AI-Native** - Cursor, Copilot 등 AI가 코드를 작성하기 쉬운 구조
- **Variant 지원** - `confirm.destructive()`, `alert.success()` 등 다양한 스타일 정의 가능

## 📦 설치

```bash
npm install @pop-kit/okcancel
```

## 🎮 Live Demo

[**StackBlitz에서 바로 체험하기**](https://stackblitz.com/edit/vitejs-vite-wszi61bn?file=src%2FApp.tsx)

## 🚀 빠른 시작

```tsx
import { OkCancelProvider, useOkCancel, defaultPreset } from '@pop-kit/okcancel';

function MyComponent() {
  const { confirm, alert } = useOkCancel();

  const handleDelete = async () => {
    const confirmed = await confirm({
      title: '삭제 확인',
      description: '정말로 이 항목을 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
    });

    if (confirmed) {
      await alert({
        title: '완료',
        description: '항목이 성공적으로 삭제되었습니다.',
      });
    }
  };

  return <button onClick={handleDelete}>항목 삭제</button>;
}

function App() {
  return (
    // defaultPreset을 사용하여 기본 UI 제공
    <OkCancelProvider components={defaultPreset}>
      <MyComponent />
    </OkCancelProvider>
  );
}
```

## 📖 고급 사용법: Variants (테마/스타일 확장)

다양한 상황에 맞는 다이얼로그 스타일을 미리 정의하고 사용할 수 있습니다.

### 1. 컴포넌트 정의

```tsx
import { ConfirmDialogProps, OkCancelProvider } from '@pop-kit/okcancel';
import { defaultPreset } from '@pop-kit/okcancel';

// 1. 빨간색 삭제 전용 다이얼로그
function DestructiveConfirm({ title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="bg-red-50 border-red-500 border p-4 rounded">
      <h3 className="text-red-700 font-bold">{title}</h3>
      <p>{description}</p>
      <button onClick={onCancel}>취소</button>
      <button onClick={onConfirm} className="bg-red-600 text-white">
        삭제
      </button>
    </div>
  );
}

// 2. 컴포넌트 맵 구성 (as const 필수!)
const components = {
  confirm: {
    default: defaultPreset.confirm,
    destructive: DestructiveConfirm, // variant 추가
  },
  alert: defaultPreset.alert,
} as const;

// 3. Provider에 주입
function App() {
  return (
    <OkCancelProvider components={components}>
      <AppContent />
    </OkCancelProvider>
  );
}
```

### 2. 사용 (IntelliSense 지원)

```tsx
function AppContent() {
  // 제네릭으로 컴포넌트 타입 전달 (선택 사항이지만 권장)
  const { confirm } = useOkCancel<typeof components>();

  const handleDelete = async () => {
    // 자동으로 .destructive()가 자동완성됩니다!
    const ok = await confirm.destructive({
      title: '정말 삭제하시겠습니까?',
      description: '돌이킬 수 없습니다!',
    });

    if (ok) {
      // ...
    }
  };
}
```

## 📖 함수 설명

### `confirm(options: ConfirmOptions): Promise<boolean>`

확인/취소 버튼이 있는 확인 다이얼로그를 표시합니다.

#### 옵션

| 옵션                | 타입        | 기본값   | 설명                                  |
| ------------------- | ----------- | -------- | ------------------------------------- |
| `title`             | `ReactNode` | -        | 다이얼로그 제목                       |
| `description`       | `ReactNode` | -        | 다이얼로그 내용/메시지                |
| `confirmText`       | `ReactNode` | `'확인'` | 확인 버튼 텍스트                      |
| `cancelText`        | `ReactNode` | `'취소'` | 취소 버튼 텍스트                      |
| `canCloseOnOverlay` | `boolean`   | `true`   | 오버레이 클릭으로 닫기 허용           |
| `canCloseOnEsc`     | `boolean`   | `true`   | Escape 키로 닫기 허용                 |
| `showCloseButton`   | `boolean`   | `false`  | 오른쪽 상단 X 버튼 표시               |
| `enableAnimation`   | `boolean`   | `true`   | 다이얼로그 슬라이드 애니메이션 활성화 |

#### 반환값

- `true` 사용자가 확인 버튼을 클릭한 경우
- `false` 사용자가 취소 버튼을 클릭하거나, Escape를 누르거나, 오버레이를 클릭한 경우

#### 예제

```tsx
const result = await confirm({
  title: '저장 확인',
  description: (
    <div>
      <p>변경사항을 저장하시겠습니까?</p>
      <p>
        <strong>주의:</strong> 이 작업은 되돌릴 수 없습니다.
      </p>
    </div>
  ),
  confirmText: '저장',
  cancelText: '취소',
  canCloseOnOverlay: false, // 실수로 닫히는 것 방지
  showCloseButton: true, // X 버튼 표시
  enableAnimation: false, // 애니메이션 비활성화
});

if (result) {
  console.log('사용자가 저장을 확인했습니다');
} else {
  console.log('사용자가 저장을 취소했습니다');
}
```

### `alert(options: AlertOptions): Promise<void>`

확인 버튼만 있는 알림 다이얼로그를 표시합니다.

#### 옵션

| 옵션                | 타입        | 기본값   | 설명                                  |
| ------------------- | ----------- | -------- | ------------------------------------- |
| `title`             | `ReactNode` | -        | 다이얼로그 제목                       |
| `description`       | `ReactNode` | -        | 다이얼로그 내용/메시지                |
| `confirmText`       | `ReactNode` | `'확인'` | 확인 버튼 텍스트                      |
| `canCloseOnOverlay` | `boolean`   | `true`   | 오버레이 클릭으로 닫기 허용           |
| `canCloseOnEsc`     | `boolean`   | `true`   | Escape 키로 닫기 허용                 |
| `showCloseButton`   | `boolean`   | `false`  | 오른쪽 상단 X 버튼 표시               |
| `enableAnimation`   | `boolean`   | `true`   | 다이얼로그 슬라이드 애니메이션 활성화 |

#### 반환값

- `undefined` 다이얼로그가 닫힐 때 (닫힌 방법과 관계없이)

#### 예제

```tsx
await alert({
  title: '성공',
  description: '파일이 성공적으로 업로드되었습니다.',
  confirmText: '확인',
});

console.log('사용자가 알림을 확인했습니다');
```

## 🎨 커스터마이징

CSS 변수를 재정의하여 모양을 커스터마이징할 수 있습니다:

```css
:root {
  /* 다이얼로그 */
  --okcancel-dialog-bg: #fff;
  --okcancel-dialog-border-radius: 8px;
  --okcancel-dialog-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 8px 10px -6px rgb(0 0 0 / 10%);
  --okcancel-dialog-max-width: none;
  --okcancel-dialog-min-width: auto;
  --okcancel-dialog-max-height: none;
  --okcancel-dialog-min-height: auto;
  --okcancel-dialog-width: 500px;
  --okcancel-dialog-height: max-content;
  --okcancel-dialog-padding: 16px 24px;
  --okcancel-dialog-border: none;

  /* 다이얼로그 콘텐츠 */
  --okcancel-content-padding: 0;
  --okcancel-content-gap: 8px;
  --okcancel-content-flex-direction: column;
  --okcancel-content-justify-content: center;
  --okcancel-content-align-items: normal;
  --okcancel-content-height: auto;
  --okcancel-content-max-height: none;
  --okcancel-content-min-height: 100px;

  /* 제목 */
  --okcancel-title-font-size: 20px;
  --okcancel-title-color: #222;
  --okcancel-title-font-weight: 600;

  /* 설명 */
  --okcancel-description-font-size: 16px;
  --okcancel-description-color: #8e8e8e;
  --okcancel-description-font-weight: 400;

  /* 버튼 컨테이너 */
  --okcancel-btn-box-padding: 10px 0;
  --okcancel-btn-box-gap: 12px;
  --okcancel-btn-box-flex-direction: row;
  --okcancel-btn-box-justify-content: flex-end;
  --okcancel-btn-box-align-items: center;
  --okcancel-btn-box-height: auto;

  /* 버튼 */
  --okcancel-button-padding: 8px 16px;
  --okcancel-button-border-radius: 6px;
  --okcancel-button-width: 100px;
  --okcancel-button-height: 40px;
  --okcancel-button-max-width: none;
  --okcancel-button-min-width: auto;
  --okcancel-button-border: none;
  --okcancel-button-box-shadow: none;
  --okcancel-button-font-size: 16px;
  --okcancel-button-font-weight: 500;
  --okcancel-button-text-align: center;
  --okcancel-button-flex: 0 1 auto;

  /* 주 버튼 (확인) */
  --okcancel-button-primary-bg: #2c89e5;
  --okcancel-button-primary-color: #fff;
  --okcancel-button-primary-border: none;

  /* 보조 버튼 (취소) */
  --okcancel-button-secondary-bg: transparent;
  --okcancel-button-secondary-color: #222;
  --okcancel-button-secondary-border: 1px solid #d4d4d4;

  /* 오버레이 */
  --okcancel-overlay-bg: rgb(0 0 0 / 50%);
  --okcancel-z-index: 1000;
}
```

### 반응형 커스터마이징

모바일에서는 자동으로 다음과 같이 조정됩니다:

- 다이얼로그 너비: 화면의 85%
- 버튼 간격: 더 넓게 조정
- 버튼: 전체 너비로 확장

모바일 스타일을 커스터마이징하려면:

```css
@media (width < 640px) {
  :root {
    --okcancel-dialog-width: 90%; /* 모바일 너비 조정 */
    --okcancel-btn-box-gap: 16px; /* 버튼 간격 조정 */
    --okcancel-button-flex: 1; /* 버튼 전체 너비 */
    --okcancel-btn-box-flex-direction: column; /* 버튼 세로 배치 */
  }
}
```

## ♿ 접근성 기능

- **ARIA 역할**: 적절한 `dialog` 및 `alertdialog` 역할
- **포커스 관리**: 확인 버튼에 자동 포커스, 포커스 트래핑
- **키보드 내비게이션**:
  - `Tab` / `Shift+Tab`으로 버튼 간 이동
  - `Enter` / `Space`로 포커스된 버튼 활성화
  - `Escape`로 다이얼로그 닫기 (활성화된 경우)
- **스크린 리더 지원**: 적절한 라벨링 및 알림

## 🔧 고급 사용법

### JSX를 사용한 커스텀 콘텐츠

```tsx
const result = await confirm({
  title: '파일 삭제',
  description: (
    <div>
      <p>다음 파일들을 삭제하시겠습니까?</p>
      <ul>
        <li>document.pdf</li>
        <li>image.jpg</li>
        <li>data.json</li>
      </ul>
      <p>
        <strong>경고:</strong> 이 작업은 되돌릴 수 없습니다.
      </p>
    </div>
  ),
  confirmText: '삭제',
  cancelText: '취소',
});
```
