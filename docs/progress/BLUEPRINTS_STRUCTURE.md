# 📁 Структура системы чертежей

## ✅ Создано:

### Главный файл:
- `assets/js/modules/blueprints/BlueprintsManager.js` - Менеджер системы

### Чертежи (каждый отдельный файл):
- `assets/js/modules/blueprints/items/CylindricalPot.js` - Цилиндрический
- `assets/js/modules/blueprints/items/SquarePot.js` - Квадратный
- `assets/js/modules/blueprints/items/RoundPot.js` - Круглый
- `assets/js/modules/blueprints/items/TaperedPot.js` - Сужающийся
- `assets/js/modules/blueprints/items/TallPot.js` - Высокий

### Документация:
- `assets/js/modules/blueprints/README.md` - Описание структуры

---

## 📂 Полная структура папок:

```
assets/js/modules/blueprints/
├── README.md
├── BlueprintsManager.js
└── items/
    ├── CylindricalPot.js
    ├── SquarePot.js
    ├── RoundPot.js
    ├── TaperedPot.js
    └── TallPot.js
```

---

## 🎯 Особенности:

### ✅ Модульность:
- Каждый чертеж - отдельный класс
- Каждый класс - отдельный файл
- Легко добавлять новые типы

### ✅ Чистая структура:
- Разделение по папкам
- Главный менеджер отдельно
- Чертежи в папке `items/`

### ✅ Профессиональные чертежи:
- 3 проекции (спереди, сверху, снизу)
- Линии размеров
- Пунктирные линии для скрытых контуров
- Текст с размерами

### ✅ Автоматизация:
- Случайные типы
- Случайные позиции
- Автоматическое появление/исчезновение

---

## 💻 Подключение:

```html
<script type="module" src="assets/js/modules/blueprints/BlueprintsManager.js"></script>
```

---

## 📊 Размеры файлов:

- BlueprintsManager.js: ~5KB
- Каждый чертеж: ~2-3KB
- Всего: ~20KB

---

**Готово к использованию!** 🎉

