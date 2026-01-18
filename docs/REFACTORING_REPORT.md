# 리팩토링 및 Best Practices 적용 보고서

본 문서는 `@pop-kit/okcancel` 라이브러리의 아키텍처 리팩토링 과정과 Vercel React Best Practices 적용 내역을 정리한 보고서입니다.

---

## 1. 아키텍처 리팩토링 (Layered Architecture)

기존의 단일 구조에서 **3계층 아키텍처**로 분리하여 유지보수성과 확장성을 강화했습니다.

| 계층               | 경로            | 역할 및 책임                                                                                     |
| ------------------ | --------------- | ------------------------------------------------------------------------------------------------ |
| **Core Layer**     | `src/core/`     | **Internal Only**. 상태 관리(`PopManager`) 및 비즈니스 로직 담당. 외부로 노출되지 않음.          |
| **OkCancel Layer** | `src/okcancel/` | **Public API**. `useOkCancel`, `OkCancelProvider` 등 사용자가 직접 사용하는 인터페이스 제공.     |
| **Presets Layer**  | `src/presets/`  | **Batteries-included**. 기본 제공 UI 구현체 (`defaultPreset`). 사용자는 이를 쓰거나 커스텀 가능. |

### 주요 변경 사항

1.  **Variant 지원 (`confirm.destructive()`)**
    - 기존에는 단일 `confirm` 함수만 존재했으나, 이제 `components` 객체 매핑을 통해 다양한 스타일(variant)을 동적으로 지원합니다.
    - TypeScript Generic을 통해 IntelliSense 자동완성을 지원합니다.

2.  **컴포넌트 주입 방식 개선**
    - `OkCancelProvider`가 `components` prop을 받아, 런타임에 사용할 UI 컴포넌트를 결정합니다.
    - 이를 통해 Headless 아키텍처(로직과 UI의 완전한 분리)를 완성했습니다.

---

## 2. Vercel React Best Practices 적용 내역

Vercel 엔지니어링 가이드라인을 기반으로 코드 품질과 성능을 최적화했습니다.

### 2.1 Bundle Size & Tree Shaking (`bundle-barrel-imports`)

- **문제**: Barrel file(`index.ts`)을 통한 재수출(re-export)이 많아, 사용하지 않는 코드까지 번들에 포함될 위험이 있었습니다.
- **해결**: 내부 모듈 간 import 시 Barrel file을 거치지 않고 직접 경로를 참조하도록 수정했습니다.
  - _Before_: `import { usePop } from '../core';`
  - _After_: `import { usePop } from '../core/hooks';`
- **효과**: 트리쉐이킹 효율 향상 및 순환 참조 방지.

### 2.2 비동기 처리 최적화 (`async-defer-await`)

- **문제**: 불필요하게 `await`를 사용하여 워터폴(Waterfall) 현상을 유발하거나, Promise를 즉시 생성하지 않는 패턴이 존재했습니다.
- **해결**: `useOkCancel` 훅 내부에서 Promise 생성과 반환 시점을 명확히 분리하고, 불필요한 대기를 제거했습니다.

### 2.3 렌더링 최적화 (`rerender-memo`)

- **문제**: Context Provider의 value가 매 렌더링마다 새로 생성되어 하위 컴포넌트의 불필요한 리렌더링을 유발할 수 있었습니다.
- **해결**:
  - `OkCancelProvider`: `components` 정규화 로직을 `useMemo`로 감싸 참조 안정성 확보.
  - `useOkCancel`: 훅이 반환하는 API 객체(`{ confirm, alert }`)를 `useMemo`로 메모이제이션.

### 2.4 안전한 조건부 렌더링 (`rendering-conditional-render`)

- **가이드라인 준수**: `&&` 연산자 사용 시 `0`이나 `NaN` 등이 UI에 노출되지 않도록, Boolean 값(`showCloseButton && ...`)에 대해서만 제한적으로 사용하고 있습니다.

---

## 3. Lint & Type Safety 개선

### 3.1 ESLint 규칙 준수

- `lint:fix` 스크립트를 통해 코드 스타일을 일관되게 맞췄습니다.
- 현재 남아있는 일부 `any` 타입 사용은 외부 라이브러리(React 내부 타입 등)와의 호환성을 위해 일시적으로 허용했으나, 추후 개선(`AGENTS.md`에 명시) 예정입니다.

### 3.2 TypeScript Generic 강화

- `useOkCancel<T>` 제네릭을 도입하여, 사용자가 정의한 커스텀 variant가 IDE에서 자동완성되도록 DX(Developer Experience)를 개선했습니다.

---

## 4. 향후 권장 사항 (Next Steps)

1.  **Unit Test 도입**: 현재 수동 테스트에 의존하고 있습니다. Vitest를 도입하여 `PopManager`의 로직을 검증하는 자동화 테스트가 필요합니다.
2.  **Strict Type Check**: `any` 타입을 완전히 제거하고, `unknown`과 Type Guard를 활용하여 타입 안정성을 더욱 강화해야 합니다.
3.  **Documentation**: Storybook 등을 활용하여 Preset 컴포넌트들의 시각적 문서를 제공하면 좋습니다.
