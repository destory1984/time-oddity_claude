# 홍보 동영상 만들기

유튜브 쇼츠용 세로 영상(1080 x 1920, 30fps, 약 27초)을 게임 화면에서 바로 만든다. 1권(Space Oddity)의 `build/promo/` 를 옮겨 왔다. 지금은 한국어판만 있다.
결과물과 녹화 원본은 `assets/promo/` 에 쌓이고 저장소에는 올리지 않는다(원본 그림이 1GB 가까이 나온다).

## 순서

개발 서버(포트 5321)를 먼저 띄운다.

1. 장면 녹화: `node tools/promo/shoot.cjs ko music gobekli rome kaifeng machu tokyo kittyhawk dubai`
   - 개발 서버를 창 없이 띄워 찍는다. 장면마다 효과음도 같이 녹음한다.
   - `music` 은 음악만 36초 녹음한다. 다른 장면은 음악을 끄고 효과음만 녹음한다.
   - 화면 맨 위의 시험용 단추와 왼쪽 위 심부름 쪽지는 숨긴다. 자막이 그 자리에 들어간다.
2. 확인용 장면표: `python -P tools/promo/sheet.py ko gobekli rome` → `assets/promo/ko/sheet.jpg`
3. 자막과 끝 화면: `node tools/promo/captions.cjs ko`
4. 편집: `python -P tools/promo/cut.py ko` → `assets/promo/timeoddity-ko.mp4`

## 고칠 곳

| 무엇 | 파일 |
| --- | --- |
| 장면을 찍는 동작(어느 자리, 몇째 장면, 어디서 걷기 시작하나, 말을 거나) | `shots.cjs` |
| 장면 순서, 장면마다 쓰는 구간(몇 초부터 몇 초 동안) | `cut.py` 의 `CUT` |
| 자막 글, 끝 화면 글, 모양 | `captions.cjs` 의 `LINES` 와 CSS |
| 이 PC의 Playwright와 Chromium 찾기 | `env.cjs` (`PLAYWRIGHT_DIR`, `PROMO_CHROME` 로 바꿀 수 있다) |

## 알아 둘 것

- 녹화는 405 x 720 폰 화면을 2.6667배로 그려 1080 x 1920으로 받는다.
- 이야기의 막는 사람 뒤 장면(키티호크와 두바이의 셋째 장면)은 이야기를 끝난 단계로 놓고 들어간다.
- 끝 화면에는 "구글 플레이 등록 준비 중"이라고 쓴다. 아직 스토어에 올리지 않았다(2026.10.15).
- 게임 소리와 음악은 모두 코드로 만든 소리라 따로 받은 음원이 없다. 저작권 걱정 없이 쓴다.
- 소리 크기는 유튜브 기준(-14 LUFS)에 맞춘다.
