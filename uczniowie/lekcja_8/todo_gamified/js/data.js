const initialTasks = [
    { id: '1', text: 'Zaprojektować interfejs użytkownika', completed: false },
    { id: '2', text: 'Zaimplementować dodawanie zadań', completed: false },
    { id: '3', text: 'Stylizować listę zadań', completed: false },
];

const initialGamificationState = {
    xp: 0,
    level: 1,
    achievements: [] // Tutaj będą przechowywane ID odblokowanych osiągnięć
};

const achievements = [
    {
        id: 'FIRST_TASK',
        description: 'Pierwsze koty za płoty (Ukończ 1 zadanie)',
        condition: (tasks, state) => tasks.filter(t => t.completed).length >= 1
    },
    {
        id: 'FIVE_TASKS',
        description: 'Mistrz Produktywności (Ukończ 5 zadań)',
        condition: (tasks, state) => tasks.filter(t => t.completed).length >= 5
    },
    {
        id: 'LEVEL_3',
        description: 'Weteran (Osiągnij poziom 3)',
        condition: (tasks, state) => state.level >= 3
    },
    {
        id: 'CLEAN_SWEEP',
        description: 'Czyste konto (Ukończ wszystkie zadania)',
        condition: (tasks, state) => tasks.length > 0 && tasks.every(t => t.completed)
    }
];