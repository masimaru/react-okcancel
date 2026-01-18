# 🏗️ @pop-kit/okcancel 리팩토링 계획

## 1. 아키텍처 개요

```
┌───────────────────────────────────────────────────────┐
│                    사용자 영역                          │
│   const { confirm, alert } = useOkCancel();           │
│   await confirm.destructive({ title: '삭제?' });       │
└───────────────────────────────────────────────────────┘
                          ▲
                          │ (Public API)
┌───────────────────────────────────────────────────────┐
│              OkCancel Layer (✅ 외부 노출)              │
│   - OkCancelProvider                                  │
│   - useOkCancel() → { confirm, alert }                │
│   - 타입 정의 (ConfirmDialogProps, AlertDialogProps)   │
└───────────────────────────────────────────────────────┘
                          ▲
                          │ (Internal - 비노출)
┌───────────────────────────────────────────────────────┐
│              Core Layer (🔒 내부 전용)                  │
│   - PopManager (push, pop, resolve, reject)           │
│   - Generic component stack 관리                       │
└───────────────────────────────────────────────────────┘
```

### 핵심 원칙

1. **Core는 숨김**: `usePop()`, `PopProvider` 등 외부 노출 안 함
2. **OkCancel만 노출**: `OkCancelProvider`, `useOkCancel()`만 export
3. **Component 주입 방식**: 사용자가 UI 컴포넌트를 Provider에 주입
4. **Variant 지원**: `confirm.default`, `confirm.destructive` 등 여러 변형

---

## 2. 사용자 경험 (Target API)

### 2.1 Provider 설정

#### 간단한 형식 (Variant 없을 때)

```tsx
// ✅ 가장 간단한 설정 - 컴포넌트만 바로 전달
const components = {
  confirm: DefaultConfirm,
  alert: DefaultAlert,
};

<OkCancelProvider components={components}>
  <MyApp />
</OkCancelProvider>
```

#### 확장 형식 (Variant 사용할 때)

```tsx
import { DefaultConfirm, DestructiveConfirm } from './dialogs/confirm';
import { DefaultAlert, SuccessAlert, ErrorAlert } from './dialogs/alert';

const components = {
  confirm: {
    default: DefaultConfirm,       // ✅ 필수
    destructive: DestructiveConfirm, // 선택
  },
  alert: {
    default: DefaultAlert,         // ✅ 필수
    success: SuccessAlert,         // 선택
    error: ErrorAlert,             // 선택
  },
} as const;  // ⚠️ IntelliSense를 위해 as const 필수!

<OkCancelProvider components={components}>
  <MyApp />
</OkCancelProvider>
```

#### 혼합 형식 (일부만 Variant)

```tsx
// confirm은 variant 사용, alert은 기본만
const components = {
  confirm: {
    default: DefaultConfirm,
    destructive: DestructiveConfirm,
  },
  alert: DefaultAlert,  // ✅ 간단한 형식도 OK
};
```

### 2.2 Hook 사용

```tsx
import { useOkCancel } from '@pop-kit/okcancel';

function DeleteButton() {
  const { confirm, alert } = useOkCancel();

  const handleDelete = async () => {
    // 기본 confirm
    const ok = await confirm({ title: '확인하시겠습니까?' });
    
    // destructive variant (삭제용)
    const ok = await confirm.destructive({ 
      title: '정말 삭제하시겠습니까?',
      description: '이 작업은 되돌릴 수 없습니다.',
    });

    if (ok) {
      await api.delete();
      await alert.success({ title: '삭제 완료!' });
    }
  };
}
```

---

## 3. 컴포넌트 Props 인터페이스

### 3.1 ConfirmDialogProps

```tsx
export interface ConfirmDialogProps {
  // Content
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;   // 기본값: '확인'
  cancelText?: ReactNode;    // 기본값: '취소'
  
  // Actions - 라이브러리가 주입, 개발자는 버튼에 연결만
  onConfirm: () => void;
  onCancel: () => void;
}
```

### 3.2 AlertDialogProps

```tsx
export interface AlertDialogProps {
  // Content
  title?: ReactNode;
  description?: ReactNode;
  confirmText?: ReactNode;   // 기본값: '확인'
  
  // Actions - 라이브러리가 주입
  onConfirm: () => void;
}
```

---

## 4. 개발자가 만들 컴포넌트 예시

### 4.1 ConfirmDialog (shadcn/ui 사용)

```tsx
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import type { ConfirmDialogProps } from '@pop-kit/okcancel';

export function DefaultConfirm({
  title,
  description,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 4.2 DestructiveConfirm (삭제용)

```tsx
export function DestructiveConfirm({
  title,
  description,
  confirmText = '삭제',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open>
      <AlertDialogContent>
        <AlertDialogTitle className="text-red-600">
          {title}
        </AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## 5. 타입 시스템 설계

### 5.1 Components 타입 (두 형식 지원)

```tsx
import type { ComponentType } from 'react';

// 컴포넌트 직접 전달 또는 { default, ...variants } 객체
type ComponentOrVariants<TProps> =
  | ComponentType<TProps>  // 간단한 형식
  | {                      // 확장 형식
      default: ComponentType<TProps>;
      [variant: string]: ComponentType<TProps>;
    };

export interface OkCancelComponents {
  confirm: ComponentOrVariants<ConfirmDialogProps>;
  alert: ComponentOrVariants<AlertDialogProps>;
}
```

### 5.2 내부 정규화 함수

```tsx
// Provider 내부에서 통일된 형태로 변환
type NormalizedComponents = {
  confirm: { default: ComponentType<ConfirmDialogProps>; [k: string]: ComponentType<ConfirmDialogProps> };
  alert: { default: ComponentType<AlertDialogProps>; [k: string]: ComponentType<AlertDialogProps> };
};

function normalizeComponents(components: OkCancelComponents): NormalizedComponents {
  return {
    confirm: typeof components.confirm === 'function'
      ? { default: components.confirm }
      : components.confirm,
    alert: typeof components.alert === 'function'
      ? { default: components.alert }
      : components.alert,
  };
}
```

### 5.3 IntelliSense 지원 (제네릭)

```tsx
// Provider 타입이 Hook까지 전달되어 자동완성 지원
function useOkCancel<T extends OkCancelComponents>(): {
  confirm: ConfirmFn & { [K in keyof T['confirm']]: ConfirmFn };
  alert: AlertFn & { [K in keyof T['alert']]: AlertFn };
};

// 사용 시:
const { confirm } = useOkCancel();
confirm.  // ← IntelliSense: default, destructive, ...
```

---

## 6. 파일 구조

```
src/
├── index.ts                    # Public exports
│
├── core/                       # 🔒 Internal (export 안 함)
│   ├── store.ts                # PopManager 구현
│   ├── context.tsx             # 내부 Context
│   ├── hooks.ts                # 내부 hooks
│   └── types.ts                # 내부 타입
│
├── okcancel/                   # ✅ Public Layer
│   ├── index.ts                # 모듈 export
│   ├── provider.tsx            # OkCancelProvider
│   ├── context.tsx             # OkCancel Context
│   ├── hooks.ts                # useOkCancel
│   └── types.ts                # Public 타입 정의
│
└── presets/                    # 기본 제공 preset
    └── default/
        ├── index.ts
        ├── ConfirmDialog.tsx
        └── AlertDialog.tsx
```

---

## 7. Export 정리

```tsx
// src/index.ts

// Provider & Hook
export { OkCancelProvider } from './okcancel/provider';
export { useOkCancel } from './okcancel/hooks';

// Types (사용자가 컴포넌트 만들 때 필요)
export type { 
  ConfirmDialogProps,
  AlertDialogProps,
  ConfirmOptions,
  AlertOptions,
  OkCancelComponents,
} from './okcancel/types';

// 기본 Preset (선택적 사용)
export { defaultPreset } from './presets/default';

// ❌ Core는 export 안 함!
// export { usePop } from './core/hooks';
// export { PopProvider } from './core/provider';
```

---

## 8. 구현 단계

### Phase 1: 타입 정의
- [ ] `okcancel/types.ts` - Props, Options, Components 타입

### Phase 2: Core 리팩토링
- [ ] 기존 core 코드 정리 (외부 노출 제거)
- [ ] PopManager가 onConfirm/onCancel 주입하도록 수정

### Phase 3: OkCancel Layer
- [ ] `OkCancelProvider` 구현 (components prop)
- [ ] `useOkCancel` 구현 (variant 지원)
- [ ] IntelliSense를 위한 제네릭 타입

### Phase 4: Default Preset
- [ ] 기본 ConfirmDialog, AlertDialog 구현
- [ ] preset export

### Phase 5: 문서화
- [ ] README 업데이트
- [ ] 사용 예시 코드
- [ ] AI Context (llm.md)

---

## 9. 설계 결정 요약

| 항목 | 결정 | 이유 |
|------|------|------|
| Core 노출 | ❌ 안 함 | 단순한 API 제공 |
| Props 방식 | `onConfirm/onCancel` | 명확한 의미, UI 자유도 |
| Variant 지원 | `confirm.destructive()` | 다양한 UI 스타일 지원 |
| 필수 속성 | `default` | 최소 동작 보장 |
| IntelliSense | `as const` + 제네릭 | DX 향상 |
| 컴포넌트 주입 | 간단/확장 형식 둘 다 지원 | 유연한 설정 |

---

## 10. ⚠️ 구현 시 주의사항

### 10.1 타입 안전성 최우선

```tsx
// ❌ Bad: any 사용 금지
const Component = components.confirm[variant] as any;

// ✅ Good: 타입 가드 사용
const Component = components.confirm[variant];
if (!Component) {
  console.warn(`Unknown variant: ${variant}`);
  return components.confirm.default;
}
```

### 10.2 제네릭 타입 유지

- Provider에서 받은 `components` 타입이 Context → Hook까지 **그대로 전달**되어야 IntelliSense 작동
- 중간에 타입이 `OkCancelComponents`로 넓어지면 variant 자동완성 불가

```tsx
// ❌ Bad: 타입 소실
const OkCancelContext = createContext<{ components: OkCancelComponents } | null>(null);

// ✅ Good: 제네릭 유지
const OkCancelContext = createContext<OkCancelContextValue<any> | null>(null);
// + useOkCancel에서 타입 추론
```

### 10.3 함수 vs 객체 분기 처리

```tsx
// components.confirm이 함수인지 객체인지 반드시 체크
if (typeof components.confirm === 'function') {
  // 간단한 형식: { default: components.confirm }로 정규화
} else {
  // 확장 형식: 그대로 사용
}
```

### 10.4 런타임 안전장치

```tsx
// 1. 존재하지 않는 variant 호출 시 fallback
const getComponent = (type: 'confirm' | 'alert', variant: string) => {
  const normalized = normalizeComponents(components);
  return normalized[type][variant] ?? normalized[type].default;
};

// 2. Development 모드에서 경고
if (process.env.NODE_ENV === 'development') {
  if (!normalized[type][variant]) {
    console.warn(`[@pop-kit/okcancel] Unknown ${type} variant: "${variant}". Using default.`);
  }
}
```

### 10.5 테스트 필수 항목

- [ ] 간단한 형식 (`confirm: Component`) 정상 동작
- [ ] 확장 형식 (`confirm: { default, destructive }`) 정상 동작
- [ ] 혼합 형식 정상 동작
- [ ] 존재하지 않는 variant 호출 시 default fallback
- [ ] TypeScript 자동완성 (IntelliSense) 동작 확인
- [ ] `onConfirm`, `onCancel` 콜백 정상 주입
