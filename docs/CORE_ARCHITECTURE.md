# 핵심 아키텍처 분석: `@pop-kit/okcancel`

이 문서는 `@pop-kit/okcancel` 라이브러리의 **Headless Core Logic (`src/core`)**에 대한 심층 분석을 제공합니다.
Core는 **UI에 종속되지 않고(UI-agnostic)**, **Promise 기반(Promise-based)**이며, **동시성 모드(Concurrent Mode)에서 안전**하도록 설계되었습니다.

---

## 1. 아키텍처 개요 (Architectural Overview)

이 라이브러리는 **Headless Provider 패턴**을 따릅니다.
즉, **상태 관리(Logic)**와 **렌더링(UI)**을 완전히 분리했습니다.

```
+------------------+        +----------------+        +-----------------+
| Consumer Comp    | -----> |   PopManager   | -----> |      Store      |
| (usePop hook)    | <----- | (Core Logic)   |        | (Array / Map)   |
+------------------+  (1)   +----------------+  (2)   +-----------------+
                                   ^   |                       |
                               (5) |   | (3)                   | (4)
                                   |   v                       v
                            +----------------+        +-----------------+
                            |   Promise      |        |   PopProvider   |
                            | (Pending...)   |        | (Render Layer)  |
                            +----------------+        +-----------------+
                                                               |
                                                               v
                                                      +-----------------+
                                                      | Stacked Overlay |
                                                      |   Components    |
                                                      +-----------------+
```

**(1) `pop.push()`**: 사용자가 팝업 요청
**(2) `push()`**: Store에 인스턴스 추가
**(3) Return**: 대기 상태의 Promise 반환
**(4) Notify**: Provider가 변경 감지 (useSyncExternalStore)
**(5) Resolve**: 사용자가 버튼 클릭 시 Promise 해결 & 팝업 제거

### 주요 구성 요소

1.  **Store (`PopManager`)**: 활성화된 팝업 스택을 관리하는 Vanilla JS 클래스입니다.
2.  **Context (`PopContext`)**: 단일 `PopManager` 인스턴스를 React 트리에 공급합니다.
3.  **Hooks (`usePop`, `usePopState`)**: Store와 상호작용하기 위한 React 바인딩입니다.
4.  **Provider (`PopProvider`)**: Store의 상태를 기반으로 스택에 쌓인 컴포넌트들을 실제로 렌더링합니다.

---

## 2. 상태 관리 전략 (State Management)

### 옵저버 패턴 (Vanilla JS Store)

상태는 유연성과 성능을 위해 React의 렌더링 사이클 외부에서 관리됩니다.
`src/core/store.ts`는 간단한 **옵저버 패턴(Observer Pattern)**을 구현합니다.

- **인스턴스 스택**: `_instances: PopInstance[]`
  - 활성화된 팝업 데이터(ID, 컴포넌트, Props, Resolve/Reject 핸들러)를 담는 배열입니다.
- **리스너**: `_listeners: Set<() => void>`
  - 스택이 변경될 때마다 호출될 함수들입니다.

### 동시성 모드 안전성 (`useSyncExternalStore`)

React 18+의 동시성 기능(Suspense, Transitions 등)을 Tearing(UI 불일치) 없이 지원하기 위해 `useSyncExternalStore`를 사용합니다.

- **이유**: `useEffect` + `useState` 조합은 동시성 업데이트 중에 Tearing을 유발할 수 있습니다.
- **방법**: `usePopState` 훅은 `useSyncExternalStore`를 통해 `PopManager`를 구독합니다.
  - **`subscribe`**: 매니저에 콜백을 등록합니다.
  - **`getSnapshot`**: 현재의 불변 상태(`_instances`)를 반환합니다.

이를 통해 모든 동시 렌더링 과정에서 팝업 스택의 일관성이 보장됩니다.

---

## 3. Promise 기반 흐름 제어 (Flow Control)

핵심 기능은 사용자 상호작용을 `await`로 기다릴 수 있다는 점입니다.

### `push` 메서드 동작 원리

`pop.push(Component, props)`가 호출되면:

1.  **Promise 생성**: 새로운 `Promise`가 만들어집니다.
2.  **인스턴스 생성**: 다음 정보를 담은 `PopInstance` 객체가 생성됩니다.
    - `id`: 고유 식별자.
    - `component`: 렌더링할 React 컴포넌트.
    - `props`: 컴포넌트에 전달할 Props.
    - **`resolve` / `reject`**: Promise를 해결(settle)할 함수들.
3.  **Store 업데이트**: 인스턴스가 `_instances` 배열에 추가됩니다.
4.  **알림(Notify)**: 리스너(React 컴포넌트)들에게 리렌더링을 알립니다.
5.  **Promise 반환**: 호출자에게 Promise를 반환합니다.

### 해결 (Resolution)

사용자가 상호작용(예: "확인" 버튼 클릭)을 하면:

1.  컴포넌트가 주입받은 `props.resolve(value)`를 호출합니다.
2.  `PopManager`의 `resolve` 래퍼 함수가 실행됩니다:
    - 스택에서 해당 인스턴스를 제거합니다.
    - 원래의 Promise를 `value`와 함께 resolve 합니다.
3.  React가 리렌더링되면서 팝업이 사라지고, 호출자 코드의 `await`가 완료됩니다.

---

## 4. API 명세 (API Specification)

### `PopManager` (Interface)

| 메서드            | 시그니처                                  | 설명                                                       |
| :---------------- | :---------------------------------------- | :--------------------------------------------------------- |
| **`push`**        | `<P, R>(Component, props?) => Promise<R>` | 컴포넌트를 스택에 추가하고 Promise를 반환합니다.           |
| **`pop`**         | `(id?) => void`                           | 특정 팝업(또는 최상단)을 제거하고 Promise를 reject 합니다. |
| **`getSnapshot`** | `() => PopInstance[]`                     | 현재 스택을 반환합니다 (`useSyncExternalStore`용).         |
| **`subscribe`**   | `(cb) => Unsubscribe`                     | 상태 변경을 구독합니다.                                    |

### `PopInstance` (Type)

```typescript
interface PopInstance<TProps = unknown, TResult = unknown> {
  id: string;
  component: React.ComponentType<TProps>;
  props: TProps; // Manager가 주입한 `resolve` 함수 포함
  resolve: (result: TResult) => void;
  reject: (reason?: unknown) => void;
  createdAt: number;
}
```

---

## 5. 확장성 (Headless)

`PopManager`는 **어떤 React 컴포넌트**든 받을 수 있으므로, 사용자는 자신만의 UI 라이브러리를 주입할 수 있습니다.

### 예제: Shadcn/UI와 함께 사용하기

```tsx
import { AlertDialog } from '@/components/ui/alert-dialog';

const ShadcnConfirm = ({ resolve, title }: { resolve: (v: boolean) => void; title: string }) => (
  <AlertDialog open onOpenChange={(open) => !open && resolve(false)}>
    {/* ... 내용 ... */}
    <Button onClick={() => resolve(true)}>확인</Button>
  </AlertDialog>
);

// 사용
const result = await pop.push(ShadcnConfirm, { title: '삭제하시겠습니까?' });
```

Core 로직은 **마운트, 언마운트, Promise 해결**만 담당하고, **렌더링과 스타일링**은 전적으로 사용자가 제어합니다.
