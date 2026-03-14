/**
 * САНТИНО - Чертеж квадратного горшка
 * 150×150мм × 180мм
 */

export class SquarePot {
    constructor(group) {
        this.g = group;
        this.draw();
    }

    addLine(x1, y1, x2, y2, width = 2.5) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#4ec9f3');
        line.setAttribute('stroke-width', width * 0.7);
        line.setAttribute('stroke-linecap', 'round');
        this.g.appendChild(line);
        return line;
    }

    addLineWithDash(x1, y1, x2, y2, width = 1) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#4ec9f3');
        line.setAttribute('stroke-width', width * 0.7);
        line.setAttribute('stroke-dasharray', '3,2');
        line.setAttribute('stroke-linecap', 'round');
        this.g.appendChild(line);
        return line;
    }

    addRect(x, y, w, h, strokeWidth = 2.5, fill = false, dashed = false) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', w);
        rect.setAttribute('height', h);
        rect.setAttribute('stroke', '#4ec9f3');
        rect.setAttribute('stroke-width', strokeWidth);
        if (dashed) rect.setAttribute('stroke-dasharray', '4,2');
        if (fill) rect.setAttribute('fill', 'rgba(255, 255, 255, 0.05)');
        else rect.setAttribute('fill', 'none');
        this.g.appendChild(rect);
        return rect;
    }

    addCircle(x, y, r, strokeWidth = 1, fill = false) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', r);
        circle.setAttribute('stroke', '#4ec9f3');
        circle.setAttribute('stroke-width', strokeWidth);
        if (fill) circle.setAttribute('fill', 'rgba(255, 255, 255, 0.8)');
        else circle.setAttribute('fill', 'none');
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
        const size = 4;
        if (dir === 'left') {
            this.addLine(x, y, x + size, y - size, 1.5);
            this.addLine(x, y, x + size, y + size, 1.5);
        } else if (dir === 'right') {
            this.addLine(x, y, x - size, y - size, 1.5);
            this.addLine(x, y, x - size, y + size, 1.5);
        } else if (dir === 'top') {
            this.addLine(x, y, x - size, y + size, 1.5);
            this.addLine(x, y, x + size, y + size, 1.5);
        } else if (dir === 'bottom') {
            this.addLine(x, y, x - size, y - size, 1.5);
            this.addLine(x, y, x + size, y - size, 1.5);
        }
    }

    draw() {
        // ЦЕНТРОВЫЕ ЛИНИИ
        this.addLineWithDash(30, 140, 50, 140, 0.5);  // Левая
        this.addLineWithDash(230, 140, 250, 140, 0.5); // Правая
        this.addLineWithDash(140, 30, 140, 50, 0.5);   // Верхняя
        this.addLineWithDash(140, 230, 140, 250, 0.5); // Нижняя
        
        // ОСЕВЫЕ ЛИНИИ (горизонтальная и вертикальная)
        this.addLine(50, 140, 230, 140, 0.8);
        this.addLine(140, 50, 140, 230, 0.8);
        this.addLine(50, 140, 230, 140, 0.5, true);
        this.addLine(140, 50, 140, 230, 0.5, true);
        
        // ВИД СПЕРЕДИ - Основной контур
        this.addRect(50, 50, 180, 180, 2.5);
        
        // Внутренний контур (толщина стенки 5мм)
        this.addRect(60, 60, 160, 160, 1.5);
        
        // ДНО горшка (отдельно выделяем)
        this.addRect(70, 220, 140, 10, 1);
        this.addLine(70, 220, 210, 220, 1);
        this.addLine(70, 230, 210, 230, 1);
        
        // ВИД СВЕРХУ - Проекция (пунктир с затенением)
        this.addRect(70, 15, 140, 140, 2, false, true);
        this.addRect(75, 20, 130, 130, 1.5, false, true);
        // Диагонали для объема
        this.addLine(70, 15, 140, 85, 1);
        this.addLine(210, 15, 140, 85, 1);
        this.addLine(70, 155, 140, 85, 1);
        this.addLine(210, 155, 140, 85, 1);
        
        // ВИД СБОКУ - Проекция (пунктир справа)
        this.addRect(240, 50, 40, 180, 2, false, true);
        
        // ТОЧКИ ОТСЧЕТА
        this.addCircle(50, 50, 2, 1.5);
        this.addCircle(230, 50, 2, 1.5);
        this.addCircle(50, 230, 2, 1.5);
        this.addCircle(230, 230, 2, 1.5);
        
        // РАЗМЕРЫ ГОРИЗОНТАЛЬНЫЕ
        // Верхний размер
        this.addLine(50, 30, 50, 220, 1.2);
        this.addLine(230, 30, 230, 220, 1.2);
        this.addLine(50, 30, 230, 30, 1.2);
        this.addDimArrow(50, 30, 'left');
        this.addDimArrow(230, 30, 'right');
        this.addText(140, 28, '150', 10);
        
        // Нижний размер
        this.addLine(50, 250, 230, 250, 1.2);
        this.addDimArrow(50, 250, 'left');
        this.addDimArrow(230, 250, 'right');
        this.addText(140, 265, '150', 10);
        
        // РАЗМЕРЫ ВЕРТИКАЛЬНЫЕ
        this.addLine(270, 50, 270, 230, 1.2);
        this.addLine(270, 50, 280, 50, 1.2);
        this.addLine(270, 230, 280, 230, 1.2);
        this.addDimArrow(270, 50, 'top');
        this.addDimArrow(270, 230, 'bottom');
        this.addText(290, 140, '180', 10);
        
        // ШТРИХОВКА СЕЧЕНИЯ
        for (let i = 0; i < 12; i++) {
            const x = 60 + i * 13;
            this.addLine(x, 60, x + 10, 220, 0.6);
        }
        
        // ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ
        this.addText(140, 12, 'ВИД СВЕРХУ', 7);
        this.addText(260, 140, 'ВИД СБОКУ', 7);
        this.addText(140, 245, 'А', 8);
        this.addText(140, 35, 'А', 8);
        
        // ШКАЛА
        this.addLine(40, 260, 50, 260, 0.5);
        this.addLine(40, 258, 40, 262, 0.5);
        this.addLine(50, 258, 50, 262, 0.5);
        this.addLine(140, 258, 140, 262, 0.5);
        this.addLine(230, 258, 230, 262, 0.5);
        this.addText(45, 273, '0', 6);
        this.addText(140, 273, '75', 6);
        this.addText(230, 273, '150', 6);
    }
}
