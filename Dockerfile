# 기본 Node.js 이미지 선택
FROM node:lts

# 작업 디렉토리 설정
WORKDIR /app

# 애플리케이션의 package.json과 package-lock.json 복사
COPY package.json ./

# 의존성 설치
RUN npm install --force
# --only=production

# 애플리케이션 코드 복사
COPY . .

# 애플리케이션 실행을 위한 포트 설정
EXPOSE 3000

# 애플리케이션 실행 명령
CMD ["npm", "run", "start:dev"]
