// Получение данных из URL
const urlParams = new URLSearchParams(window.location.search); // Извлечение параметров из строки запроса
const correct = parseInt(urlParams.get('correct'), 10) || 0; // Количество правильных ответов (по умолчанию 0)
const total = parseInt(urlParams.get('total'), 10) || 0; // Общее количество вопросов (по умолчанию 0)
const isPassed = correct === total;

// Элементы страницы
const resultText = document.getElementById('result-text'); // Элемент для текста результата
const retryBtn = document.getElementById('retry-btn'); // Кнопка "Пройти ещё раз"
const nextBtn = document.getElementById('next-btn'); // Кнопка "Перейти на следующий этап"
const certificate = document.getElementById('certificate'); // Контейнер с изображением удостоверения

// Функция для отображения результата
function displayResult(correct, total) {
    if (correct === total) {
        // Если все ответы правильные
        resultText.textContent = `Поздравляем! Вам присвоен 3 разряд по специальности электромонтер по ремонту и обслуживанию электрооборудования.`; // Сообщение об успешном завершении
        resultText.style.color = 'green'; // Устанавливаем зелёный цвет текста
        nextBtn.textContent = 'Перейти на уровень выше';
        nextBtn.style.display = 'inline-block'; // Показываем кнопку "Перейти на следующий этап"
        retryBtn.style.display = 'inline-block'; // Показываем кнопку "Пройти экзамен ещё раз"
        certificate.style.display = 'block'; // Показываем изображение удостоверения
        localStorage.setItem('stage3Completed', 'true'); // Устанавливаем флаг в localStorage, что этап 3 завершён
    } else {
        // Если ответы частично или полностью неправильные
        resultText.textContent = `Вы правильно ответили на ${correct} из ${total} вопросов. Попробуйте ещё раз.`; // Сообщение о необходимости повторного прохождения
        resultText.style.color = 'red'; // Устанавливаем красный цвет текста
        retryBtn.style.display = 'inline-block'; // Показываем кнопку "Пройти ещё раз"
        nextBtn.textContent = 'Пройти обучение';
        nextBtn.style.display = 'inline-block';
        certificate.style.display = 'none'; // Скрываем изображение удостоверения
    }
}

// Добавление обработчиков событий к кнопкам
function addEventListeners() {
    retryBtn.addEventListener('click', () => {
        localStorage.setItem('quizMode', 'exam');
        window.location.href = 'questions3.html?stage=3'; // Перезапуск экзамена этапа 3
    });

    nextBtn.addEventListener('click', () => {
        if (isPassed) {
            window.location.href = 'index.html'; // Переход к следующему этапу
            return;
        }

        localStorage.setItem('quizMode', 'learn');
        window.location.href = 'questions3.html?stage=3'; // Переход в обучение текущего этапа
    });
}

// Инициализация страницы
function init() {
    displayResult(correct, total); // Отображение результата
    addEventListeners(); // Добавление обработчиков событий к кнопкам
}

// Запуск инициализации
init(); // Основной вызов для запуска функциональности
