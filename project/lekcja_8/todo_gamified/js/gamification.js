const GAMIFICATION_STORAGE_KEY = 'gamified_todo_gamification';
const XP_PER_TASK = 50;

const xpForLevel = (level) => {
    return 100 + (level - 1) * 50; // Progresywny system: Lvl 1->100XP, Lvl 2->150XP, itd.
}

const getGamificationState = () => {
    const state = localStorage.getItem(GAMIFICATION_STORAGE_KEY);
    // Upewnijmy się, że stan zawsze ma tablicę achievements
    if (state) {
        const parsedState = JSON.parse(state);
        if (!parsedState.achievements) {
            parsedState.achievements = [];
        }
        return parsedState;
    }
    return initialGamificationState;
};

const saveGamificationState = (state) => {
    localStorage.setItem(GAMIFICATION_STORAGE_KEY, JSON.stringify(state));
};

const checkAchievements = (tasks, state) => {
    const newlyUnlocked = [];
    achievements.forEach(achievement => {
        if (!state.achievements.includes(achievement.id)) {
            if (achievement.condition(tasks, state)) {
                state.achievements.push(achievement.id);
                newlyUnlocked.push(achievement);
            }
        }
    });
    return newlyUnlocked;
};

const addXp = (amount) => {
    const state = getGamificationState();
    const tasks = getTasks();
    let levelUp = false;
    let newLevel = state.level;

    state.xp += amount;
    
    let requiredXp = xpForLevel(state.level);
    while (state.xp >= requiredXp) {
        state.xp -= requiredXp;
        state.level += 1;
        newLevel = state.level;
        levelUp = true;
        requiredXp = xpForLevel(state.level);
    }
    
    const newlyUnlocked = checkAchievements(tasks, state);
    
    saveGamificationState(state);
    return { state, newlyUnlocked, levelUp, newLevel };
};

const completeTaskAndGainXp = () => {
    const { state, newlyUnlocked, levelUp, newLevel } = addXp(XP_PER_TASK);
    const tasks = getTasks();
    
    const taskAchievements = checkAchievements(tasks, state);
    
    saveGamificationState(state);

    return { state, newlyUnlocked: newlyUnlocked.concat(taskAchievements), levelUp, newLevel };
};