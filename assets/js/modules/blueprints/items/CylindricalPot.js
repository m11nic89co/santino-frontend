/**
 * САНТИНО - Чертеж цилиндрического горшка (ГОСТ 2.307-2011)
 * Ø180мм × 200мм
 * Масштаб 1:1
 */

export class CylindricalPot {
    constructor(group) {
        this.g = group;
        this.draw();
    }

    addLine(x1, y1, x2, y2, width = 2.5, dashed = false) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#4ec9f3');
        line.setAttribute('stroke-width', width * 0.7);
        line.setAttribute('stroke-linecap', 'round');
        if (dashed) line.setAttribute('stroke-dasharray', '3,2');
        this.g.appendChild(line);
        return line;
    }

    addLineWithDash(x1, y1, x2, y2, width = 1.5) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', 'rgba(78, 201, 243, 0.5)');
        line.setAttribute('stroke-width', width * 0.7);
        line.setAttribute('stroke-dasharray', '2,2');
        line.setAttribute('stroke-linecap', 'round');
        this.g.appendChild(line);
        return line;
    }

    addCircle(cx, cy, r, width = 2.5, dashed = false) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', 'none');
        circle.setAttribute('stroke', '#4ec9f3');
        circle.setAttribute('stroke-width', width * 0.7);
        if (dashed) circle.setAttribute('stroke-dasharray', '4,2');
        this.g.appendChild(circle);
        return circle;
    }

    addText(x, y, text, fontSize = 12) {
        const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttribute('x', x);
        textElem.setAttribute('y', y);
        textElem.setAttribute('fill', '#4ec9f3');
        textElem.setAttribute('font-size', fontSize);
        textElem.setAttribute('font-weight', 'bold');
        textElem.setAttribute('font-family', 'monospace');
        textElem.setAttribute('text-anchor', 'middle');
        textElem.textContent = text;
        this.g.appendChild(textElem);
        return textElem;
    }

    addDimArrow(x, y, dir) {
        const size = 5;
        if (dir === 'left') {
            this.addLine(x, y, x + size, y - size, 2);
            this.addLine(x, y, x + size, y + size, 2);
        } else if (dir === 'right') {
            this.addLine(x, y, x - size, y - size, 2);
            this.addLine(x, y, x - size, y + size, 2);
        } else if (dir === 'top') {
            this.addLine(x, y, x - size, y + size, 2);
            this.addLine(x, y, x + size, y + size, 2);
        } else if (dir === 'bottom') {
            this.addLine(x, y, x - size, y - size, 2);
            this.addLine(x, y, x + size, y - size, 2);
        }
    }

    addDimLine(x1, y1, x2, y2, gap = 20) {
        this.addLine(x1, y1, x2 - gap, y1, 1);
        this.addLine(x2 + gap, y1, x2, y1, 1);
    }

    addRect(x, y, w, h, strokeWidth = 2.5, fill = false, dashed = false) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('stroke', '#4ec9f3');
        rect.setAttribute('stroke-width', strokeWidth * 0.7);
        if (dashed) rect.setAttribute('stroke-dasharray', '4,2');
        if (fill) rect.setAttribute('fill', 'rgba(78, 201, 243, 0.05)');
        else rect.setAttribute('fill', 'none');
        this.g.appendChild(rect);
        return rect;
    }

    draw() {
        // ШТАМП (ГОСТ 2.104-2006) - Основная надпись
        this.addRect(160, 280, 110, 50, 1);
        this.addLine(200, 280, 200, 330, 1);
        this.addLine(160, 295, 270, 295, 1);
        this.addLine(160, 310, 270, 310, 1);
        this.addText(180, 290, 'Формат', 6);
        this.addText(235, 290, 'А4', 6);
        this.addText(180, 305, 'Масштаб', 6);
        this.addText(235, 305, '1:1', 6);
        this.addText(165, 325, 'ЧЕРТЕЖ', 7);
        
        // ЦЕНТРОВЫЕ ЛИНИИ (ГОСТ - выходят за контур на 3-5мм)
        this.addLineWithDash(20, 140, 260, 140, 0.8);   // Горизонтальная
        this.addLineWithDash(140, 15, 140, 265, 0.8);  // Вертикальная
        
        // ОСЕВАЯ ЛИНИЯ (ось симметрии - длинная для полного вида)
        this.addLine(140, 5, 140, 270, 1.2);
        
        // ВИД СПЕРЕДИ - Основной контур (сплошная толстая)
        this.addLine(40, 40, 40, 240, 3);
        this.addLine(240, 40, 240, 240, 3);
        this.addLine(40, 40, 240, 40, 3);
        this.addLine(40, 240, 240, 240, 3);
        
        // Внутренний контур (толщина стенки 5мм) - сплошная тонкая
        this.addLine(50, 50, 50, 230, 1.5);
        this.addLine(230, 50, 230, 230, 1.5);
        this.addLine(50, 50, 230, 50, 1.5);
        this.addLine(50, 230, 230, 230, 1.5);
        
        // ДНО горшка - видимое сечение
        this.addLine(60, 220, 220, 220, 2);
        this.addLine(60, 240, 220, 240, 2);
        this.addLine(60, 220, 60, 240, 2);
        this.addLine(220, 220, 220, 240, 2);
        
        // ВИД СВЕРХУ - Проекция (штрихпунктирная)
        this.addCircle(140, 20, 90, 2, true);
        this.addCircle(140, 20, 70, 1.5, true);
        
        // ВИД СНИЗУ - Проекция (штрихпунктирная)
        this.addCircle(140, 260, 60, 2, true);
        this.addCircle(140, 260, 45, 1.5, true);
        
        // ТОЧКИ ОТСЧЕТА (пересечения по ГОСТ)
        this.addCircle(40, 40, 2.5, 1.5);
        this.addCircle(240, 40, 2.5, 1.5);
        this.addCircle(40, 240, 2.5, 1.5);
        this.addCircle(240, 240, 2.5, 1.5);
        
        // РАЗМЕРНЫЕ ЛИНИИ (ГОСТ 2.307-2011)
        // Горизонтальный размер Ø180
        const dimY = 250;
        this.addLine(20, dimY, 40, dimY, 1.2);   // Вспомогательная
        this.addLine(240, dimY, 260, dimY, 1.2);
        this.addLine(40, dimY, 240, dimY, 1, true); // Размерная линия (пунктир)
        this.addDimArrow(40, dimY, 'left');
        this.addDimArrow(240, dimY, 'right');
        this.addText(140, dimY + 15, 'Ø180', 10);
        
        // Вертикальный размер 200
        const dimX = 255;
        this.addLine(dimX, 40, dimX, 240, 1, true);
        this.addDimArrow(240, dimY - 200, 'top');
        this.addDimArrow(240, dimY, 'bottom');
        this.addText(dimX + 10, dimY - 100, '200', 10);
        
        // ШТРИХОВКА СЕЧЕНИЯ (ГОСТ 2.306-68, угол 45°)
        for (let i = 0; i < 12; i++) {
            const x = 55 + i * 14;
            this.addLine(x, 230, x + 10, 50, 0.8);
        }
        
        // ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ (ГОСТ)
        this.addText(140, 10, 'ГОРШОК ЦИЛИНДРИЧЕСКИЙ', 8);
        this.addText(140, 35, 'ВИД СВЕРХУ', 7);
        this.addText(140, 285, 'ВИД СНИЗУ', 7);
        this.addText(40, 33, 'А', 8);
        this.addText(240, 33, 'А', 8);
        
        // МАСШТАБ И ГАБАРИТНЫЕ РАЗМЕРЫ
        this.addText(10, 140, 'А-А', 7);
        this.addText(10, 270, '200', 7);
    }
}
