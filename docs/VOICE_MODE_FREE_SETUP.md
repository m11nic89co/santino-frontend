# Бесплатный голосовой диалог в Cursor (без OpenAI API)

Голосовой режим можно использовать **без платного ключа OpenAI**: распознавание речи (STT) и синтез речи (TTS) работают **локально** на вашем Mac.

- **STT (речь → текст):** Whisper (локально, порт 2022)  
- **TTS (текст → речь):** Kokoro (локально, порт 8880)  
- **Ответы генерирует** встроенная в Cursor модель (Claude) — по вашей подписке Cursor, без отдельного OpenAI API.

---

## Шаг 1. Установить локальные сервисы

В терминале выполните по очереди.

### 1.1 Whisper (распознавание речи)

```bash
/Users/alexandrmelnicenco/.local/bin/uvx voice-mode service install whisper
```

Скачается и соберётся whisper.cpp, загрузится модель (порядка 150 MB для base). Установка в `~/.voicemode/services/whisper/`.

### 1.2 Kokoro (озвучивание ответов)

```bash
/Users/alexandrmelnicenco/.local/bin/uvx voice-mode service install kokoro
```

Установка в `~/.voicemode/services/kokoro/`.

---

## Шаг 2. Запустить сервисы

Перед использованием голоса в Cursor нужно запустить оба сервиса.

```bash
/Users/alexandrmelnicenco/.local/bin/uvx voice-mode service start whisper
/Users/alexandrmelnicenco/.local/bin/uvx voice-mode service start kokoro
```

Проверить статус:

```bash
/Users/alexandrmelnicenco/.local/bin/uvx voice-mode status
```

Должны быть запущены: **whisper** (порт 2022) и **kokoro** (порт 8880).

---

## Шаг 3. Конфиг Cursor (уже настроен)

В `~/.cursor/mcp.json` для **voice-mode** уже указаны локальные адреса:

- STT: `http://127.0.0.1:2022/v1`
- TTS: `http://127.0.0.1:8880/v1`
- Голос TTS: `af_sky`
- **Язык распознавания речи:** `STT_LANGUAGE=ru` (диктовка на русском)

Ключ `OPENAI_API_KEY` можно оставить пустым — для голоса используются только локальные сервисы.

---

## Шаг 4. Как пользоваться

1. Убедитесь, что Whisper и Kokoro запущены (`uvx voice-mode status`).
2. Полностью перезапустите Cursor.
3. В Cursor: **Cmd+K** → введите **Talk to me** или **Let's have a voice conversation**.
4. Разрешите доступ к микрофону. Говорите — ответы будут озвучиваться через Kokoro.

---

## Автозапуск сервисов (по желанию)

Чтобы не запускать сервисы вручную каждый раз:

- **macOS:** после установки часто создаётся LaunchAgent; проверьте:
  ```bash
  launchctl list | grep -E 'whisper|kokoro|voicemode'
  ```
- Если автозапуска нет — перед работой с голосом один раз в терминале выполните:
  ```bash
  uvx voice-mode service start whisper
  uvx voice-mode service start kokoro
  ```

---

## Если что-то не работает

| Проблема | Что проверить |
|----------|----------------|
| «No STT» / голос не распознаётся | Запущен ли Whisper: `uvx voice-mode status`. Порт 2022 свободен? |
| Нет озвучки ответов | Запущен ли Kokoro: `uvx voice-mode status`. Порт 8880 свободен? |
| Voice Mode не подключается в Cursor | Перезапуск Cursor. В настройках MCP — сервер **voice-mode** без ошибок. |
| Ошибки при `service install` | Установлены ли Xcode Command Line Tools (`xcode-select --install`), Homebrew, cmake (`brew install cmake`). |

Подробнее: [Voice Mode — Whisper](https://voice-mode.readthedocs.io/en/stable/whisper.cpp/), [Voice Mode — Kokoro](https://voice-mode.readthedocs.io/en/stable/kokoro/).
