/**
 * SANTINO - Система фоновых чертежей
 * Профессиональные чертежи цветочных горшков
 * 
 * @version 3.0
 * @author SANTINO Team
 */

(function() {
    'use strict';
    
    console.log('🔍 BlueprintsSVG: Инициализация...');
    
    function initBlueprints() {
        const container = document.getElementById('blueprints-container');
        
        if (!container) {
            console.error('❌ Контейнер не найден');
            return;
        }
        
        console.log('✅ Контейнер найден');
        
        container.style.cssText = `
            position: absolute !important;
            inset: 0 !important;
            z-index: 100 !important;
            pointer-events: none !important;
            overflow: visible !important;
            opacity: 1 !important;
            visibility: visible !important;
        `;
        
        let activeBlueprints = [];
        const maxBlueprints = 3;
        
        function createBlueprint(type) {
            const x = Math.random() * (window.innerWidth - 400) + 50;
            const y = Math.random() * (window.innerHeight - 400) + 50;
            const scale = 0.8 + Math.random() * 0.5;
            const rotation = (Math.random() - 0.5) * 20;
            
            const wrapper = document.createElement('div');
            wrapper.style.cssText = `
                position: absolute !important;
                left: ${x}px !important;
                top: ${y}px !important;
                width: 280px !important;
                height: 340px !important;
                z-index: 101 !important;
                pointer-events: none !important;
                opacity: 0 !important;
                transform: rotate(${rotation}deg) scale(${scale}) !important;
                transition: opacity 0.8s ease !important;
            `;
            
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 280 340');
            svg.style.width = '100%';
            svg.style.height = '100%';
            
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            
            if (type === 'cylindrical') drawCylindricalPot(g);
            if (type === 'square') drawSquarePot(g);
            if (type === 'round') drawRoundPot(g);
            if (type === 'tapered') drawTaperedPot(g);
            
            function addLine(g, x1, y1, x2, y2, strokeWidth = 2.5) {
                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#ffffff');
                line.setAttribute('stroke-width', strokeWidth);
                line.setAttribute('stroke-linecap', 'round');
                g.appendChild(line);
            }
            
            function addCircle(g, cx, cy, r, strokeWidth = 2.5, dash = false) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', cx);
                circle.setAttribute('cy', cy);
                circle.setAttribute('r', r);
                circle.setAttribute('fill', 'none');
                circle.setAttribute('stroke', '#ffffff');
                circle.setAttribute('stroke-width', strokeWidth);
                if (dash) circle.setAttribute('stroke-dasharray', '4,2');
                g.appendChild(circle);
            }
            
            function addRect(g, x, y, w, h, strokeWidth = 2.5) {
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', w);
                rect.setAttribute('height', h);
                rect.setAttribute('fill', 'none');
                rect.setAttribute('stroke', '#ffffff');
                rect.setAttribute('stroke-width', strokeWidth);
                g.appendChild(rect);
            }
            
            function addText(g, x, y, text, fontSize = 12) {
                const textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                textElem.setAttribute('x', x);
                textElem.setAttribute('y', y);
                textElem.setAttribute('fill', '#ffffff');
                textElem.setAttribute('font-size', fontSize);
                textElem.setAttribute('font-weight', 'bold');
                textElem.setAttribute('text-anchor', 'middle');
                textElem.setAttribute('font-family', 'monospace');
                textElem.textContent = text;
                g.appendChild(textElem);
            }
            
            function drawCylindricalPot(g) {
                addLine(g, 60, 40, 60, 250, 2.5);
                addLine(g, 220, 40, 220, 250, 2.5);
                addLine(g, 60, 40, 220, 40, 2.5);
                addLine(g, 60, 250, 220, 250, 2.5);
                addCircle(g, 140, 20, 35, 2, true);
                addText(g, 140, 280, 'Ø180мм × 200мм', 12);
            }
            
            function drawSquarePot(g) {
                addRect(g, 60, 50, 160, 180, 2.5);
                addRect(g, 100, 15, 80, 80, 2);
                g.querySelector('rect:nth-child(2)').setAttribute('stroke-dasharray', '4,2');
                addLine(g, 60, 50, 70, 25, 2);
                addLine(g, 220, 50, 210, 25, 2);
                addText(g, 140, 250, '150×150мм × 180мм', 12);
            }
            
            function drawRoundPot(g) {
                addCircle(g, 140, 150, 60, 2.5);
                addCircle(g, 140, 150, 40, 2.5);
                addCircle(g, 140, 20, 50, 2, true);
                addText(g, 140, 270, 'Ø200мм × 150мм', 12);
            }
            
            function drawTaperedPot(g) {
                addLine(g, 60, 50, 140, 280, 2.5);
                addLine(g, 220, 50, 140, 280, 2.5);
                addLine(g, 60, 50, 220, 50, 2.5);
                addLine(g, 100, 280, 180, 280, 2.5);
                addCircle(g, 140, 15, 38, 2, true);
                addCircle(g, 140, 280, 12, 2, true);
                addText(g, 140, 300, 'Ø160мм × 220мм', 12);
            }
            
            svg.appendChild(g);
            wrapper.appendChild(svg);
            container.appendChild(wrapper);
            activeBlueprints.push(wrapper);
            
            setTimeout(() => {
                wrapper.style.opacity = '1';
            }, 50);
            
            setTimeout(() => {
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.remove();
                    activeBlueprints = activeBlueprints.filter(b => b !== wrapper);
                }, 800);
            }, 10000 + Math.random() * 5000);
        }
        
        setTimeout(() => createBlueprint('cylindrical'), 500);
        
        setInterval(() => {
            if (activeBlueprints.length < maxBlueprints) {
                const types = ['cylindrical', 'square', 'round', 'tapered'];
                createBlueprint(types[Math.floor(Math.random() * types.length)]);
            }
        }, 4000 + Math.random() * 3000);
        
        console.log('✅ Система чертежей запущена');
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBlueprints);
    } else {
        initBlueprints();
    }
})();
