# Wedding Invitation App - 작업 내역

## 프로젝트 개요

모바일 퍼스트 결혼식 청첩장 웹앱

- **기술 스택**: React 19 + Vite + TypeScript + Tailwind CSS
- **백엔드**: Supabase (방명록)
- **배포**: Vercel

---

## 완료된 작업

### 1. 핵심 기능

| 기능 | 파일 | 설명 |
|------|------|------|
| 스톱모션 플레이어 | `src/components/StopMotionPlayer.tsx` | 프레임 애니메이션, 건너뛰기 버튼 |
| 네이버 지도 | `src/components/NaverMap.tsx` | 동적 스크립트 로딩, fallback UI |
| 이미지 프리로더 | `src/hooks/useAssetPreloader.ts` | 프로그레스 트래킹 |
| 스크롤 잠금 | `src/hooks/useScrollLock.ts` | iOS Safari 대응 |
| 방명록 | `src/features/guestbook/` | Supabase 연동 |
| 갤러리 | `src/pages/GalleryPage.tsx` | Lazy loading, 라이트박스 |

### 2. 섹션 구성

- **Landing**: 스톱모션 애니메이션
- **Invitation**: 신랑/신부 정보, 날짜
- **Gallery**: 사진 6장 미리보기 + 전체보기 페이지
- **Guestbook**: 방명록 (Supabase)
- **Location**: 네이버 지도 + 계좌번호 아코디언

### 3. 해결한 이슈

| 이슈 | 원인 | 해결 |
|------|------|------|
| 네이버 지도 인증 실패 | 2025년 API 파라미터명 변경 | `ncpClientId` → `ncpKeyId` |
| 지도 위치 오류 | 잘못된 좌표 | 드까르멜릿 좌표로 수정 (37.5205937, 127.1463501) |
| 건너뛰기 버튼 위치 | absolute → 부모 기준 | fixed + max-w 컨테이너로 뷰포트 기준 배치 |
| React setState 오류 | 렌더 중 상태 변경 | setTimeout으로 다음 틱에 실행 |
| NaverMap cleanup 오류 | 언마운트 시 에러 | try-catch로 감싸기 |

---

## 프로젝트 구조

```
src/
├── components/          # 재사용 컴포넌트
│   ├── NaverMap.tsx
│   ├── Preloader.tsx
│   └── StopMotionPlayer.tsx
├── features/            # 페이지 섹션
│   ├── gallery/
│   ├── guestbook/
│   ├── invitation/
│   ├── landing/
│   └── location/
├── hooks/               # 커스텀 훅
│   ├── useAssetPreloader.ts
│   └── useScrollLock.ts
├── lib/                 # 유틸리티
│   ├── supabase.ts
│   └── guestbook.ts
├── pages/               # 라우트 페이지
│   └── GalleryPage.tsx
├── types/               # 타입 정의
│   ├── index.ts
│   └── naver-maps.d.ts
└── App.tsx              # 메인 앱
```

---

## 환경 설정

### 로컬 개발

```bash
# .env.local
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

### Vercel 배포

Environment Variables에 동일하게 설정

### 네이버 클라우드 플랫폼

- **Web Dynamic Map** 서비스 URL에 도메인 등록 필요:
  - `http://localhost:5174` (로컬)
  - `https://your-domain.vercel.app` (배포)

---

## Supabase 테이블

```sql
CREATE TABLE guestbook (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(64) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook" ON guestbook
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert guestbook" ON guestbook
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Delete with correct password" ON guestbook
  FOR DELETE USING (true);
```

---

## 배포 체크리스트

- [x] GitHub 레포 생성 및 push
- [x] Supabase 프로젝트 생성
- [x] guestbook 테이블 생성
- [ ] Vercel 환경변수 설정 (올바른 anon key)
- [ ] 네이버 클라우드에 Vercel 도메인 등록
- [ ] 프로덕션 테스트

---

## 참고 자료

- [네이버 지도 API 인증 변경 (2025)](https://velog.io/@j-ij-i/네이버-지도-Open-API-인증이-실패하였습니다)
- [Supabase 문서](https://supabase.com/docs)
- [Vercel 배포 가이드](https://vercel.com/docs)
