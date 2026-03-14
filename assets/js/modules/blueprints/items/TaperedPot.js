/**
 * САНТИНО - Чертеж сужающегося горшка
 * Ø160мм × 220мм
 */

export class TaperedPot {
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
        this.addLine(140, 20, 140, 50, 1);
        this.addLine(140, 270, 140, 290, 1);
        this.addLine(50, 160, 50, 160, 1);
        this.addLine(230, 160, 230, 160, 1);
        
        // ОСЕВАЯ ЛИНИЯ
        this.addLine(140, 50, 140, 270, 1.2);
        this.addLine(140, 50, 140, 270, 0.6, true);
        
        // ВИД СПЕРЕДИ - Трапеция
        this.addLine(50, 50, 230, 50, 2.5);     // Верх (широкий)
        this.addLine(90, 270, 190, 270, 2.5);   // Низ (узкий)
        this.addLine(50, 50, 90, 270, 2.5);     // Левая сторона (сужение)
        this.addLine(230, 50, 190, 270, 2.5);   // Правая сторона (сужение)
        
        // Внутренний контур
        this.addLine(60, 60, 220, 60, 1.5);
        this.addLine(95, 265, 185, 265, 1.5);
        
        // ДНО отдельно
        this.addLine(90, 270, 190, 270, 1);
        this.addCircle(140, 270, 50, 1);
        
        // ВИД СВЕРХУ - Большая окружность (пунктир)
        this.addCircle(140, 20, 80, 2.5, true);
        this.addCircle(140, 20, 60, 2, true);
        this.addCircle(140, 20, 10, 1.5);
        
        // ВИД СНИЗУ - Маленькая окружность (пунктир)
        this.addCircle(140, 260, 50, 2.5, true);
        this.addCircle(140, 260, 45, 2, true);
        
        // Вспомогательные линии сужения
        this.addLine(85, 260, 145, 160, 1);
        this.addLine(195, 260, 135, 160, 1);
        
        // ТОЧКИ ОТСЧЕТА
        this.addCircle(50, 50, 2, 1.5);
        this.addCircle(230, 50, 2, 1.5);
        this.addCircle(90, 270, 2, 1.5);
        this.addCircle(190, 270, 2, 1.5);
        
        // РАЗМЕРЫ (горизонтальный - верх)
        this.addLine(30, 60, 250, 60, 1.2);
        this.addLine(30, 58, 30, 62, 1.2);
        this.addLine(250, 58, 250, 62, 1.2);
        this.addDimArrow(30, 60, 'left');
        this.addDimArrow(250, 60, 'right');
        this.addText(140, 58, '160', 10);
        
        // РАЗМЕРЫ (вертикальный)
        this.addLine(270, 50, 270, 270, 1.2);
        this.addLine(270, 50, 280, 50, 1.2);
        this.addLine(270, 270, 280, 270, 1.2);
        this.addDimArrow(270, 50, 'top');
        this.addDimArrow(270, 270, 'bottom');
        this.addText(295, 160, '220', 10);
        
        // ШТРИХОВКА СЕЧЕНИЯ
        for (let i = 0; i < 12; i++) {
            const y = 60 + i * 16;
            const widthTop = 180;
            const widthBottom = 100;
            const currWidth = widthTop - (y - 60) * (widthTop - widthBottom) / 200;
            const x = 140 - currWidth / 2;
            this.addLine(x, y, x + currWidth, y, 0.6);
        }
        
        // ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ
        this.addText(140, 10, 'ВИД СВЕРХУ (А)', 7);
        this.addText(140, 290, 'ВИД СНИЗУ', 7);
        this.addText(140, 40, 'A', 8);
        this.addText(140, 250, 'A', 8);
        
        // ШКАЛА
        this.addLine(40, 280, 50, 280, 0.5);
        this.addLine(40, 278, 40, 282, 0.5);
        this.addLine(50, 278, 50, 282, 0.5);
        this.addLine(140, 278, 140, 282, 0.5);
        this.addLine(230, 278, 230, 282, 0.5);
        this.addText(45, 293, '0', 6);
        this.addText(140, 293, '80', 6);
        this.addText(230, 293, '160', 6);
    }
}
