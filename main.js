// Raychel智能闹钟广告网站主要JavaScript文件

// 全局变量
let currentScene = null;
let particleApp = null;
let audioContext = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeSceneSelector();
    initializeScrollReveal();
    initializeParticles();
    initializeAudio();
});

// 初始化动画效果
function initializeAnimations() {
    // Hero标题动画
    anime({
        targets: '#heroTitle',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1200,
        easing: 'easeOutExpo',
        delay: 500
    });
    
    // Hero副标题动画
    anime({
        targets: '#heroSubtitle',
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 1000,
        easing: 'easeOutExpo',
        delay: 800
    });
    
    // Hero CTA按钮动画
    anime({
        targets: '#heroCTA',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutExpo',
        delay: 1200
    });
    
    // 音频可视化动画
    anime({
        targets: '#audioVisualizer',
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo',
        delay: 1500
    });
}

// 初始化场景选择器
function initializeSceneSelector() {
    const sleepScene = document.getElementById('sleepScene');
    const wakeScene = document.getElementById('wakeScene');
    const scenePreview = document.getElementById('scenePreview');
    const sleepContent = document.getElementById('sleepContent');
    const wakeContent = document.getElementById('wakeContent');
    
    // 入睡场景点击事件
    sleepScene.addEventListener('click', function() {
        selectScene('sleep');
        showSleepContent();
        updateParticleEffect('forest');
        playSceneAudio('sleep');
    });
    
    // 唤醒场景点击事件
    wakeScene.addEventListener('click', function() {
        selectScene('wake');
        showWakeContent();
        updateParticleEffect('stars');
        playSceneAudio('wake');
    });
    
    // 场景选择函数
    function selectScene(scene) {
        // 移除之前的激活状态
        sleepScene.classList.remove('active');
        wakeScene.classList.remove('active');
        
        // 添加新的激活状态
        if (scene === 'sleep') {
            sleepScene.classList.add('active');
            currentScene = 'sleep';
        } else {
            wakeScene.classList.add('active');
            currentScene = 'wake';
        }
        
        // 场景切换动画
        anime({
            targets: '.scene-card.active',
            scale: [1, 1.02, 1],
            duration: 600,
            easing: 'easeInOutQuad'
        });
    }
    
    // 显示入睡场景内容
    function showSleepContent() {
        scenePreview.classList.add('hidden');
        wakeContent.classList.add('hidden');
        sleepContent.classList.remove('hidden');
        
        // 内容淡入动画
        anime({
            targets: '#sleepContent',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
    
    // 显示唤醒场景内容
    function showWakeContent() {
        scenePreview.classList.add('hidden');
        sleepContent.classList.add('hidden');
        wakeContent.classList.remove('hidden');
        
        // 内容淡入动画
        anime({
            targets: '#wakeContent',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });
    }
}

// 初始化滚动显示效果
function initializeScrollReveal() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // 为不同元素添加不同的动画效果
                if (entry.target.classList.contains('scene-card')) {
                    anime({
                        targets: entry.target,
                        opacity: [0, 1],
                        translateY: [30, 0],
                        duration: 800,
                        easing: 'easeOutExpo',
                        delay: anime.stagger(200)
                    });
                }
            }
        });
    }, observerOptions);
    
    // 观察所有需要滚动显示的元素
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        observer.observe(el);
    });
}

// 初始化粒子效果
function initializeParticles() {
    const particleContainer = document.getElementById('particles');
    
    // 创建PIXI应用
    particleApp = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000,
        backgroundAlpha: 0
    });
    
    particleContainer.appendChild(particleApp.view);
    
    // 创建粒子容器
    const particleContainerPIXI = new PIXI.Container();
    particleApp.stage.addChild(particleContainerPIXI);
    
    // 初始化默认粒子效果（萤火虫）
    createFireflies(particleContainerPIXI);
    
    // 窗口大小调整
    window.addEventListener('resize', function() {
        particleApp.renderer.resize(window.innerWidth, window.innerHeight);
    });
}

// 创建萤火虫粒子效果
function createFireflies(container) {
    const fireflies = [];
    const fireflyCount = 50;
    
    for (let i = 0; i < fireflyCount; i++) {
        const firefly = new PIXI.Graphics();
        firefly.beginFill(0xf4a261, Math.random() * 0.8 + 0.2);
        firefly.drawCircle(0, 0, Math.random() * 3 + 1);
        firefly.endFill();
        
        firefly.x = Math.random() * window.innerWidth;
        firefly.y = Math.random() * window.innerHeight;
        firefly.vx = (Math.random() - 0.5) * 2;
        firefly.vy = (Math.random() - 0.5) * 2;
        firefly.alpha = Math.random();
        firefly.alphaDirection = Math.random() > 0.5 ? 1 : -1;
        
        container.addChild(firefly);
        fireflies.push(firefly);
    }
    
    // 动画循环
    particleApp.ticker.add(function() {
        fireflies.forEach(firefly => {
            firefly.x += firefly.vx;
            firefly.y += firefly.vy;
            
            // 边界检测
            if (firefly.x < 0 || firefly.x > window.innerWidth) firefly.vx *= -1;
            if (firefly.y < 0 || firefly.y > window.innerHeight) firefly.vy *= -1;
            
            // 透明度变化
            firefly.alpha += firefly.alphaDirection * 0.01;
            if (firefly.alpha <= 0.1 || firefly.alpha >= 0.9) {
                firefly.alphaDirection *= -1;
            }
        });
    });
}

// 创建星星粒子效果
function createStars(container) {
    const stars = [];
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = new PIXI.Graphics();
        star.beginFill(0xffffff, Math.random() * 0.8 + 0.2);
        star.drawCircle(0, 0, Math.random() * 2 + 0.5);
        star.endFill();
        
        star.x = Math.random() * window.innerWidth;
        star.y = Math.random() * window.innerHeight;
        star.twinkleSpeed = Math.random() * 0.02 + 0.01;
        star.baseAlpha = Math.random() * 0.5 + 0.3;
        
        container.addChild(star);
        stars.push(star);
    }
    
    let time = 0;
    
    // 动画循环
    particleApp.ticker.add(function() {
        time += 0.01;
        stars.forEach((star, index) => {
            star.alpha = star.baseAlpha + Math.sin(time * star.twinkleSpeed + index) * 0.3;
        });
    });
}

// 更新粒子效果
function updateParticleEffect(type) {
    // 清除现有粒子
    particleApp.stage.removeChildren();
    const newContainer = new PIXI.Container();
    particleApp.stage.addChild(newContainer);
    
    if (type === 'forest') {
        createFireflies(newContainer);
    } else if (type === 'stars') {
        createStars(newContainer);
    }
}

// 初始化音频系统
function initializeAudio() {
    // 创建音频上下文
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Web Audio API not supported');
    }
    
    const voiceButtons = document.querySelectorAll('[data-action="voice-sample"]');
    voiceButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const type = this.getAttribute('data-voice');
            if (type === 'sleep' || type === 'wake') {
                playVoiceSample();
            } else {
                playVoiceSample();
            }
        });
    });
}

// 播放场景音频
function playSceneAudio(scene) {
    if (!audioContext) return;
    
    // 创建振荡器来模拟音频效果
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (scene === 'sleep') {
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    } else {
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // 更新音频可视化器
    updateAudioVisualizer();
}

// 播放语音样本
function playVoiceSample() {
    if (!audioContext) return;
    
    // 恢复音频上下文（如果被暂停）
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    // 创建语音效果
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // 设置语音频率
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 1);
    
    oscillator.type = 'sine';
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
    
    // 更新音频可视化器
    updateAudioVisualizer();
}

// 更新音频可视化器
function updateAudioVisualizer() {
    const audioBars = document.querySelectorAll('.audio-bar');
    
    audioBars.forEach((bar, index) => {
        anime({
            targets: bar,
            height: [10, 40, 10],
            duration: 1500,
            easing: 'easeInOutSine',
            delay: index * 100,
            loop: 3
        });
    });
}

// 平滑滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 导航链接点击事件
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        scrollToElement(targetId);
    }
});

// 按钮悬停效果
document.addEventListener('mouseover', function(e) {
    if (e.target.classList.contains('glow-effect')) {
        anime({
            targets: e.target,
            scale: 1.05,
            duration: 200,
            easing: 'easeOutQuad'
        });
    }
});

document.addEventListener('mouseout', function(e) {
    if (e.target.classList.contains('glow-effect')) {
        anime({
            targets: e.target,
            scale: 1,
            duration: 200,
            easing: 'easeOutQuad'
        });
    }
});

// 窗口滚动效果
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-bg');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// 响应式处理
window.addEventListener('resize', function() {
    if (particleApp) {
        particleApp.renderer.resize(window.innerWidth, window.innerHeight);
    }
});

// 页面可见性变化处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停动画
        if (particleApp) {
            particleApp.ticker.stop();
        }
    } else {
        // 页面显示时恢复动画
        if (particleApp) {
            particleApp.ticker.start();
        }
    }
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('JavaScript错误:', e.error);
});

// 导出主要函数供其他脚本使用
window.RaychelApp = {
    selectScene: function(scene) {
        const sleepScene = document.getElementById('sleepScene');
        const wakeScene = document.getElementById('wakeScene');
        
        if (scene === 'sleep') {
            sleepScene.click();
        } else if (scene === 'wake') {
            wakeScene.click();
        }
    },
    playAudio: function(type) {
        playSceneAudio(type);
    },
    scrollTo: scrollToElement
};
