# Голосовой диалог с AI в Cursor (Voice Mode)

Настроен **Voice Mode** — голосовой разговор с Claude прямо в Cursor (не диктовка текста, а полноценный диалог).

**Бесплатный вариант (без ключа OpenAI):** распознавание и озвучка работают локально (Whisper + Kokoro). Пошаговая настройка — в **[VOICE_MODE_FREE_SETUP.md](VOICE_MODE_FREE_SETUP.md)**.

## Что уже сделано

- В глобальный конфиг Cursor добавлен MCP-сервер **voice-mode**  
  Файл: `~/.cursor/mcp.json`
- Установлен менеджер **uv** (и `uvx`) — Voice Mode запускается по требованию через `uvx voice-mode`
- В конфиге указан полный путь к `uvx`, чтобы Cursor находил его при запуске MCP

## Что нужно сделать вам

### 1. Указать OpenAI API ключ (или использовать бесплатный локальный режим)

Если вы настроили локальные Whisper + Kokoro по [VOICE_MODE_FREE_SETUP.md](VOICE_MODE_FREE_SETUP.md), ключ не нужен — можно пропустить этот шаг.

Иначе (облачный режим):

1. Откройте файл конфигурации:
   - **macOS:** в Finder `Cmd+Shift+G` → введите `~/.cursor` → откройте `mcp.json`  
   - Или в терминале: `open ~/.cursor/mcp.json`
2. Замените `YOUR_OPENAI_API_KEY_HERE` на ваш реальный ключ OpenAI (или совместимого сервиса).
3. Сохраните файл.

### 2. Перезапустить Cursor

Полностью закройте Cursor и откройте снова, чтобы подхватился обновлённый MCP-конфиг.

### 3. Проверить MCP

- Настройки Cursor → раздел MCP (или **Cursor Settings → MCP**)  
- В списке серверов должен быть **voice-mode** и статус «подключён» (или без ошибок).

### 4. Как пользоваться голосом

1. Откройте палитру команд: **Cmd+K** (macOS) или **Ctrl+K** (Windows/Linux).
2. Введите: **Talk to me** или **Let's have a voice conversation**.
3. Разрешите доступ к микрофону, если браузер/ОС запросят.
4. Говорите с Claude голосом — ответы тоже будут озвучиваться.

**Примеры фраз (англ.):**
- «Can you explain what this function does?»
- «Let's work on this code with voice»
- «Refactor this function to use async/await»

**Диктовка на русском:** в конфиге задано `STT_LANGUAGE=ru` — можно говорить по-русски, распознавание будет на русском. Ответы по-прежнему от модели (часто на английском); при необходимости попросите в промпте: «отвечай на русском».

## Требования

- **Cursor** не ниже v0.8.0  
- **Python** 3.10+ (для uv/voice-mode)  
- **OpenAI API key** (или совместимый endpoint)  
- Рабочий микрофон и динамики/наушники  

## Если Voice Mode не появляется или не работает

1. **Ключ:** убедитесь, что в `~/.cursor/mcp.json` в `env.OPENAI_API_KEY` подставлен корректный ключ без лишних пробелов и кавычек внутри значения.
2. **uvx:** в терминале выполните:
   ```bash
   /Users/alexandrmelnicenco/.local/bin/uvx voice-mode
   ```
   Если команда не найдена или падает — переустановите uv:  
   `curl -LsSf https://astral.sh/uv/install.sh | sh`
3. **Логи Cursor:** **Help → Toggle Developer Tools → Console** — смотрите ошибки при запуске MCP.
4. **Документация Voice Mode:** https://voice-mode.readthedocs.io/en/stable/integrations/cursor/

## Дополнительно (по желанию)

- Локальный TTS/STT и другие опции: в `mcp.json` в блоке `env` для `voice-mode` можно добавить переменные из [документации Voice Mode](https://voice-mode.readthedocs.io/en/stable/integrations/configuration.md).
- Если позже добавите другие MCP-серверы, просто допишите их в `mcpServers` в том же `~/.cursor/mcp.json`, не удаляя `voice-mode`.
