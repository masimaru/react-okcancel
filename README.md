# @pop-kit/okcancel

[![npm version](https://badge.fury.io/js/@pop-kit/okcancel.svg)](https://www.npmjs.com/package/@pop-kit/okcancel)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**React 기반의 UI-Agnostic 비동기 오버레이 관리자**입니다.  
`confirm`, `alert` 로직을 비즈니스 로직에서 분리하여 `await` 한 줄로 우아하게 제어하세요.

---

## ✨ 주요 특징

- **UI-Agnostic (Headless)** - UI를 강제하지 않습니다. shadcn/ui, MUI, 또는 직접 만든 컴포넌트 등 무엇이든 주입하여 사용할 수 있습니다.
- **Promise 기반 흐름** - 상태 지옥(isOpen, setOpen)에서 벗어나 `const ok = await confirm()` 코드를 통해 선형적인 로직을 작성합니다.
- **IntelliSense 지원** - `confirm.destructive()`, `alert.success()` 등 사용자 정의 변형(Variant)에 대한 완벽한 자동완성을 지원합니다.
- **shadcn/ui 프리셋 제공** - 별도의 패키지 설치 없이 CLI 명령어로 프로젝트에 바로 다이얼로그 프리셋을 추가할 수 있습니다.

---

## 📦 설치

### 1. Core 라이브러리 설치

```bash
npm install @pop-kit/okcancel
```

### 2. shadcn/ui 프리셋 추가 (선택 사항)

가장 인기 있는 shadcn/ui 기반의 프리셋을 프로젝트에 즉시 추가할 수 있습니다.

```bash
npx shadcn@latest add "https://raw.githubusercontent.com/[USER]/react-okcancel/main/registry.json"
```

_설치 후 `components/ui/ok-cancel/` 폴더에 다이얼로그 컴포넌트들이 생성됩니다._

---

## 🚀 사용 가이드 (Usage)

### 1. Provider 설정 (Setup)

`OkCancelProvider`에 UI 컴포넌트를 주입하여 초기화합니다. `as const`를 사용하여 컴포넌트 맵을 정의하면 나중에 호출할 때 완벽한 자동완성(IntelliSense)이 지원됩니다.

```tsx
import { OkCancelProvider } from '@pop-kit/okcancel';
import { ConfirmDialog, SimpleAlertDialog } from '@/components/ui/ok-cancel';

// 🛠️ 컴포넌트 구성 (단일 또는 여러 스타일 조합 가능)
const components = {
  alert: SimpleAlertDialog, // 1. 단일 컴포넌트 주입
  confirm: {
    // 2. 여러 스타일(Variants) 주입
    default: ConfirmDialog,
    destructive: DestructiveConfirm, // confirm.destructive()로 호출 가능
  },
} as const;

function App() {
  return (
    <OkCancelProvider components={components}>
      <YourApp />
    </OkCancelProvider>
  );
}
```

### 2. Hook 사용 (Hooks)

`useOkCancel`을 사용하여 사용자 인터랙션을 기다립니다. 기본적인 호출과 미리 정의한 변형(Variant) 호출이 모두 가능합니다.

```tsx
import { useOkCancel } from '@pop-kit/okcancel';

function MyComponent() {
  // 정의한 components 타입을 전달하면 자동완성이 지원됩니다.
  const { confirm, alert } = useOkCancel<typeof components>();

  const handleAction = async () => {
    // 💡 기본적인 confirm 호출
    const ok = await confirm({
      title: '삭제하시겠습니까?',
      description: '이 작업은 되돌릴 수 없습니다.',
    });

    if (ok) {
      // 💡 미리 정의한 'destructive' 변형 호출 (IntelliSense 지원)
      const forceDelete = await confirm.destructive({
        title: '정말 강제로 삭제할까요?',
        confirmText: '강제 삭제',
      });

      if (forceDelete) {
        await deleteItem();
        await alert({ title: '삭제 성공!' });
      }
    }
  };

  return <button onClick={handleAction}>삭제</button>;
}
```

### 3. 커스텀 컴포넌트 만들기 (Custom Components)

Headless 라이브러리이므로 UI는 자유롭게 정의할 수 있습니다. 단, 라이브러리가 `await` 로직을 제어하기 위해 **반드시 제공된 Props 타입(`ConfirmDialogProps`, `AlertDialogProps`)을 사용해야 합니다.**

#### 확인 다이얼로그 (`ConfirmDialogProps`)

`onConfirm`과 `onCancel`을 모두 받아 `boolean` 결과를 반환합니다.

```tsx
import type { ConfirmDialogProps } from '@pop-kit/okcancel';

export function MyConfirm({ title, description, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <div className="modal">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onCancel}>취소</button>
      <button onClick={onConfirm}>확인</button>
    </div>
  );
}
```

#### 알림 다이얼로그 (`AlertDialogProps`)

`onConfirm`만 받아 작업을 완료하고 `void`를 반환합니다.

```tsx
import type { AlertDialogProps } from '@pop-kit/okcancel';

export function MyAlert({ title, description, onConfirm }: AlertDialogProps) {
  return (
    <div className="alert">
      <h2>{title}</h2>
      <p>{description}</p>
      <button onClick={onConfirm}>닫기</button>
    </div>
  );
}
```

---

## ⚖️ License

MIT License. 자유롭게 사용하고 기여해 주세요!
