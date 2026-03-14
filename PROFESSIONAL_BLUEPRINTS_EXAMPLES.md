# 🏗️ Профессиональные чертежи горшков

## Примеры правильных технических чертежей цветочных горшков

---

## 📐 Чертеж #1: Горшок цилиндрический Ø180×200мм

### Три проекции (как в AutoCAD):

```javascript
// ВИД СПЕРЕДИ (ВИД СБОКУ)
addLine(g, 40, 40, 40, 240, 2.5);   // Левая сторона
addLine(g, 240, 40, 240, 240, 2.5); // Правая сторона
addLine(g, 40, 40, 240, 40, 2.5);    // Верх
addLine(g, 40, 240, 240, 240, 2.5);  // Низ

// ВИД СВЕРХУ (пунктир - скрытый контур)
addCircle(g, 140, 20, 60, 2, true);  // Stroke-dasharray: 4,2

// ВИД СНИЗУ (пунктир)
addCircle(g, 140, 260, 35, 2, true);

// ЛИНИИ РАЗМЕРОВ
// Горизонтальный размер
addDimLine(g, 50, 220, 230, 220, 15); // Линия с разрывом
addDimArrow(g, 50, 220, 'left');
addDimArrow(g, 230, 220, 'right');
addDimText(g, 140, 210, 'Ø180');

// Вертикальный размер
addDimLine(g, 260, 50, 260, 230, 15);
addDimArrow(g, 260, 50, 'top');
addDimArrow(g, 260, 230, 'bottom');
addDimText(g, 275, 140, '200мм', 'vertical');
```

---

## 📐 Чертеж #2: Горшок квадратный 150×150×180мм

### Три проекции:

```javascript
// ВИД СПЕРЕДИ
addRect(g, 50, 50, 180, 180, 2.5);

// ВИД СВЕРХУ (квадрат пунктиром)
addRectDashed(g, 70, 15, 160, 160, 2);

// ВИД СБОКУ (профиль)
addLine(g, 280, 50, 300, 50, 2.5);    // Верх
addLine(g, 280, 230, 300, 230, 2.5);  // Низ
addLine(g, 280, 50, 280, 230, 2.5);   // Правая сторона

// РАЗМЕРЫ
addDimLine(g, 240, 50, 360, 50, 15);  // Ширина (вид сверху)
addDimLine(g, 50, 260, 230, 260, 15); // Глубина (вид спереди)
addDimLine(g, 310, 50, 310, 230, 15); // Высота (вид сбоку)

// СТРЕЛКИ И ТЕКСТ
addDimText(g, 290, 30, '150мм', 'horizontal');
addDimText(g, 140, 280, '150мм', 'horizontal');
addDimText(g, 325, 140, '180мм', 'vertical');
```

---

## 📐 Чертеж #3: Горшок широкий Ø200×150мм

### Проекции:

```javascript
// ВИД СПЕРЕДИ
addLine(g, 30, 80, 230, 80, 2.5);     // Верх (широкий)
addLine(g, 70, 200, 190, 200, 2.5);   // Низ (уже)
addLine(g, 30, 80, 70, 200, 2.5);     // Левая сторона
addLine(g, 230, 80, 190, 200, 2.5);   // Правая сторона

// ВИД СВЕРХУ
addCircle(g, 130, 40, 100, 2, true);
addCircle(g, 130, 40, 80, 1.5, true);  // Внутренний контур

// ВИД СНИЗУ
addCircle(g, 130, 210, 60, 2, true);

// РАЗМЕРЫ
addDimText(g, 130, 25, 'Ø200мм', 'horizontal');
addDimText(g, 130, 230, 'высота 150мм', 'horizontal');
```

---

## 📐 Чертеж #4: Горшок сужающийся (конус) Ø160×220мм

### Проекции:

```javascript
// ВИД СПЕРЕДИ (трапеция)
addLine(g, 50, 50, 230, 50, 2.5);     // Верх (широкий)
addLine(g, 90, 270, 190, 270, 2.5);   // Низ (узкий)
addLine(g, 50, 50, 90, 270, 2.5);     // Левая сторона
addLine(g, 230, 50, 190, 270, 2.5);   // Правая сторона

// ВИД СВЕРХУ (большой круг)
addCircle(g, 140, 25, 75, 2, true);

// ВИД СНИЗУ (маленький круг)
addCircle(g, 140, 270, 50, 2, true);

// РАЗМЕРЫ
addDimText(g, 140, 15, 'Ø160мм', 'horizontal');
addDimText(g, 140, 290, '220мм высота', 'horizontal');
addDimText(g, 260, 160, 'Ø160→Ø120мм', 'vertical');
```

---

## 📐 Чертеж #5: Горшок высокий узкий Ø140×260мм

### Проекции:

```javascript
// ВИД СПЕРЕДИ (высокий узкий)
addLine(g, 80, 40, 200, 40, 2.5);     // Верх
addLine(g, 90, 300, 190, 300, 2.5);   // Низ (уже)
addLine(g, 80, 40, 90, 300, 2.5);     // Левая сторона (сужение)
addLine(g, 200, 40, 190, 300, 2.5);   // Правая сторона (сужение)

// ВИД СВЕРХУ
addCircle(g, 140, 20, 60, 2, true);

// ВИД СНИЗУ
addCircle(g, 140, 300, 50, 2, true);

// РАЗМЕРЫ
addDimLine(g, 60, 160, 220, 160, 15); // Поясная линия
addDimText(g, 140, 15, 'Ø140мм', 'horizontal');
addDimText(g, 140, 320, '260мм', 'horizontal');
addDimText(g, 230, 170, 'высота 260мм', 'vertical');
```

---

## 🎨 Правила профессионального чертежа

### 1. Линии:
- **Сплошные толстые (2.5px):** Видимые контуры
- **Пунктирные (stroke-dasharray: 4,2):** Скрытые контуры
- **Тонкие (1.5px):** Линии размеров

### 2. Размеры:
- Линия размеров (вынесенная)
- Стрелки на концах
- Текст с размером
- Разрыв в центре линии

### 3. Три проекции:
- **Вид спереди/сбоку:** Основной вид
- **Вид сверху:** Над основным
- **Вид снизу:** Под основным (если нужен)

### 4. Текст:
- Моноширинный шрифт
- Жирный шрифт
- Белый цвет
- Четкие размеры в мм

---

## 🔧 Функции для реализации

```javascript
function addLine(g, x1, y1, x2, y2, width = 2.5) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#ffffff');
    line.setAttribute('stroke-width', width);
    line.setAttribute('stroke-linecap', 'round');
    g.appendChild(line);
}

function addCircle(g, cx, cy, r, width = 2.5, dashed = false) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', '#ffffff');
    circle.setAttribute('stroke-width', width);
    if (dashed) {
        circle.setAttribute('stroke-dasharray', '4,2');
    }
    g.appendChild(circle);
}

function addDimLine(g, x1, y1, x2, y2, gap = 15) {
    // Линия размеров с разрывом
    addLine(g, x1, y1, x2 - gap, y1, 1.5);
    addLine(g, x2 + gap, y1, x2, y1, 1.5);
}

function addDimArrow(g, x, y, direction) {
    if (direction === 'left' || direction === 'right') {
        const size = 3;
        if (direction === 'left') {
            addLine(g, x, y, x + size, y - size, 1.5);
            addLine(g, x, y, x + size, y + size, 1.5);
        } else {
            addLine(g, x, y, x - size, y - size, 1.5);
            addLine(g, x, y, x - size, y + size, 1.5);
        }
    }
}

function addDimText(g, x, y, text, orientation = 'horizontal') {
    const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textElem.setAttribute('x', x);
    textElem.setAttribute('y', y);
    textElem.setAttribute('fill', '#ffffff');
    textElem.setAttribute('font-size', '10');
    textElem.setAttribute('font-weight', 'bold');
    textElem.setAttribute('font-family', 'monospace');
    textElem.setAttribute('text-anchor', 'middle');
    textElem.textContent = text;
    g.appendChild(textElem);
}

function addRect(g, x, y, width, height, strokeWidth = 2.5) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('stroke', '#ffffff');
    rect.setAttribute('stroke-width', strokeWidth);
    rect.setAttribute('stroke-linecap', 'round');
    g.appendChild(rect);
}
```

---

## 📊 Пример полного чертежа (Горшок цилиндрический)

```javascript
function drawProfessionalCylindricalPot(g) {
    // ВИД СПЕРЕДИ - Основной контур
    addLine(g, 40, 40, 40, 240, 2.5);   // Левая сторона
    addLine(g, 240, 40, 240, 240, 2.5); // Правая сторона
    addLine(g, 40, 40, 240, 40, 2.5);    // Верх (горизонтальный)
    addLine(g, 40, 240, 240, 240, 2.5);  // Низ
    
    // ВИД СВЕРХУ - Окружность (пунктир)
    addCircle(g, 140, 20, 80, 2, true);
    
    // ВИД СНИЗУ - Окружность (пунктир)
    addCircle(g, 140, 260, 50, 2, true);
    
    // Горизонтальный размер
    addDimLine(g, 30, 220, 250, 220, 15);
    addDimArrow(g, 30, 220, 'left');
    addDimArrow(g, 250, 220, 'right');
    addDimText(g, 140, 210, 'Ø180мм');
    
    // Вертикальный размер
    addDimLine(g, 260, 35, 260, 245, 15);
    addDimArrow(g, 260, 35, 'top');
    addDimArrow(g, 260, 245, 'bottom');
    addDimText(g, 280, 140, '200мм', 'vertical');
    
    // Технические линии (перпендикуляры)
    addLine(g, 30, 240, 250, 240, 1);  // Линия-база
    addLine(g, 240, 230, 240, 250, 1); // Короткие перпендикуляры
    addLine(g, 40, 230, 40, 250, 1);
}
```

---

**Это профессиональные чертежи как у архитектора в AutoCAD!** 🎯


