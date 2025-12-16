class TouchDesignerClient {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.sliderValues = {
            slider1: 0.5,
            slider2: 0.5,
            slider3: 0.5
        };
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.statusEl = document.getElementById('status');
        this.connectBtn = document.getElementById('connectBtn');
        this.dataInput = document.getElementById('dataInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.messageLog = document.getElementById('messageLog');

        this.slider1 = document.getElementById('slider1');
        this.slider2 = document.getElementById('slider2');
        this.slider3 = document.getElementById('slider3');
        this.slider1Value = document.getElementById('slider1Value');
        this.slider2Value = document.getElementById('slider2Value');
        this.slider3Value = document.getElementById('slider3Value');
    }

    bindEvents() {
        this.connectBtn.addEventListener('click', () => {
            if (this.isConnected) {
                this.disconnect();
            } else {
                this.connect();
            }
        });

        if (this.sendBtn) {
            this.sendBtn.addEventListener('click', () => {
                this.sendData();
            });
        }

        if (this.dataInput) {
            this.dataInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendData();
                }
            });
        }

        this.slider1.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.slider1Value.textContent = value.toFixed(2);
            this.sliderValues.slider1 = value;
            this.sendAllSliderData();
        });

        this.slider2.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.slider2Value.textContent = value.toFixed(2);
            this.sliderValues.slider2 = value;
            this.sendAllSliderData();
        });

        this.slider3.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.slider3Value.textContent = value.toFixed(2);
            this.sliderValues.slider3 = value;
            this.sendAllSliderData();
        });
    }

    connect() {
        try {
            this.ws = new WebSocket('ws://localhost:8080');

            this.ws.onopen = () => {
                this.isConnected = true;
                this.updateUI();
                this.logMessage('서버에 연결되었습니다.');
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    this.logMessage(`수신: ${JSON.stringify(data)}`);
                } catch (error) {
                    this.logMessage(`수신: ${event.data}`);
                }
            };

            this.ws.onclose = () => {
                this.isConnected = false;
                this.updateUI();
                this.logMessage('연결이 끊어졌습니다.');
            };

            this.ws.onerror = (error) => {
                this.logMessage(`연결 오류: ${error.message || '알 수 없는 오류'}`);
            };

        } catch (error) {
            this.logMessage(`연결 실패: ${error.message}`);
        }
    }

    disconnect() {
        if (this.ws) {
            this.ws.close();
        }
    }

    sendData() {
        if (!this.isConnected || !this.ws) {
            this.logMessage('서버에 연결되지 않았습니다.');
            return;
        }

        const inputValue = this.dataInput.value.trim();
        if (!inputValue) {
            this.logMessage('전송할 데이터를 입력하세요.');
            return;
        }

        try {
            const data = {
                type: 'data',
                value: inputValue,
                timestamp: new Date().toISOString()
            };

            this.ws.send(JSON.stringify(data));
            this.logMessage(`전송: ${JSON.stringify(data)}`);
            this.dataInput.value = '';
        } catch (error) {
            this.logMessage(`전송 오류: ${error.message}`);
        }
    }

    sendAllSliderData() {
        if (!this.isConnected || !this.ws) {
            return;
        }

        try {
            const data = {
                type: 'sliders',
                ...this.sliderValues,
                timestamp: new Date().toISOString()
            };

            this.ws.send(JSON.stringify(data));
            this.logMessage(`슬라이더 전송: ${JSON.stringify(this.sliderValues)}`);
        } catch (error) {
            this.logMessage(`슬라이더 전송 오류: ${error.message}`);
        }
    }

    updateUI() {
        if (this.isConnected) {
            this.statusEl.textContent = '연결됨';
            this.statusEl.className = 'status connected';
            this.connectBtn.textContent = '연결 해제';
            if (this.dataInput) this.dataInput.disabled = false;
            if (this.sendBtn) this.sendBtn.disabled = false;
            this.slider1.disabled = false;
            this.slider2.disabled = false;
            this.slider3.disabled = false;
        } else {
            this.statusEl.textContent = '연결 끊어짐';
            this.statusEl.className = 'status disconnected';
            this.connectBtn.textContent = '연결';
            if (this.dataInput) this.dataInput.disabled = true;
            if (this.sendBtn) this.sendBtn.disabled = true;
            this.slider1.disabled = true;
            this.slider2.disabled = true;
            this.slider3.disabled = true;
        }
    }

    logMessage(message) {
        if (!this.messageLog) return;
        const timestamp = new Date().toLocaleTimeString();
        const messageEl = document.createElement('div');
        messageEl.textContent = `[${timestamp}] ${message}`;
        this.messageLog.appendChild(messageEl);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TouchDesignerClient();
});