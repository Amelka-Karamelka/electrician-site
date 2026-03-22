const QUIZ_MODE_KEY = 'quizMode';

function isStageUnlocked(stage) {
    if (stage === 1) return true;
    if (stage === 2) return localStorage.getItem('stage1Completed') === 'true';
    if (stage === 3) return localStorage.getItem('stage2Completed') === 'true';
    return false;
}

function getLockMessage(stage) {
    if (stage === 2) {
        return 'Этап закрыт. Сначала сдайте экзамен этапа "Школа".';
    }
    if (stage === 3) {
        return 'Этап закрыт. Сначала сдайте экзамен этапа "Колледж".';
    }
    return '';
}

function goToStage(stage, mode) {
    localStorage.setItem(QUIZ_MODE_KEY, mode);
    window.location.href = 'questions' + stage + '.html?stage=' + stage;
}

document.addEventListener('DOMContentLoaded', function () {
    const cards = Array.from(document.querySelectorAll('.stage-card'));

    cards.forEach(function (card) {
        const stage = Number(card.dataset.stage);
        const isUnlocked = isStageUnlocked(stage);
        const buttons = Array.from(card.querySelectorAll('.stage-btn'));
        const message = card.querySelector('.stage-lock-message');

        card.classList.toggle('is-locked', !isUnlocked);

        buttons.forEach(function (button) {
            button.disabled = !isUnlocked;

            button.addEventListener('click', function () {
                if (!isUnlocked) return;
                const mode = button.dataset.mode === 'learn' ? 'learn' : 'exam';
                goToStage(stage, mode);
            });
        });

        message.textContent = isUnlocked ? '' : getLockMessage(stage);
    });
});
