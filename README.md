[디스코드 봇 링크](https://discord.com/oauth2/authorize?client_id=1257851791278870641&permissions=8&integration_type=0&scope=bot)

### 아키텍쳐

---

![아키텍쳐](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/lck-discord-bot-architecture.png)

### 실행 예시

---

![실행예시](https://kimyoungjoforum1557.s3.ap-northeast-2.amazonaws.com/lck-discord-bot-example.png)


### 실행

---



node.js (18.20.2 이상)

```
npm install
npm start
```

### 기능 상세

- !lck 를 봇이 초대된 채널의 채팅창에 입력 시 naver esports의 일정을 크롤링해 오늘의 날짜와 맞는 경기를 출력해줍니다.
- 별도의 명령어 없이 매일 13시에 오늘의 lck 경기 일정을 출력해줍니다.
