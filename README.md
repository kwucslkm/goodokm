# goodokm

구독 관리 웹/앱을 위한 풀스택 프로젝트입니다. 프론트엔드는 Next.js(App Router), 백엔드는 Spring Boot + JPA + PostgreSQL로 구성되어 있습니다.

## 구성

- `frontend`: Next.js 16 + React 19 + Tailwind v4 기반 UI
- `backend/goodokm`: Spring Boot 4 + JPA + PostgreSQL

## 개발 환경

- Node.js 18+ (frontend)
- JDK 17 (backend)
- PostgreSQL (기본 포트: 15432)

## 빠른 시작

### 1) DB 준비

Postgres가 실행 중이어야 합니다. 기본 설정은 아래와 같습니다.

- Host: `localhost`
- Port: `15432`
- DB: `goodokm`
- User: `postgres`
- Password: `e1001`

DDL/DML 적용:

```powershell
$env:PGPASSWORD='e1001'
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 15432 -U postgres -d goodokm -f C:\goodokm\backend\goodokm\script\ddl.sql
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -h localhost -p 15432 -U postgres -d goodokm -f C:\goodokm\backend\goodokm\script\dml.sql
```

### 2) 백엔드 실행

```powershell
cd C:\goodokm\backend\goodokm
.\gradlew.bat bootRun
```

### 3) 프론트엔드 실행

```powershell
cd C:\goodokm\frontend
npm run dev
```

## 환경 변수

`frontend/.env.local`

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## 주요 화면

- `/login`: 로그인
- `/signup`: 회원가입
- `/dashboard`: 대시보드(요약/최근 구독)
- `/subscriptions`: 구독 목록
- `/subscriptions/new`: 구독 등록
- `/subscriptions/canceled`: 해지 구독

## API 요약

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Subscriptions

- `GET /api/subscriptions?userId=`
- `POST /api/subscriptions`
- `DELETE /api/subscriptions/{id}`

### Payments (테스트용 포함)

- `GET /api/payments?subscriptionId=`
- `POST /api/payments`

### Notifications (테스트용 포함)

- `GET /api/notifications?userId=`
- `POST /api/notifications`

## 참고

- 백엔드는 JPA 엔티티가 `ddl.sql` 스키마에 맞춰 매핑되어 있습니다.
- CORS는 `application.yml`의 `app.cors.allowed-origins`로 제어합니다.
