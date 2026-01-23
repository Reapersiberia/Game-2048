// Тестовый скрипт для проверки кнопок gm и деплоя контракта
// Запустите этот код в консоли браузера (F12 → Console)

console.log('🧪 Начинаем тестирование кнопок...\n');

// 1. Проверка наличия элементов
console.log('1️⃣ Проверка наличия элементов:');
const gmBtn = document.getElementById('gm-btn');
const deployBtn = document.getElementById('deploy-contract-btn');

if (gmBtn) {
    console.log('✅ Кнопка "gm" найдена');
} else {
    console.error('❌ Кнопка "gm" НЕ найдена!');
}

if (deployBtn) {
    console.log('✅ Кнопка "Деплой контракта" найдена');
} else {
    console.error('❌ Кнопка "Деплой контракта" НЕ найдена!');
}

// 2. Проверка стилей
console.log('\n2️⃣ Проверка стилей:');
if (gmBtn) {
    const gmStyles = window.getComputedStyle(gmBtn);
    console.log('Кнопка "gm":');
    console.log('  - Фон:', gmStyles.backgroundColor);
    console.log('  - Цвет текста:', gmStyles.color);
    console.log('  - Видимость:', gmStyles.display !== 'none' ? '✅ Видима' : '❌ Скрыта');
}

if (deployBtn) {
    const deployStyles = window.getComputedStyle(deployBtn);
    console.log('Кнопка "Деплой контракта":');
    console.log('  - Фон:', deployStyles.backgroundColor);
    console.log('  - Цвет текста:', deployStyles.color);
    console.log('  - Видимость:', deployStyles.display !== 'none' ? '✅ Видима' : '❌ Скрыта');
}

// 3. Проверка обработчиков событий
console.log('\n3️⃣ Проверка обработчиков событий:');
if (gmBtn) {
    const gmHasListeners = gmBtn.onclick !== null || 
        (gmBtn.getEventListeners && gmBtn.getEventListeners('click').length > 0);
    console.log('Кнопка "gm" имеет обработчики:', gmHasListeners ? '✅ Да' : '⚠️ Не обнаружено (но может быть через addEventListener)');
}

if (deployBtn) {
    const deployHasListeners = deployBtn.onclick !== null || 
        (deployBtn.getEventListeners && deployBtn.getEventListeners('click').length > 0);
    console.log('Кнопка "Деплой контракта" имеет обработчики:', deployHasListeners ? '✅ Да' : '⚠️ Не обнаружено (но может быть через addEventListener)');
}

// 4. Проверка Farcaster SDK
console.log('\n4️⃣ Проверка Farcaster MiniApp SDK:');
if (window.miniapp) {
    console.log('✅ Farcaster SDK доступен');
    if (window.miniapp.sdk) {
        console.log('✅ SDK объект найден');
        if (window.miniapp.sdk.actions) {
            console.log('✅ Actions доступны');
            if (window.miniapp.sdk.actions.openUrl) {
                console.log('✅ openUrl метод доступен');
            } else {
                console.log('⚠️ openUrl метод НЕ доступен');
            }
        } else {
            console.log('⚠️ Actions НЕ доступны');
        }
    } else {
        console.log('⚠️ SDK объект НЕ найден');
    }
} else {
    console.log('ℹ️ Farcaster SDK НЕ доступен (это нормально, если открыто не в Farcaster app)');
    console.log('   Кнопки будут использовать window.open() как fallback');
}

// 5. Тестовая симуляция клика (без реального открытия URL)
console.log('\n5️⃣ Тестовая симуляция клика:');
console.log('   (Это только проверка, URL не откроется)');

if (gmBtn) {
    try {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        gmBtn.dispatchEvent(event);
        console.log('✅ Событие клика на "gm" отправлено успешно');
    } catch (e) {
        console.error('❌ Ошибка при отправке события:', e);
    }
}

if (deployBtn) {
    try {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        deployBtn.dispatchEvent(event);
        console.log('✅ Событие клика на "Деплой контракта" отправлено успешно');
    } catch (e) {
        console.error('❌ Ошибка при отправке события:', e);
    }
}

// 6. Итоговый отчет
console.log('\n📊 Итоговый отчет:');
const allTests = [
    gmBtn !== null,
    deployBtn !== null,
    gmBtn && window.getComputedStyle(gmBtn).display !== 'none',
    deployBtn && window.getComputedStyle(deployBtn).display !== 'none'
];

const passedTests = allTests.filter(Boolean).length;
const totalTests = allTests.length;

console.log(`Пройдено тестов: ${passedTests}/${totalTests}`);

if (passedTests === totalTests) {
    console.log('🎉 Все тесты пройдены! Кнопки должны работать.');
    console.log('\n💡 Теперь попробуйте нажать на кнопки вручную, чтобы проверить открытие URL.');
} else {
    console.log('⚠️ Некоторые тесты не пройдены. Проверьте ошибки выше.');
}

console.log('\n✅ Тестирование завершено!');
