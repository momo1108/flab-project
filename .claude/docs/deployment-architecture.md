# 배포 아키텍처

## 전체 배포 구조 (CloudFront + S3)

```
┌─────────────────────────────────────────────────────────────┐
│                      End User                                │
│                   (브라우저 사용자)                           │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS 요청
                 ↓
┌──────────────────────────────────────────────────────────────┐
│              CloudFront (CDN)                                │
│  Distribution: d1234abc.cloudfront.net                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 기능:                                                   │ │
│  │ - 지리적 캐싱 (엣지 로케이션)                            │ │
│  │ - HTTPS/HTTP/2 지원                                    │ │
│  │ - 보안 (OAI를 통한 S3 접근 제한)                        │ │
│  │ - Gzip/Brotli 압축                                     │ │
│  │ - 캐시 정책:                                           │ │
│  │   * HTML: 5분 (변경 빈번)                             │ │
│  │   * JS/CSS: 1년 (콘텐츠 해시로 무효화)                 │ │
│  │   * 이미지: 1년                                       │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────┬──────────────────────────────────────────────┘
                 │ (OAI 인증)
                 ↓
┌──────────────────────────────────────────────────────────────┐
│              Amazon S3 Bucket                                │
│  watcha-clone-prod/                                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 구조:                                                   │ │
│  │ index.html                                             │ │
│  │ dist/                                                  │
│  │ ├─ js/                                                 │ │
│  │ │  └─ main.abc123.js (콘텐츠 해시)                    │ │
│  │ ├─ css/                                                │ │
│  │ │  └─ main.def456.css                                 │ │
│  │ └─ images/ (선택)                                     │ │
│  │                                                        │ │
│  │ 설정:                                                  │ │
│  │ - 정적 웹사이트 호스팅 활성화                          │ │
│  │ - 기본 루트 객체: index.html                           │ │
│  │ - 에러 문서: index.html (SPA 지원)                     │ │
│  │ - 버전 관리 비활성화                                   │ │
│  │ - 퍼블릭 액세스: CloudFront OAI만 허용                 │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## CloudFront 구성

### Distribution 설정

```javascript
{
  "DistributionConfig": {
    "CallerReference": "watcha-clone-v1",
    "Origins": {
      "Items": [
        {
          "Id": "S3-watcha-clone-prod",
          "DomainName": "watcha-clone-prod.s3.amazonaws.com",
          "S3OriginConfig": {
            "OriginAccessIdentity": "origin-access-identity/cloudfront/E123ABCDEF"
          }
        }
      ],
      "Quantity": 1
    },
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-watcha-clone-prod",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": ["GET", "HEAD", "OPTIONS"],
      "CachedMethods": ["GET", "HEAD"],
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {
          "Forward": "none"
        }
      },
      "MinTTL": 300,
      "DefaultTTL": 300,
      "MaxTTL": 31536000,
      "Compress": true
    },
    "CacheBehaviors": [
      {
        "PathPattern": "*.js",
        "TargetOriginId": "S3-watcha-clone-prod",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 31536000,
        "DefaultTTL": 31536000,
        "MaxTTL": 31536000,
        "Compress": true
      },
      {
        "PathPattern": "*.css",
        "TargetOriginId": "S3-watcha-clone-prod",
        "ViewerProtocolPolicy": "redirect-to-https",
        "MinTTL": 31536000,
        "DefaultTTL": 31536000,
        "MaxTTL": 31536000,
        "Compress": true
      }
    ],
    "PriceClass": "PriceClass_100", // 미국, 유럽, 아시아만 사용
    "Enabled": true,
    "DefaultRootObject": "index.html",
    "CustomErrorResponses": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html",
        "ResponseCode": 200,
        "ErrorCachingMinTTL": 0
      },
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": 200,
        "ErrorCachingMinTTL": 0
      }
    ]
  }
}
```

### 캐시 정책

| 파일 타입 | MinTTL | DefaultTTL | MaxTTL | 전략 |
|-----------|---------|-------------|---------|------|
| index.html | 5분 (300s) | 5분 (300s) | 5분 (300s) | 짧은 캐시, 빈번한 업데이트 |
| *.js | 1년 (31536000s) | 1년 (31536000s) | 1년 (31536000s) | 콘텐츠 해시로 무효화 |
| *.css | 1년 (31536000s) | 1년 (31536000s) | 1년 (31536000s) | 콘텐츠 해시로 무효화 |
| *.png, *.jpg, *.svg | 1년 (31536000s) | 1년 (31536000s) | 1년 (31536000s) | 정적 리소스 |

## S3 버킷 구성

### 버킷 정책

```json
{
  "Version": "2012-10-17",
  "Statement": [
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

### 버킷 설정

- **버킷 이름**: watcha-clone-prod
- **리전**: us-east-1 (또는 가장 가까운 리전)
- **정적 웹사이트 호스팅**: 활성화
- **기본 루트 객체**: index.html
- **에러 문서**: index.html (SPA 지원)
- **버전 관리**: 비활성화

## 배포 프로세스

### 로컬 빌드

```bash
# 프로덕션 빌드
npm run build:production

# 결과물 확인
ls -la dist/
# dist/index.html
# dist/js/main.abc123.js
# dist/css/main.def456.css
```

### S3 배포

```bash
# S3에 동기화 (삭제 포함)
aws s3 sync dist/ s3://watcha-clone-prod/ --delete

# 콘텐츠 타입 설정
aws s3 cp dist/ s3://watcha-clone-prod/ --recursive \
  --content-type "text/html" --exclude "*" --include "*.html"
aws s3 cp dist/ s3://watcha-clone-prod/ --recursive \
  --content-type "application/javascript" --exclude "*" --include "*.js"
aws s3 cp dist/ s3://watcha-clone-prod/ --recursive \
  --content-type "text/css" --exclude "*" --include "*.css"
```

### CloudFront 캐시 무효화

```bash
# index.html만 무효화
aws cloudfront create-invalidation \
  --distribution-id E123ABCDEF \
  --paths "/index.html"

# 전체 무효화 (전체 배포 시)
aws cloudfront create-invalidation \
  --distribution-id E123ABCDEF \
  --paths "/*"
```

## 자동화된 배포 스크립트

### GitHub Actions 예시

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build for production
        run: npm run build:production
        env:
          VITE_TMDB_API_KEY: ${{ secrets.TMDB_API_KEY }}
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://watcha-clone-prod/ --delete
      
      - name: Invalidate CloudFront cache
        run: |
          DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?DefaultCacheBehavior.TargetOriginId=='S3-watcha-clone-prod'].Id" --output text)
          aws cloudfront create-invalidation \
            --distribution-id $DISTRIBUTION_ID \
            --paths "/index.html"
```

## 환경변수 관리

### 개발 환경

```bash
# .env.local
VITE_TMDB_API_KEY=your_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 프로덕션 환경

```bash
# .env.production
VITE_TMDB_API_KEY=production_api_key_here
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### CI/CD 환경

```bash
# GitHub Secrets
TMDB_API_KEY=production_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

## 모니터링 및 로깅

### CloudWatch 로그

```bash
# CloudFront 로그 그룹 확인
aws logs describe-log-groups \
  --log-group-name-prefix /aws/cloudfront/

# 로그 스트림 확인
aws logs describe-log-streams \
  --log-group-name /aws/cloudfront/E123ABCDEF

# 최신 로그 확인
aws logs tail /aws/cloudfront/E123ABCDEF --follow
```

### S3 액세스 로그

```bash
# 버킷 로그 확인
aws s3 ls s3://watcha-clone-prod-logs/
```

## 에이전트 개발 시 주의사항

1. **캐시 정책**: HTML은 짧게, JS/CSS는 길게 캐싱
2. **배포 후**: CloudFront 캐시 무효화 필수
3. **환경변수**: .env 파일은 .gitignore에 포함
4. **콘텐츠 해시**: Webpack이 자동 생성, 캐시 무효화에 활용
5. **SPA 지원**: 404/403 에러를 index.html로 리다이렉트
6. **HTTPS 강제**: CloudFront ViewerProtocolPolicy 설정