const TASKS_STORAGE_KEY = 'gamified_todo_tasks';

const getTasks = () => {
    const tasks = localStorage.getItem(TASKS_STORAGE_KEY);
    return tasks ? JSON.parse(tasks) : initialTasks;
};

const saveTasks = (tasks) => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const addTask = (text) => {
    const tasks = getTasks();
    const newTask = {
        id: Date.now().toString(),
        text,
        completed: false,
    };
    tasks.push(newTask);
    saveTasks(tasks);
    return newTask;
};

const deleteTask = (id) => {
    let tasks = getTasks();
    tasks = tasks.filter(task => task.id !== id);
    saveTasks(tasks);
    return tasks;
};

const toggleTaskCompletion = (id) => {
    let tasks = getTasks();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasks(tasks);
        return tasks[taskIndex].completed;
    }
    return false;
};