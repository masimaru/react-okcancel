# 기여 가이드 (Contributing Guide)

`react-okcancel` 프로젝트에 기여해 주셔서 감사합니다! 이 문서는 프로젝트에 효과적으로 기여하는 방법을 안내합니다.

## 🎯 프로젝트 개요

`react-okcancel`은 React + TypeScript 기반의 경량 모달(dialog) 라이브러리입니다. `confirm`, `alert`를 Promise 기반으로 간단히 호출할 수 있으며, CSS 변수로 스타일을 커스터마이징할 수 있습니다.

## 🚀 개발 환경 설정

### 필수 요구사항

- Node.js 20 이상
- npm (Node.js와 함께 설치됨)

### 설정 과정

1. **저장소 포크 및 클론**

   ```bash
   # GitHub에서 프로젝트를 포크한 후
   git clone https://github.com/YOUR_USERNAME/react-okcancel.git
   cd react-okcancel
   ```

2. **의존성 설치**

   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   브라우저에서 `http://localhost:5173`에 접속하여 데모 앱을 확인할 수 있습니다.

## 🔧 개발 명령어

| 명령어                 | 설명                              |
| ---------------------- | --------------------------------- |
| `npm run dev`          | 개발 서버 실행 (Vite HMR)         |
| `npm run build`        | 프로덕션 빌드 (TypeScript + Vite) |
| `npm run preview`      | 빌드된 앱 미리보기                |
| `npm run lint:fix`     | ESLint로 JS/TS 파일 자동 수정     |
| `npm run lint:css:fix` | Stylelint로 SCSS 파일 자동 수정   |

## 📝 커밋 규칙 (Conventional Commits)

이 프로젝트는 **Conventional Commits** 규칙을 따르며, **semantic-release**를 통해 자동으로 버전이 관리됩니다.

### 커밋 메시지 형식

```
<타입>(<범위>): <설명>

[본문]

[푸터]
```

### 주요 커밋 타입

| 타입              | 설명                   | 버전 영향         | 예시                                         |
| ----------------- | ---------------------- | ----------------- | -------------------------------------------- |
| `feat`            | 새로운 기능 추가       | **Minor** (0.1.0) | `feat: 다크 모드 테마 지원 추가`             |
| `fix`             | 버그 수정              | **Patch** (0.0.1) | `fix: 모바일에서 버튼 클릭 안되는 문제 해결` |
| `BREAKING CHANGE` | 호환성을 깨뜨리는 변경 | **Major** (1.0.0) | 푸터에 `BREAKING CHANGE: API 구조 변경`      |
| `docs`            | 문서 변경              | 버전 영향 없음    | `docs: README 사용법 예제 추가`              |
| `style`           | 코드 스타일 변경       | 버전 영향 없음    | `style: 들여쓰기 및 포맷팅 수정`             |
| `refactor`        | 코드 리팩토링          | 버전 영향 없음    | `refactor: 컴포넌트 구조 개선`               |
| `test`            | 테스트 추가/수정       | 버전 영향 없음    | `test: Dialog 컴포넌트 테스트 추가`          |
| `chore`           | 빌드/도구 설정 변경    | 버전 영향 없음    | `chore: Vite 설정 업데이트`                  |

### 커밋 예시

**새 기능 추가:**

```bash
git commit -m "feat: 키보드 내비게이션 지원 추가

Tab/Shift+Tab으로 버튼 간 이동 가능
Enter/Space로 버튼 활성화 지원"
```

**버그 수정:**

```bash
git commit -m "fix: ESC 키로 다이얼로그가 닫히지 않는 문제 해결"
```

**호환성을 깨뜨리는 변경:**

```bash
git commit -m "feat: API 구조 개선

기존 confirm() 함수의 반환값 구조 변경

BREAKING CHANGE: confirm() 함수가 이제 { result: boolean, timestamp: number } 객체를 반환합니다."
```

### 참고: https://www.conventionalcommits.org/ko/v1.0.0/

## 🎨 코드 스타일

### 자동 포맷팅

코드를 커밋하기 전에 반드시 다음 명령어를 실행하세요:

```bash
npm run lint:fix      # ESLint 자동 수정
npm run lint:css:fix  # Stylelint 자동 수정
```

## 🔄 개발 워크플로우

### 1. 브랜치 생성

```bash
git checkout -b feature/새로운-기능
# 또는
git checkout -b fix/버그-수정
```

### 2. 개발 및 테스트

```bash
# 개발 서버로 실시간 확인
npm run dev

# 빌드 테스트
npm run build
```

### 3. 코드 품질 검사

```bash
npm run lint:fix
npm run lint:css:fix
```

### 4. 커밋 및 푸시

```bash
git add .
git commit -m "feat: 새로운 기능 추가"
git push origin feature/새로운-기능
```

### 5. Pull Request 생성

GitHub에서 Pull Request를 생성하고 다음 사항을 확인하세요:

- 명확한 제목과 설명
- 변경사항에 대한 상세한 설명
- 관련 이슈 링크 (있다면)
- 스크린샷 또는 GIF (UI 변경이 있다면)

## 🐛 이슈 리포팅

버그를 발견하거나 새로운 기능을 제안하고 싶다면 [GitHub Issues](https://github.com/masimaru/react-okcancel/issues)를 이용해 주세요.

### 버그 리포트 시 포함할 정보

- 브라우저 및 버전
- React 버전
- `react-okcancel` 버전
- 재현 가능한 최소 코드 예제
- 예상 동작과 실제 동작의 차이

### 기능 제안 시 포함할 정보

- 기능에 대한 명확한 설명
- 사용 사례 및 필요한 이유
- 가능한 구현 방법 (있다면)

## 🤝 Pull Request 가이드라인

### PR 체크리스트

- [ ] 코드가 프로젝트의 스타일 가이드를 따르는가?
- [ ] 모든 새로운 기능에 대한 설명이 포함되어 있는가?
- [ ] 빌드가 성공적으로 완료되는가? (`npm run build`)
- [ ] 린팅 오류가 없는가? (`npm run lint:fix`)
- [ ] 커밋 메시지가 Conventional Commits 규칙을 따르는가?

### PR 제목 형식

```
<타입>(<범위>): <간단한 설명>
```

예시:

- `feat(dialog): 애니메이션 효과 추가`
- `fix(portal): SSR 환경에서 오류 수정`
- `docs: CONTRIBUTING.md 업데이트`

## 📋 프로젝트 구조

```
src/
├── index.ts              # 라이브러리 진입점
├── types.ts              # TypeScript 타입 정의
├── provider.tsx          # 메인 Provider 컴포넌트
├── context.tsx           # React Context 정의
├── hooks.ts              # useOkCancel 훅
├── main.tsx              # 데모 앱 진입점
├── App.tsx               # 대화형 플레이그라운드 데모 앱
├── App.module.scss       # 데모 앱 스타일
├── components/
│   ├── dialog.tsx        # Dialog 컴포넌트
│   ├── dialog.module.scss # Dialog 스타일
│   └── portal.tsx        # Portal 관리 컴포넌트
├── styles/
│   ├── variables.scss    # CSS 변수 정의
│   └── index.scss        # 전역 스타일
└── vite-env.d.ts         # Vite 타입 정의
```

---
