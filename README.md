# PBL 팀프로젝트

## Supabase 연동 가이드

1. Supabase 대시보드에서 프로젝트를 생성하고 `Project URL`, `anon key`를 복사합니다.
2. `fe` 디렉터리 루트에 `.env` 또는 `.env.local` 파일을 만들고 아래 환경 변수를 입력합니다.
2-1. `.env` 형식에 맞춰서 `env.local` 생성해서 써주세요
   ```
   VITE_SUPABASE_URL=YOUR_URL
   VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
   ```
3. 프런트엔드 앱을 실행하면 `src/lib/supabaseClient.ts`가 해당 값을 읽어 `supabase` 클라이언트를 생성합니다.
4. `/auth` 경로로 이동하면 Supabase 이메일/비밀번호 인증을 사용하는 로그인·회원가입 화면을 확인할 수 있습니다.
   - 회원가입 시 선택한 역할은 `user_metadata.role`에 저장됩니다.
5. 추가적인 DB/Edge Functions 작업은 Supabase 대시보드 또는 CLI를 통해 진행한 뒤, 프런트엔드에서 `supabase.from('테이블명')` 형태로 데이터를 연동하세요.

