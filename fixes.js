// НОВЫЕ ФУНКЦИИ ДЛЯ ТАЙМЕРА И ЧАТА - вставить в index.html в раздел <script>

// ============= НОВАЯ ЛОГИКА ТАЙМЕРА БЕЗ BASESECONDS =============

const setupWorkTimeListeners = () => {
    // Слушаем Turbik
    if(workTimeListenerTurbik) workTimeListenerTurbik();
    workTimeListenerTurbik = onValue(ref(db, 'worktime/turbik'), (snapshot) => {
        const data = snapshot.val() || {};
        workTimeIsRunningTurbik = data.isRunning || false;
        workTimeStartTurbik = data.startTime || null;
        
        const btn = document.getElementById('pausePlayBtnTurbik');
        if(btn) {
            if(workTimeIsRunningTurbik) {
                btn.style.background = 'rgba(34, 197, 94, 0.2)';
                btn.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                btn.innerHTML = '<i data-lucide="pause" style="width: 20px; height: 20px; color: #22c55e;"></i>';
                if(displayUpdateTimerTurbik) clearInterval(displayUpdateTimerTurbik);
                displayUpdateTimerTurbik = setInterval(() => {
                    updateWorkTimeDisplay('turbik');
                }, 1000);
            } else {
                btn.style.background = 'rgba(59, 130, 246, 0.3)';
                btn.style.borderColor = '#3b82f6';
                btn.innerHTML = '<i data-lucide="play" style="width: 20px; height: 20px; color: #60a5fa;"></i>';
                if(displayUpdateTimerTurbik) clearInterval(displayUpdateTimerTurbik);
            }
            lucide.createIcons();
        }
        updateWorkTimeDisplay('turbik');
    });
    
    // Слушаем Yono
    if(workTimeListenerYono) workTimeListenerYono();
    workTimeListenerYono = onValue(ref(db, 'worktime/yono'), (snapshot) => {
        const data = snapshot.val() || {};
        workTimeIsRunningYono = data.isRunning || false;
        workTimeStartYono = data.startTime || null;
        
        const btn = document.getElementById('pausePlayBtnYono');
        if(btn) {
            if(workTimeIsRunningYono) {
                btn.style.background = 'rgba(34, 197, 94, 0.2)';
                btn.style.borderColor = 'rgba(34, 197, 94, 0.4)';
                btn.innerHTML = '<i data-lucide="pause" style="width: 20px; height: 20px; color: #22c55e;"></i>';
                if(displayUpdateTimerYono) clearInterval(displayUpdateTimerYono);
                displayUpdateTimerYono = setInterval(() => {
                    updateWorkTimeDisplay('yono');
                }, 1000);
            } else {
                btn.style.background = 'rgba(239, 68, 68, 0.3)';
                btn.style.borderColor = '#ef4444';
                btn.innerHTML = '<i data-lucide="play" style="width: 20px; height: 20px; color: #f87171;"></i>';
                if(displayUpdateTimerYono) clearInterval(displayUpdateTimerYono);
            }
            lucide.createIcons();
        }
        updateWorkTimeDisplay('yono');
    });
};

// ============= ЧАТ С GROQ =============

let chatListener = null;
const GROQ_API_KEY = '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';

const setupChatListener = () => {
    if(chatListener) chatListener();
    chatListener = onValue(ref(db, 'chats'), (snapshot) => {
        const messages = [];
        snapshot.forEach(child => {
            messages.push({ id: child.key, ...child.val() });
        });
        
        messages.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        
        const chatMessages = document.getElementById('chatMessages');
        if(chatMessages) {
            chatMessages.innerHTML = '';
            messages.forEach(msg => {
                const div = document.createElement('div');
                div.style.display = 'flex';
                div.style.justifyContent = msg.role === 'user' ? 'flex-end' : 'flex-start';
                
                const bubble = document.createElement('div');
                if(msg.role === 'user') {
                    bubble.style.background = 'linear-gradient(135deg, #8b5cf6, #7c3aed)';
                    bubble.style.color = 'white';
                    bubble.style.borderRadius = '18px 4px 18px 18px';
                } else {
                    bubble.style.background = 'rgba(139, 92, 246, 0.1)';
                    bubble.style.color = '#a78bfa';
                    bubble.style.borderRadius = '4px 18px 18px 18px';
                    bubble.style.borderLeft = '3px solid #8b5cf6';
                }
                bubble.style.padding = '12px 16px';
                bubble.style.maxWidth = '70%';
                bubble.style.wordWrap = 'break-word';
                bubble.style.fontSize = '14px';
                div.append(bubble);
                bubble.textContent = msg.content;
                chatMessages.append(div);
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    });
};

window.sendChatMessage = async () => {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if(!message) return;
    
    input.value = '';
    input.focus();
    
    const userMsg = {
        role: 'user',
        content: message,
        timestamp: Date.now(),
        author: window.currentUserEmail
    };
    push(ref(db, 'chats'), userMsg);
    
    // Сразу скроллим вниз
    const chatMessages = document.getElementById('chatMessages');
    if(chatMessages) {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }
    
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer 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`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'mixtral-8x7b-32768',
                messages: [{
                    role: 'user',
                    content: `You are a helpful coding assistant. Help in Russian. Question: ${message}`
                }],
                max_tokens: 1000,
                temperature: 0.7
            })
        });
        
        if(!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || 'Ошибка при получении ответа';
        
        const aiMsg = {
            role: 'assistant',
            content: content,
            timestamp: Date.now()
        };
        push(ref(db, 'chats'), aiMsg);
    } catch (err) {
        console.error('Chat error:', err);
        const errorMsg = {
            role: 'assistant',
            content: '❌ Ошибка подключения к AI',
            timestamp: Date.now()
        };
        push(ref(db, 'chats'), errorMsg);
    }
};

// Отправка сообщения по Enter (Shift+Enter для новой строки)
document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if(chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendChatMessage();
            }
        });
    }
});
