# 🚀 Project: @pop-kit/okcancel (formerly react-okcancel)

## 1. 핵심 컨셉 (Core Concept)

> **"Just Pop it."**
> **"Logic-First, UI-Agnostic"**  
> **shadcn/ui의 디자인(UI)**과 **Promise 기반의 명령형 로직(Logic)**을 결합하여, 리액트 개발자의 상태 관리 피로도를 제거하는 **"Headless Overlay Manager"**

- **기존 문제:** 모달 하나 띄우기 위해 `useState`, `useEffect`, `isLoading` 등 보일러플레이트 코드가 너무 많음.
- **해결책:** `await confirm()` 한 줄로 **UI 표시 + 사용자 입력 대기 + 비동기 처리**를 통합.

---

## 2. 개발 철학 (Philosophy)

1. **Return Value 중심:** Promise는 반드시 **"받아올 데이터(응답값)"**가 있을 때만 사용한다. (단순 표시용은 지양)
2. **Pragmatic React:** UI 렌더링은 선언형(Declarative)으로 하되, 비즈니스 흐름(Flow)은 명령형(Imperative)으로 처리하여 가독성을 높인다.
3. **DX(개발자 경험) 최우선:** 로딩 처리, 폼 입력, 유효성 검사 등 "귀찮은 작업"을 라이브러리가 대신한다.

---

## 3. 기능 범위 (Scope Definition)

### ✅ 핵심 기능 (Must Have)

| 기능           | 역할        | 반환값 (Return Type)   | 특징                                                  |
| -------------- | ----------- | ---------------------- | ----------------------------------------------------- |
| **Confirm**    | 의사 결정   | `boolean` (true/false) | 비동기 로딩(Spinner) 자동 처리                        |
| **Prompt**     | 데이터 입력 | `string`               | 유효성 검사(Validation) 포함                          |
| **Form Sheet** | 복합 입력   | `object` (Form Data)   | **필터, 수정, 설정** 등 "값을 받아오는 용도"로만 제한 |
| **Preset**     | UI 연결     | -                      | shadcn/ui 컴포넌트를 자동 조립해주는 어댑터 제공      |

### 🔺 선택/보류 (Optional)

| 기능            | 이유                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Toast**       | 상태 관리가 귀찮아서 넣을 순 있으나, `await`(기다림)가 필요 없으므로 핵심 로직과는 다름. (Fire-and-forget 방식)                 |
| **Push Layout** | 사이드 시트 등장 시 본문을 밀어내는 효과. **Admin/SaaS** 타겟이라면 킬러 기능이지만, 일반 쇼핑몰엔 불필요. (고급 옵션으로 고려) |

### ❌ 제외 (Out of Scope)

| 기능          | 이유                                                                                  |
| ------------- | ------------------------------------------------------------------------------------- |
| **Nav Sheet** | 단순 메뉴 이동이나 정보 조회용 시트. 반환값이 없으므로(`void`) Promise 패턴이 부적합. |
| **Tooltip**   | 위치(DOM Ref) 기반이므로 JSX로 감싸는 게 훨씬 편함.                                   |
| **Popover**   | 툴팁과 동일한 이유.                                                                   |

---

## 4. 기술적 전략 (Technical Strategy)

### A. 아키텍처 (Headless + Injection)

라이브러리는 **껍데기(Provider)**만 제공하고, 실제 디자인(shadcn 컴포넌트)은 사용자가 주입하는 방식.

- **장점:** 디자인 커스텀 자유도 100%, 스타일 종속성 0%.

### B. 프리셋 제공 (Preset Factory)

사용자가 컴포넌트를 일일이 연결하기 귀찮아하므로, shadcn/ui 전용 **"조립 키트"**를 제공.

```tsx
const ShadcnDialog = createShadcnPreset({
  parts: AlertDialogPrimitive,
  button: Button,
});
```

### C. 비동기 UX 자동화

`onConfirm`에 Promise 함수가 전달되면, 라이브러리가 자동으로:

1. 버튼을 `Loading` 상태로 변경.
2. Promise가 해결(Resolve)될 때까지 모달 유지.
3. 완료되면 모달 닫기.

---

## 5. 최종 코드 예시 (Target Code)

개발자가 이 라이브러리를 사용했을 때 작성하게 될 코드의 모습입니다.

```tsx
const handleDelete = async () => {
  // 1. 확인 및 로딩 처리 자동화
  const isConfirmed = await confirm({
    title: '정말 삭제하시겠습니까?',
    type: 'destructive', // shadcn 스타일 프리셋 적용
    onConfirm: async () => {
      await api.deleteUser(); // 이 동안 버튼은 뺑글뺑글 돔
    },
  });

  if (!isConfirmed) return;

  // 2. 값 받아오기 (Form Sheet)
  // 단순 보여주기용 시트가 아니라, '사유'를 입력받아 '결과'를 리턴함
  const feedback = await formDrawer.open<{ reason: string }>({
    title: '삭제 사유를 알려주세요',
    content: <FeedbackForm />,
  });

  if (feedback) {
    await api.sendFeedback(feedback);
  }
};
```

---

**한 줄 요약:**

> **"입력값(Return Value)이 필요한 모든 UI 오버레이(모달, 폼 시트)를 `await` 한 줄로 끝내는 유틸리티 라이브러리"**

---

## 6. Multi-Agent & AI-Native Support Strategy

"바이브 코딩" 트렌드에 맞춰, **Cursor**뿐만 아니라 **Claude Code, Antigravity, OpenCode, Codex** 등 다양한 AI 에이전트가 이 라이브러리를 100% 이해하고 활용할 수 있도록 **"Universal AI Context"**를 제공합니다.

### A. Universal AI Context (`llm.md` / `llm.txt`)

모든 AI 에이전트(Claude Code, OpenCode, Antigravity 등)가 공통적으로 참조할 수 있는 **"초압축 라이브러리 명세서"**를 제공합니다.

- **포함 내용**: 핵심 API 시그니처, Best Practice 예제, Anti-Pattern, 타입 정의 요약.
- **활용**: 개발자가 `@doc`이나 `read` 명령어로 이 파일만 던져주면, AI가 즉시 숙련된 전문가처럼 코딩 가능.

### B. Tool-Specific Configurations

각 도구의 특성에 맞춘 전용 설정 파일을 제공하거나 가이드를 문서화합니다.

1. **Cursor / Windsurf**: `.cursorrules` (Rule 기반 자동 제어)
2. **Claude Code / OpenCode / Antigravity**:
   - 아키텍처를 직관적으로 파악할 수 있도록 **"Self-Documenting Type Definition"** 강화 (JSDoc에 예제 코드 포함).
   - 복잡한 추론 없이도 사용법을 유추할 수 있는 **"One-Path API Design"** (방법이 여러 개면 AI가 헷갈림 → 정답은 하나로 통일).

### C. System Prompt Snippets

사용자가 자신이 사용하는 AI 툴의 "Custom Instructions"에 붙여넣을 수 있는 최적화된 프롬프트 조각을 제공합니다.

```markdown
<!-- For System Prompts -->

You are an expert in using 'react-okcancel'.

- ALWAYS prefer `useOkCancel()` over creating local dialog states.
- Handle async logic inside `onConfirm` callback for automatic loading states.
- Use the `confirm()` promise result for simple boolean checks.
```

```

```
