/**
 * SANTINO - Professional Performance Monitor
 * Мировые стандарты мониторинга производительности
 * 
 * @version 2.0
 * @author SANTINO Team
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: null,
            paint: null,
            resource: null,
            userTiming: null
        };
        this.isMonitoring = false;
        this.startTime = performance.now();
    }

    /**
     * Запуск мониторинга производительности
     */
    start() {
        if (this.isMonitoring) return;
        
        console.log('🚀 Performance Monitor: Запуск мониторинга...');
        
        this.isMonitoring = true;
        this.startTime = performance.now();
        
        // Мониторинг Navigation Timing
        this.monitorNavigationTiming();
        
        // Мониторинг Paint Timing
        this.monitorPaintTiming();
        
        // Мониторинг Resource Timing
        this.monitorResourceTiming();
        
        // Мониторинг User Timing
        this.monitorUserTiming();
        
        // Мониторинг Core Web Vitals
        this.monitorCoreWebVitals();
        
        console.log('✅ Performance Monitor: Мониторинг запущен');
    }

    /**
     * Мониторинг Navigation Timing
     */
    monitorNavigationTiming() {
        if (!performance.getEntriesByType) return;
        
        const navigation = performance.getEntriesByType('navigation')[0];
        if (!navigation) return;
        
        this.metrics.navigation = {
            // DNS
            dns: navigation.domainLookupEnd - navigation.domainLookupStart,
            
            // TCP
            tcp: navigation.connectEnd - navigation.connectStart,
            
            // Request
            request: navigation.responseStart - navigation.requestStart,
            
            // Response
            response: navigation.responseEnd - navigation.responseStart,
            
            // DOM Processing
            domProcessing: navigation.domContentLoadedEventEnd - navigation.responseEnd,
            
            // Load Complete
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            
            // Total Load Time
            totalLoadTime: navigation.loadEventEnd - navigation.navigationStart
        };
        
        console.log('📊 Navigation Timing:', this.metrics.navigation);
    }

    /**
     * Мониторинг Paint Timing
     */
    monitorPaintTiming() {
        if (!performance.getEntriesByType) return;
        
        const paintEntries = performance.getEntriesByType('paint');
        this.metrics.paint = {};
        
        paintEntries.forEach(entry => {
            this.metrics.paint[entry.name] = entry.startTime;
        });
        
        console.log('🎨 Paint Timing:', this.metrics.paint);
    }

    /**
     * Мониторинг Resource Timing
     */
    monitorResourceTiming() {
        if (!performance.getEntriesByType) return;
        
        const resources = performance.getEntriesByType('resource');
        this.metrics.resource = {
            totalResources: resources.length,
            totalSize: 0,
            loadTime: 0,
            slowResources: []
        };
        
        resources.forEach(resource => {
            const loadTime = resource.responseEnd - resource.startTime;
            const size = resource.transferSize || 0;
            
            this.metrics.resource.totalSize += size;
            this.metrics.resource.loadTime += loadTime;
            
            // Медленные ресурсы (> 1 секунды)
            if (loadTime > 1000) {
                this.metrics.resource.slowResources.push({
                    name: resource.name,
                    loadTime: loadTime,
                    size: size
                });
            }
        });
        
        console.log('📦 Resource Timing:', this.metrics.resource);
    }

    /**
     * Мониторинг User Timing
     */
    monitorUserTiming() {
        if (!performance.getEntriesByType) return;
        
        const userTiming = performance.getEntriesByType('measure');
        this.metrics.userTiming = userTiming.map(entry => ({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime
        }));
        
        console.log('⏱️ User Timing:', this.metrics.userTiming);
    }

    /**
     * Мониторинг Core Web Vitals
     */
    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observeLCP();
        
        // First Input Delay (FID)
        this.observeFID();
        
        // Cumulative Layout Shift (CLS)
        this.observeCLS();
    }

    /**
     * Наблюдение за Largest Contentful Paint
     */
    observeLCP() {
        if (!window.PerformanceObserver) return;
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            
            console.log('🎯 LCP (Largest Contentful Paint):', lastEntry.startTime);
            
            // Отправка метрики
            this.sendMetric('lcp', lastEntry.startTime);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    /**
     * Наблюдение за First Input Delay
     */
    observeFID() {
        if (!window.PerformanceObserver) return;
        
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                console.log('👆 FID (First Input Delay):', entry.processingStart - entry.startTime);
                
                // Отправка метрики
                this.sendMetric('fid', entry.processingStart - entry.startTime);
            });
        });
        
        observer.observe({ entryTypes: ['first-input'] });
    }

    /**
     * Наблюдение за Cumulative Layout Shift
     */
    observeCLS() {
        if (!window.PerformanceObserver) return;
        
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            console.log('📐 CLS (Cumulative Layout Shift):', clsValue);
            
            // Отправка метрики
            this.sendMetric('cls', clsValue);
        });
        
        observer.observe({ entryTypes: ['layout-shift'] });
    }

    /**
     * Отправка метрики (заглушка для демонстрации)
     */
    sendMetric(name, value) {
        // В реальном проекте здесь была бы отправка в аналитику
        console.log(`📈 Metric ${name}: ${value}`);
    }

    /**
     * Получение отчета о производительности
     */
    getReport() {
        const report = {
            timestamp: new Date().toISOString(),
            totalTime: performance.now() - this.startTime,
            metrics: this.metrics
        };
        
        console.log('📋 Performance Report:', report);
        return report;
    }

    /**
     * Завершение мониторинга
     */
    end() {
        if (!this.isMonitoring) return;
        
        console.log('🏁 Performance Monitor: Завершение мониторинга...');
        
        this.isMonitoring = false;
        
        // Финальный отчет
        const report = this.getReport();
        
        // Сохранение отчета в localStorage для отладки
        localStorage.setItem('santino-performance-report', JSON.stringify(report));
        
        console.log('✅ Performance Monitor: Мониторинг завершен');
    }
}

// Экспорт для использования в других модулях
export { PerformanceMonitor };
