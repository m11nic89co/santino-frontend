/**
 * САНТИНО - Чертеж высокого узкого горшка
 * Ø140мм × 260мм
 */

export class TallPot {
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
        this.addLine(140, 10, 140, 40, 1);
        this.addLine(140, 270, 140, 300, 1);
        this.addLine(80, 170, 90, 170, 1);
        this.addLine(190, 170, 200, 170, 1);
        this.addLine(140, 40, 140, 270, 1.2);
        
        // ОСЕВАЯ ЛИНИЯ (ось симметрии)
        this.addLine(140, 40, 140, 270, 1.2);
        this.addLine(140, 40, 140, 270, 0.6, true);
        
        // ВИД СПЕРЕДИ - Высокий узкий
        this.addLine(80, 40, 200, 40, 2.5);     // Верх
        this.addLine(90, 300, 190, 300, 2.5);   // Низ (уже)
        this.addLine(80, 40, 90, 300, 2.5);     // Левая сторона (сужение)
        this.addLine(200, 40, 190, 300, 2.5);   // Правая сторона (сужение)
        
        // Внутренний контур
        this.addLine(85, 50, 195, 50, 1.5);
        this.addLine(92, 295, 188, 295, 1.5);
        
        // ДНО отдельно
        this.addLine(90, 300, 190, 300, 1);
        this.addCircle(140, 300, 50, 1);
        
        // ВИД СВЕРХУ - Маленькая окружность (пунктир)
        this.addCircle(140, 20, 60, 2.5, true);
        this.addCircle(140, 20, 50, 2, true);
        this.addCircle(140, 20, 10, 1.5);
        
        // ВИД СНИЗУ - Очень маленькая окружность (пунктир)
        this.addCircle(140, 280, 50, 2.5, true);
        this.addCircle(140, 280, 45, 2, true);
        
        // Вспомогательные линии сужения
        this.addLine(85, 280, 95, 170, 1);
        this.addLine(195, 280, 185, 170, 1);
        this.addLine(90, 170, 190, 170, 1);
        
        // ТОЧКИ ОТСЧЕТА
        this.addCircle(80, 40, 2, 1.5);
        this.addCircle(200, 40, 2, 1.5);
        this.addCircle(90, 300, 2, 1.5);
        this.addCircle(190, 300, 2, 1.5);
        this.addCircle(140, 40, 2, 1.5);
        this.addCircle(140, 300, 2, 1.5);
        
        // РАЗМЕРЫ (вертикальные)
        this.addLine(210, 40, 210, 300, 1.2);
        this.addLine(210, 40, 220, 40, 1.2);
        this.addLine(210, 300, 220, 300, 1.2);
        this.addDimArrow(210, 40, 'top');
        this.addDimArrow(210, 300, 'bottom');
        this.addText(235, 170, '260', 10);
        
        // РАЗМЕРЫ (горизонтальные - верх)
        this.addLine(80, 30, 200, 30, 1.2);
        this.addLine(80, 28, 80, 32, 1.2);
        this.addLine(200, 28, 200, 32, 1.2);
        this.addDimArrow(80, 30, 'left');
        this.addDimArrow(200, 30, 'right');
        this.addText(140, 28, '140', 10);
        
        // ШТРИХОВКА СЕЧЕНИЯ
        for (let i = 0; i < 15; i++) {
            const y = 50 + i * 16;
            this.addLine(85 + (y - 50) * 0.05, y, 195 - (y - 50) * 0.05, y, 0.6);
        }
        
        // ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ
        this.addText(140, 12, 'ВИД СВЕРХУ', 7);
        this.addText(140, 315, 'ВИД СНИЗУ', 7);
        this.addText(70, 170, 'A', 8);
        this.addText(210, 170, 'A', 8);
        
        // ШКАЛА
        this.addLine(60, 310, 70, 310, 0.5);
        this.addLine(60, 308, 60, 312, 0.5);
        this.addLine(70, 308, 70, 312, 0.5);
        this.addLine(140, 308, 140, 312, 0.5);
        this.addLine(210, 308, 210, 312, 0.5);
        this.addText(65, 323, '0', 6);
        this.addText(140, 323, '70', 6);
        this.addText(210, 323, '140', 6);
    }
}
