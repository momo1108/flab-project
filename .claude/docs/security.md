# 보안 아키텍처

## API Key 관리

### 환경변수 설정

```bash
# 개발 환경 (.env.local)
VITE_TMDB_API_KEY=your_development_api_key_here

# 프로덕션 환경 (.env.production)
VITE_TMDB_API_KEY=your_production_api_key_here

# CI/CD 환경 (GitHub Secrets)
TMDB_API_KEY=production_api_key_here
```

### API Key 저장 전략

```
┌─────────────────────────────────────────────────────────────┐
│                    API Key 저장소                           │
├─────────────────────────────────────────────────────────────┤
│ 로컬 개발: .env.local (Git에서 제외)                      │
│ CI/CD: GitHub Secrets / GitLab CI Variables                │
│ 프로덕션: 배포 시 환경변수 주입 (빌드타임에 포함)        │
└─────────────────────────────────────────────────────────────┘
```

### 보안 규칙

1. **.gitignore 설정**: 모든 .env 파일은 Git에서 제외
2. **프로덕션 키 관리**: 별도의 프로덕션 API Key 사용
3. **Key 롤링**: 정기적인 API Key 갱신 권장
4. **키 권한**: 최소한의 권한만 부여

```gitignore
# .gitignore
.env
.env.local
.env.*.local
.env.production
.env.development
```

---

## CORS (Cross-Origin Resource Sharing)

### TMDB API CORS 정책

```javascript
// TMDB API는 CORS 지원
// 개발 환경에서 직접 호출 가능
fetch('https://api.themoviedb.org/3/movie/popular?api_key=YOUR_KEY')
  .then(response => response.json())
  .then(data => console.log(data));
```

### Webpack Dev Server Proxy (선택)

```javascript
// webpack.dev.js
module.exports = {
  devServer: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://api.themoviedb.org/3',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: true,
      },
    },
  },
};
```

---

## S3 보안 구성

### OAI (Origin Access Identity) 설정

```javascript
// CloudFront OAI 생성
const originAccessIdentity = {
  "CallerReference": "watcha-clone-oai",
  "Comment": "OAI for Watcha Clone"
};

aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config CallerReference=watcha-clone-oai,Comment="OAI for Watcha Clone"
```

### S3 버킷 정책

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPublicAccess",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::watcha-clone-prod",
        "arn:aws:s3:::watcha-clone-prod/*"
      ]
    },
    {
      "Sid": "AllowCloudFrontAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E123ABCDEF"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::watcha-clone-prod/*"
    }
  ]
}
```

### S3 버킷 설정

- **퍼블릭 액세스 차단**: 모든 퍼블릭 액세스 비활성화
- **버킷 정책**: CloudFront OAI만 GetObject 허용
- **버전 관리**: 비활성화 (선택사항)
- **암호화**: 서버 측 암호화 (SSE-S3) 활성화

---

## CloudFront 보안 구성

### HTTPS 강제화

```javascript
{
  "ViewerProtocolPolicy": "redirect-to-https"
}
```

### 보안 헤더

```javascript
{
  "DefaultCacheBehavior": {
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    }
  }
}
```

### WAF (Web Application Firewall) - 선택사항

```bash
# AWS WAF 규칙 생성
aws wafv2 create-ip-set \
  --name "Allowlist-IPs" \
  --scope CLOUDFRONT \
  --ip-address-version IPV4

# AWS WAF 웹 ACL 생성
aws wafv2 create-web-acl \
  --name "WatchaClone-WAF" \
  --scope CLOUDFRONT \
  --default-action Allow={}
```

---

## 콘텐츠 보안 헤더

### 보안 헤더 추가

```javascript
// CloudFront 람다@Edge 함수로 보안 헤더 추가
export const handler = async (event) => {
  const response = event.Records[0].cf.response;
  const headers = response.headers;

  // Content Security Policy
  headers['content-security-policy'] = [{
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.example.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.themoviedb.org;"
  }];

  // X-Frame-Options
  headers['x-frame-options'] = [{
    key: 'X-Frame-Options',
    value: 'DENY'
  }];

  // X-Content-Type-Options
  headers['x-content-type-options'] = [{
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }];

  // X-XSS-Protection
  headers['x-xss-protection'] = [{
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  }];

  // Strict-Transport-Security
  headers['strict-transport-security'] = [{
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  }];

  // Referrer-Policy
  headers['referrer-policy'] = [{
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  }];

  return response;
};
```

---

## 클라이언트 보안

### XSS 방지

```typescript
// React 기본 XSS 방지 기능 활용
// 자동으로 HTML 이스케이프 처리
const SafeComponent = () => {
  const userInput = '<script>alert("XSS")</script>';
  
  // 자동으로 이스케이프 처리됨
  return <div>{userInput}</div>;
};
```

### HTML 주입 방지

```typescript
// ❌ 위험: 직접 HTML 주입
const DangerousComponent = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }} />
);

// ✅ 안전: React 자동 이스케이프
const SafeComponent = ({ content }) => <div>{content}</div>;
```

---

## 보안 모니터링

### CloudWatch 경보 설정

```bash
# CloudWatch 경보 생성
aws cloudwatch put-metric-alarm \
  --alarm-name "HighErrorRate" \
  --metric-name "4xxErrorRate" \
  --namespace "AWS/CloudFront" \
  --statistic "Average" \
  --period 300 \
  --threshold 5 \
  --comparison-operator "GreaterThanThreshold"
```

### S3 액세스 로그 활성화

```bash
# S3 액세스 로그 활성화
aws s3api put-bucket-logging \
  --bucket watcha-clone-prod \
  --target-bucket watcha-clone-logs \
  --target-prefix access-logs/
```

---

## 에이전트 개발 시 보안 체크리스트

### API Key 관리
- [ ] .env 파일을 .gitignore에 포함
- [ ] 개발/프로덕션 키 분리
- [ ] CI/CD 환경에서 Secret 사용
- [ ] 키 노출 방지 (console.log 등)

### 콘텐츠 보안
- [ ] 사용자 입력 검증
- [ ] XSS 방지 (React 기본 기능 활용)
- [ ] 보안 헤더 설정
- [ ] HTTPS 강제화

### 클라우드 보안
- [ ] S3 퍼블릭 액세스 차단
- [ ] CloudFront OAI 설정
- [ ] WAF 규칙 설정 (선택사항)
- [ ] CloudWatch 경보 설정

### 코드 보안
- [ ] 외부 라이브러리 취약점 검사
- [ ] 의존성 최신화
- [ ] 보안 라이브러리 사용 (helmet, DOMPurify 등)

---

## 보안 관련 npm 패키지

```bash
# 취약점 스캔
npm audit

# 취약점 자동 수정
npm audit fix

# 보안 관련 패키지 (선택사항)
# DOMPurify - XSS 방지
# helmet - Express 보안 미들웨어
# js-cookie - 안전한 쿠키 관리
```