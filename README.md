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

---

- !lck 를 봇이 초대된 채널의 채팅창에 입력 시 naver esports의 일정을 크롤링해 오늘의 날짜와 맞는 경기를 출력해줍니다.
- 별도의 명령어 없이 매일 13시에 오늘의 lck 경기 일정을 출력해줍니다.

### 성능 개선

---

2024-07-03
 - 문제 상황 : 매 요청마다 크롤링을 해와야해서 응답시간이 오래걸림
   - 해결 : naver esports 페이지는 1달치의 일정을 제공해주므로 1달에 한 번 크롤링을 해와서 별도에 json 파일에 일정을 보관 후 그 json 파일에서 일정 데이터를 가져다 쓰는것으로 수정
   - 결과 : 1100ms - 1300ms 까지 걸리던 응답시간이 1ms로 줄어듦
