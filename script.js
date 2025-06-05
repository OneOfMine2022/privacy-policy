// Smart QR Pocket 隐私政策网站脚本
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initializeLastUpdated();
    initializeSmoothScrolling();
    initializeScrollToTop();
    initializePrintFunction();
    initializeAccessibility();
    
    console.log('Smart QR Pocket 隐私政策页面已加载');
});

// Update last modified date
function initializeLastUpdated() {
    const lastUpdatedElement = document.getElementById('last-updated');
    if (lastUpdatedElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = today.toLocaleDateString('en-US', options);
        lastUpdatedElement.textContent = formattedDate;
    }
}

// 平滑滚动到锚点
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 回到顶部功能
function initializeScrollToTop() {
    // 创建回到顶部按钮
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', '回到顶部');
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // 显示/隐藏按钮
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // 点击事件
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // 悬停效果
    scrollToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}

// 打印功能
function initializePrintFunction() {
    // 添加键盘快捷键 Ctrl+P
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 'p') {
            e.preventDefault();
            window.print();
        }
    });
}

// 辅助功能增强
function initializeAccessibility() {
    // 为所有交互元素添加焦点指示器
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select');
    interactiveElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // 键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
}

// 响应式菜单切换（如果需要）
function toggleMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
}

// 复制链接功能
function copyPageLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
            showNotification('链接已复制到剪贴板');
        }).catch(function() {
            fallbackCopyTextToClipboard(url);
        });
    } else {
        fallbackCopyTextToClipboard(url);
    }
}

// 备用复制方法
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('链接已复制到剪贴板');
    } catch (err) {
        console.error('复制失败:', err);
        showNotification('复制失败，请手动复制链接');
    }
    
    document.body.removeChild(textArea);
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 表单验证（如果有联系表单）
function validateContactForm(form) {
    const email = form.querySelector('input[type="email"]');
    const message = form.querySelector('textarea');
    let isValid = true;
    
    // 清除之前的错误
    form.querySelectorAll('.error').forEach(error => error.remove());
    
    // 验证邮箱
    if (email && !isValidEmail(email.value)) {
        showFieldError(email, '请输入有效的邮箱地址');
        isValid = false;
    }
    
    // 验证消息
    if (message && message.value.trim().length < 10) {
        showFieldError(message, '消息内容至少需要10个字符');
        isValid = false;
    }
    
    return isValid;
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示字段错误
function showFieldError(field, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = message;
    error.style.cssText = `
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 5px;
    `;
    field.parentNode.insertBefore(error, field.nextSibling);
}

// 暗黑模式切换（可选功能）
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 加载暗黑模式偏好
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// 导出为PDF功能（需要外部库支持）
function exportToPDF() {
    // 这里可以集成PDF生成库，如jsPDF
    showNotification('PDF导出功能开发中...');
}

// 语言切换功能（如果支持多语言）
function switchLanguage(lang) {
    // 这里可以实现语言切换逻辑
    console.log('切换语言到:', lang);
}

// 页面性能监控
function trackPagePerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('页面加载时间:', pageLoadTime + 'ms');
        });
    }
}

// 初始化性能监控
trackPagePerformance(); 