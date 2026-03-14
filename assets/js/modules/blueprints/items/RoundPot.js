/**
 * САНТИНО - Чертеж круглого горшка
 * Ø200мм × 150мм
 */

export class RoundPot {
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
        // ЦЕНТРОВЫЕ ЛИНИИ (горизонтальные и вертикальные)
        this.addLine(40, 150, 50, 150, 1);
        this.addLine(240, 150, 250, 150, 1);
        this.addLine(140, 50, 140, 60, 1);
        this.addLine(140, 240, 140, 250, 1);
        // Пунктирные центровые
        this.addLine(50, 150, 240, 150, 0.8, true);
        this.addLine(140, 60, 140, 240, 0.8, true);
        
        // ОСЕВАЯ ЛИНИЯ (ось симметрии)
        this.addLine(140, 60, 140, 240, 1.2);
        
        // ВИД СПЕРЕДИ - Две окружности
        this.addCircle(140, 150, 100, 2.5);  // Внешняя
        this.addCircle(140, 150, 80, 2.5);   // Внутренняя (толщина стенки)
        
        // ДНО (контур отдельно)
        this.addCircle(140, 150, 70, 1.5);
        this.addCircle(140, 150, 90, 1);
        
        // ВИД СВЕРХУ - Проекция (пунктир)
        this.addCircle(140, 40, 100, 2.5, true);   // Внешняя
        this.addCircle(140, 40, 80, 2, true);      // Внутренняя
        this.addCircle(140, 40, 10, 1.5);          // Центр
        
        // ТОЧКИ ОТСЧЕТА
        this.addCircle(140, 50, 2, 1.5);
        this.addCircle(140, 250, 2, 1.5);
        this.addCircle(40, 150, 2, 1.5);
        this.addCircle(240, 150, 2, 1.5);
        
        // ЛИНИИ РАЗМЕРОВ (радиусные - горизонтальные)
        this.addLine(140, 250, 240, 150, 1.2);
        this.addLine(140, 250, 40, 150, 1.2);
        this.addLine(140, 250, 240, 250, 1.2);
        this.addDimArrow(240, 150, 'right');
        this.addDimArrow(40, 150, 'left');
        this.addText(190, 200, 'R100', 10);
        
        // ЛИНИИ РАЗМЕРОВ (вертикальные)
        this.addLine(270, 50, 270, 250, 1.2);
        this.addLine(270, 50, 280, 50, 1.2);
        this.addLine(270, 250, 280, 250, 1.2);
        this.addDimArrow(270, 50, 'top');
        this.addDimArrow(270, 250, 'bottom');
        this.addText(290, 150, '150', 10);
        
        // ШТРИХОВКА СЕЧЕНИЯ (круговые линии)
        for (let i = 0; i < 8; i++) {
            const angle = i * 45;
            const rad = angle * Math.PI / 180;
            const x1 = 140 + 85 * Math.cos(rad);
            const y1 = 150 + 85 * Math.sin(rad);
            const x2 = 140 + 95 * Math.cos(rad);
            const y2 = 150 + 95 * Math.sin(rad);
            this.addLine(x1, y1, x2, y2, 0.6);
        }
        
        // ТЕХНИЧЕСКАЯ ИНФОРМАЦИЯ
        this.addText(140, 12, 'ВИД СВЕРХУ (А)', 7);
        this.addText(140, 280, 'ВИД СПЕРЕДИ', 7);
        this.addText(40, 145, 'A', 8);
        this.addText(240, 145, 'A', 8);
        
        // ШКАЛА
        this.addLine(30, 260, 40, 260, 0.5);
        this.addLine(30, 258, 30, 262, 0.5);
        this.addLine(40, 258, 40, 262, 0.5);
        this.addLine(140, 258, 140, 262, 0.5);
        this.addLine(240, 258, 240, 262, 0.5);
        this.addText(35, 272, '0', 6);
        this.addText(140, 272, '100', 6);
        this.addText(240, 272, '200', 6);
    }
}
