// --- Ikony SVG ---
const ICONS = {
    check: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>`,
    undo: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6"></path><path d="m21 13-6-6m6 6-6 6"></path>
        </svg>`,
    trash: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>`
};

// --- Elementy DOM ---
const taskListElement = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const newTaskInput = document.getElementById('new-task-input');
const levelElement = document.getElementById('level');
const xpElement = document.getElementById('xp');
const xpNextLevelElement = document.getElementById('xp-next-level');
const xpBarElement = document.getElementById('xp-bar');
const achievementsListElement = document.getElementById('achievements-list');
const notificationContainer = document.getElementById('notification-container');
const levelUpModal = document.getElementById('level-up-modal');
const newLevelAchievedElement = document.getElementById('new-level-achieved');

// --- Funkcje renderujące i UI ---

const renderTask = (task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
            <button class="btn-icon btn-complete" title="${task.completed ? 'Cofnij' : 'Ukończ'}">
                ${task.completed ? ICONS.undo : ICONS.check}
            </button>
            <button class="btn-icon btn-delete" title="Usuń">
                ${ICONS.trash}
            </button>
        </div>
    `;

    li.querySelector('.btn-complete').addEventListener('click', () => handleCompleteTask(task));
    li.querySelector('.btn-delete').addEventListener('click', () => handleDeleteTask(task.id, li));

    return li;
};

const renderTasks = () => {
    taskListElement.innerHTML = '';
    getTasks().forEach(task => taskListElement.appendChild(renderTask(task)));
};

const renderGamificationPanel = () => {
    const state = getGamificationState();
    const requiredXp = xpForLevel(state.level);
    const xpPercentage = (state.xp / requiredXp) * 100;
    
    levelElement.textContent = state.level;
    xpElement.textContent = state.xp;
    xpNextLevelElement.textContent = requiredXp;
    xpBarElement.style.width = `${xpPercentage}%`;
};

const renderAchievements = () => {
    achievementsListElement.innerHTML = '';
    const state = getGamificationState();
    achievements.forEach(ach => {
        const li = document.createElement('li');
        li.className = `achievement-item ${state.achievements.includes(ach.id) ? 'unlocked' : ''}`;
        li.textContent = ach.description;
        achievementsListElement.appendChild(li);
    });
};

const showNotification = (message) => {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notificationContainer.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
};

const showLevelUpModal = (newLevel) => {
    newLevelAchievedElement.textContent = newLevel;
    levelUpModal.style.display = 'flex';
    setTimeout(() => {
        levelUpModal.style.display = 'none';
    }, 3000); // Ukryj modal po 3 sekundach
};

const updateUI = () => {
    renderTasks();
    renderGamificationPanel();
    renderAchievements();
};

// --- Logika obsługi zdarzeń ---

const handleCompleteTask = (task) => {
    const wasCompleted = task.completed;
    toggleTaskCompletion(task.id);

    if (!wasCompleted) {
        const { newlyUnlocked, levelUp, newLevel } = completeTaskAndGainXp();
        newlyUnlocked.forEach(ach => showNotification(`Osiągnięcie: ${ach.description}!`));
        if (levelUp) {
            showLevelUpModal(newLevel);
        }
    }
    updateUI();
};

const handleDeleteTask = (taskId, taskElement) => {
    taskElement.classList.add('fade-out');
    setTimeout(() => {
        deleteTask(taskId);
        updateUI();
    }, 400); // Czekaj na zakończenie animacji
};

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = newTaskInput.value.trim();
    if (text) {
        addTask(text);
        newTaskInput.value = '';
        updateUI();
    }
});

// --- Inicjalizacja Aplikacji ---
document.addEventListener('DOMContentLoaded', updateUI);
