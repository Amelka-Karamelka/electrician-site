// Получение данных из URL
const urlParams = new URLSearchParams(window.location.search); // Параметры из строки запроса
const correct = parseInt(urlParams.get('correct'), 10) || 0; // Количество правильных ответов, по умолчанию 0
const total = parseInt(urlParams.get('total'), 10) || 0; // Общее количество вопросов, по умолчанию 0
const isPassed = correct === total;

// Элементы страницы
const resultText = document.getElementById('result-text'); // Элемент для отображения текста результата
const retryBtn = document.getElementById('retry-btn'); // Кнопка "Пройти ещё раз"
const nextBtn = document.getElementById('next-btn'); // Кнопка "Перейти на следующий этап"
const certificate = document.getElementById('certificate'); // Контейнер для изображения сертификата

// Функция для отображения результата
function displayResult(correct, total) {
    if (correct === total) {
        // Если все ответы правильные
        resultText.textContent = `Поздравляю! Вы окончили школу и получили аттестат.`; // Сообщение о завершении
        resultText.style.color = 'green'; // Зелёный текст для успешного результата
        nextBtn.textContent = 'Перейти на уровень выше';
        nextBtn.style.display = 'inline-block'; // Показываем кнопку "Перейти на следующий этап"
        retryBtn.style.display = 'inline-block'; // Показываем кнопку "Пройти экзамен ещё раз"
        certificate.style.display = 'block'; // Показываем изображение аттестата
        localStorage.setItem('stage1Completed', 'true'); // Сохраняем флаг завершения этапа в localStorage
    } else {
        // Если ответы частично или полностью неправильные
        resultText.textContent = `Вы правильно ответили на ${correct} из ${total} вопросов. Попробуйте ещё раз.`; // Сообщение о результате
        resultText.style.color = 'red'; // Красный текст для неудачного результата
        retryBtn.style.display = 'inline-block'; // Показываем кнопку "Пройти ещё раз"
        nextBtn.textContent = 'Пройти обучение';
        nextBtn.style.display = 'inline-block';
        certificate.style.display = 'none'; // Скрываем изображение аттестата
    }
}

// Функция для добавления обработчиков событий к кнопкам
function addEventListeners() {
    retryBtn.addEventListener('click', () => {
        localStorage.setItem('quizMode', 'exam');
        window.location.href = 'questions1.html?stage=1'; // Перезапуск экзамена этапа 1
    });

    nextBtn.addEventListener('click', () => {
        if (isPassed) {
            window.location.href = 'index.html'; // Переход к следующему этапу
            return;
        }

        localStorage.setItem('quizMode', 'learn');
        window.location.href = 'questions1.html?stage=1'; // Переход в обучение текущего этапа
    });
}

// Функция инициализации страницы
function init() {
    displayResult(correct, total); // Отображаем результат в зависимости от количества правильных ответов
    addEventListeners(); // Добавляем обработчики событий
}

// Запуск инициализации
init(); // Основной вызов для запуска функциональности
