# TouchDesigner WebSocket Communication

TouchDesigner와 WebSocket을 통해 실시간으로 데이터를 주고받는 최소한의 프로젝트입니다.

## 프로젝트 구조

```
td_socket/
├── package.json          # Node.js 의존성 관리
├── server.js             # WebSocket 서버
├── public/
│   ├── index.html        # 클라이언트 웹 페이지
│   └── script.js         # 클라이언트 JavaScript
└── README.md             # 프로젝트 설명서
```

## 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 서버 실행:
```bash
npm start
```

3. 브라우저에서 접속:
```
http://localhost:8080
```

## TouchDesigner 연동

### WebSocket DAT 설정
1. TouchDesigner에서 WebSocket DAT 생성
2. Active: On
3. Network Address: `localhost`
4. Port: `8080`
5. Protocol: `ws://`

### 데이터 송신 (TouchDesigner → 웹)
```python
# TouchDesigner에서 데이터 전송 예시
import json

data = {
    "type": "td_data",
    "value": 123.45,
    "timestamp": absTime.frame
}

op('websocket1').send(json.dumps(data))
```

### 데이터 수신 (웹 → TouchDesigner)
WebSocket DAT의 `onReceiveText` 콜백에서:
```python
def onReceiveText(dat, text):
    try:
        data = json.loads(text)
        print(f"Received: {data}")
        # 받은 데이터 처리
        if data.get('type') == 'data':
            op('constant1').par.value0 = data.get('value', 0)
    except:
        print(f"Invalid JSON: {text}")
```

## 데이터 형식

프로젝트에서 사용하는 JSON 데이터 형식:

```json
{
    "type": "data",
    "value": "전송할 값",
    "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## 주요 기능

- **실시간 WebSocket 통신**: 웹과 TouchDesigner 간 양방향 통신
- **간단한 웹 인터페이스**: 데이터 입력 및 전송
- **연결 상태 모니터링**: 실시간 연결 상태 표시
- **메시지 로깅**: 송수신 데이터 기록

## 사용 방법

1. 서버 실행 후 웹 브라우저에서 `http://localhost:8080` 접속
2. "연결" 버튼 클릭하여 WebSocket 서버에 연결
3. 텍스트 입력 후 "데이터 전송" 버튼 클릭
4. TouchDesigner에서 동일한 데이터 수신 확인

## 확장 가능성

- 센서 데이터 실시간 전송
- 실시간 오디오/비디오 제어
- 다중 클라이언트 지원
- 데이터 시각화 추가