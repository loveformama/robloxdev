// ⚠️ ДОСТУП ТОЛЬКО ДЛЯ РАЗРАБОТЧИКОВ
// СТРОГО КОНФИДЕНЦИАЛЬНО - НЕ РАСПРОСТРАНЯТЬ

const CONFIG = {
    // Email адреса для определения ролей
    USERS: {
        TURBIK: 'seniorturbik@gmail.com',
        YONO: 'glebushkameet@gmail.com'
    },
    
    // Firebase конфигурация
    FIREBASE: {
        apiKey: 'AIzaSyBeh9td4w8tt2AYwEo4PMTE14459zolJV0',
        authDomain: 'math-project-8195b.firebaseapp.com',
        databaseURL: 'https://math-project-8195b-default-rtdb.europe-west1.firebasedatabase.app',
        projectId: 'math-project-8195b',
        storageBucket: 'math-project-8195b.firebasestorage.app',
        messagingSenderId: '947622423521',
        appId: '1:947622423521:web:fbaa98fddad1cf99f740a0'
    },
    
    // Другие настройки
    SETTINGS: {
        AUTH_EXPIRY_DAYS: 30,
        NOTIFICATION_THROTTLE_MS: 2000,
        AUTO_DELETE_COMPLETED_MS: 36000000, // 10 часов
        TIMER_UPDATE_INTERVAL_MS: 1000
    }
};

// Защита от утечек - не логируем конфиг в консоль
if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    console.warn('🔒 Конфиг загружен локально');
}
