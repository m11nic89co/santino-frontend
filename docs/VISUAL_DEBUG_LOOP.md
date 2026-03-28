# Visual Debug Loop (Code + Screenshot)

Цель: быстрый цикл «проблема -> скрин -> правка -> скрин после правки».

## 1) Запуск локального сервера

Подходит любой вариант:

- `npm run dev` (Vite)
- Live Server extension
- `npm run start` (python server)

## 2) Снять "до" (before)

```bash
npm run snap:section -- --preset contract --label before
```

Или сразу три ключевые секции:

```bash
npm run snap:all -- --label before
```

## 3) Анализ

Сравниваем:

- текущий код (CSS/HTML/JS),
- скрин из `ScreenShots/auto-sections`,
- ожидаемое поведение по задаче.

## 4) Правка кода

После правки снимаем "после" (after):

```bash
npm run snap:section -- --preset contract --label after
```

## 5) Повтор цикла

Повторять шаги 3-4, пока не достигнуто "да, все ок".

Для частых автоснимков можно включить watch:

```bash
npm run snap:section -- --preset contract --watch --interval 5000
```

## Примечания

- Файлы `.png` и `.json` в `ScreenShots/auto-sections` игнорируются git.
- В репозитории остаются только `.gitkeep` и инструкция по использованию.
