/**
 * SANTINO - Главный модуль приложения
 * Профессиональная архитектура модулей
 * 
 * @version 2.0
 * @author SANTINO Team
 */

// ========================================
// ИМПОРТ МОДУЛЕЙ
// ========================================

// Core модули
import { AppCore } from './core/app.js';
import { PerformanceMonitor } from './core/utils/performance.js';
import { PerformanceMonitor as AdvancedPerformanceMonitor } from './core/utils/performance-monitor.js';

// UI модули
import { SwiperCarousel } from './ui/carousel/swiper-init.js';
import { LightningEffect } from './ui/animations/lightning-effect.js';
import { PointerCrosshair } from './ui/animations/pointer-crosshair.js';
import { TiltHover } from './ui/animations/tilt-hover.js';
import { CaliperAnimation } from './ui/animations/caliper-animation.js';

// Business модули
import { StatsManager } from './business/stats/section1-stats.js';
import { ContractManager } from './business/contracts/contract-cards.js';

// Utils модули
import { TickerManager } from './utils/ticker/ticker-unified-module.js';

// ========================================
// КЛАСС ГЛАВНОГО ПРИЛОЖЕНИЯ
// ========================================

class SantinoApp {
    constructor() {
        this.modules = new Map();
        this.isInitialized = false;
        this.performanceMonitor = new PerformanceMonitor();
        this.advancedPerformanceMonitor = new AdvancedPerformanceMonitor();
    }

    /**
     * Инициализация приложения
     */
    async init() {
        try {
            console.log('🚀 SANTINO App: Инициализация...');
            
            // Мониторинг производительности
            this.performanceMonitor.start();
            this.advancedPerformanceMonitor.start();
            
            // Инициализация модулей
            await this.initializeModules();
            
            // Запуск приложения
            await this.start();
            
            this.isInitialized = true;
            console.log('✅ SANTINO App: Инициализация завершена');
            
        } catch (error) {
            console.error('❌ SANTINO App: Ошибка инициализации', error);
            throw error;
        }
    }

    /**
     * Инициализация всех модулей
     */
    async initializeModules() {
        const modules = [
            { name: 'core', instance: new AppCore() },
            { name: 'carousel', instance: new SwiperCarousel() },
            { name: 'lightning', instance: new LightningEffect() },
            { name: 'crosshair', instance: new PointerCrosshair() },
            { name: 'tilt', instance: new TiltHover() },
            { name: 'caliper', instance: new CaliperAnimation() },
            { name: 'stats', instance: new StatsManager() },
            { name: 'contracts', instance: new ContractManager() },
            { name: 'ticker', instance: new TickerManager() }
        ];

        for (const module of modules) {
            try {
                if (module.instance.init) {
                    await module.instance.init();
                }
                this.modules.set(module.name, module.instance);
                console.log(`✅ Модуль ${module.name} инициализирован`);
            } catch (error) {
                console.error(`❌ Ошибка инициализации модуля ${module.name}:`, error);
            }
        }
    }

    /**
     * Запуск приложения
     */
    async start() {
        console.log('🎯 SANTINO App: Запуск...');
        
        // Запуск всех модулей
        for (const [name, module] of this.modules) {
            if (module.start) {
                await module.start();
            }
        }
        
        // Финальная проверка производительности
        this.performanceMonitor.end();
        this.advancedPerformanceMonitor.end();
    }

    /**
     * Получение модуля по имени
     */
    getModule(name) {
        return this.modules.get(name);
    }

    /**
     * Уничтожение приложения
     */
    destroy() {
        for (const [name, module] of this.modules) {
            if (module.destroy) {
                module.destroy();
            }
        }
        this.modules.clear();
        this.isInitialized = false;
    }
}

// ========================================
// ЭКСПОРТ И ИНИЦИАЛИЗАЦИЯ
// ========================================

// Создаем глобальный экземпляр приложения
window.SantinoApp = new SantinoApp();

// Автоматическая инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.SantinoApp.init().catch(error => {
        console.error('Критическая ошибка инициализации SANTINO App:', error);
    });
});

// Экспорт для использования в других модулях
export { SantinoApp };
