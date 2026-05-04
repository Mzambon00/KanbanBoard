/**
 * Kanban Board - Sistema de Tarefas com Drag & Drop
 * Funcionalidades: Drag & Drop, Adicionar, Editar, Excluir, Dark Mode, localStorage
 */

// ===== ESTRUTURA DE DADOS =====
let tasks = {
    todo: [],      // A Fazer
    doing: [],     // Em Andamento
    done: []       // Concluído
};

let nextId = 1;

// ===== DOM ELEMENTOS =====
const taskLists = {
    todo: document.getElementById('todoList'),
    doing: document.getElementById('doingList'),
    done: document.getElementById('doneList')
};

const counters = {
    todo: document.getElementById('todoCount'),
    doing: document.getElementById('doingCount'),
    done: document.getElementById('doneCount')
};

const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const addBtn = document.getElementById('addTaskBtn');
const darkModeToggle = document.getElementById('darkModeToggle');
const clearDoneBtn = document.getElementById('clearDoneBtn');

// ===== INICIALIZAÇÃO =====
function init() {
    loadFromLocalStorage();
    renderAllColumns();
    setupDragAndDrop();
    setupEventListeners();
    setupDarkMode();
    updateAllCounters();
}

// ===== PERSISTÊNCIA (localStorage) =====
function saveToLocalStorage() {
    const dataToSave = {
        tasks: tasks,
        nextId: nextId
    };
    localStorage.setItem('kanbanData', JSON.stringify(dataToSave));
}

function loadFromLocalStorage() {
    const savedData = localStorage.getItem('kanbanData');
    if (savedData) {
        try {
            const parsed = JSON.parse(savedData);
            tasks = parsed.tasks;
            nextId = parsed.nextId;
            // Garantir que todas as colunas existam
            if (!tasks.todo) tasks.todo = [];
            if (!tasks.doing) tasks.doing = [];
            if (!tasks.done) tasks.done = [];
        } catch(e) {
            console.error('Erro ao carregar dados:', e);
            resetDefaultData();
        }
    } else {
        resetDefaultData();
    }
}

function resetDefaultData() {
    tasks = {
        todo: [
            { id: 1, text: "Estudar JavaScript", date: getTodayDate(), category: "high" },
            { id: 2, text: "Implementar Drag & Drop", date: getTomorrowDate(), category: "medium" }
        ],
        doing: [
            { id: 3, text: "Criar interface do Kanban", date: getTodayDate(), category: "low" }
        ],
        done: []
    };
    nextId = 4;
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getTomorrowDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// ===== RENDERIZAÇÃO =====
function renderAllColumns() {
    renderColumn('todo');
    renderColumn('doing');
    renderColumn('done');
    updateAllCounters();
}

function renderColumn(columnId) {
    const container = taskLists[columnId];
    if (!container) return;
    
    container.innerHTML = '';
    const columnTasks = tasks[columnId];
    
    if (columnTasks.length === 0) {
        container.innerHTML = '<div class="task-card" style="opacity:0.6; cursor:default; text-align:center;">📭 Nenhuma tarefa</div>';
        return;
    }
    
    columnTasks.forEach(task => {
        const taskElement = createTaskElement(task, columnId);
        container.appendChild(taskElement);
    });
}

function createTaskElement(task, columnId) {
    const div = document.createElement('div');
    div.className = 'task-card';
    div.setAttribute('data-id', task.id);
    div.setAttribute('data-column', columnId);
    div.setAttribute('draggable', 'true');
    
    // Texto da tarefa
    const textSpan = document.createElement('div');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    
    // Data com verificação de atraso
    const dateSpan = document.createElement('div');
    dateSpan.className = 'task-date';
    const today = new Date().toISOString().split('T')[0];
    if (task.date && task.date < today && columnId !== 'done') {
        dateSpan.classList.add('overdue');
        dateSpan.innerHTML = `📅 ${task.date} ⚠️ Atrasada`;
    } else if (task.date) {
        dateSpan.innerHTML = `📅 ${task.date}`;
    } else {
        dateSpan.innerHTML = `📅 Sem data`;
    }
    
    // Categoria (cor)
    const categoryClass = task.category || 'medium';
    const categorySpan = document.createElement('span');
    categorySpan.className = `task-category category-${categoryClass}`;
    categorySpan.title = `Prioridade: ${getCategoryName(categoryClass)}`;
    
    // Footer com categoria e botão deletar
    const footer = document.createElement('div');
    footer.className = 'task-footer';
    
    const leftDiv = document.createElement('div');
    leftDiv.appendChild(categorySpan);
    leftDiv.appendChild(dateSpan);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-task';
    deleteBtn.innerHTML = '❌';
    deleteBtn.title = 'Excluir tarefa';
    deleteBtn.onclick = (e) => {
        e.stopPropagation();
        deleteTask(task.id, columnId);
    };
    
    footer.appendChild(leftDiv);
    footer.appendChild(deleteBtn);
    
    div.appendChild(textSpan);
    div.appendChild(footer);
    
    // Evento de duplo clique para editar
    textSpan.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        editTask(textSpan, task.id, columnId);
    });
    
    // Eventos de Drag & Drop
    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
    });
    
    return div;
}

function getCategoryName(category) {
    const names = { low: 'Baixa', medium: 'Média', high: 'Alta' };
    return names[category] || 'Média';
}

// ===== DRAG & DROP =====
let draggedItem = null;

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.setData('text/plain', JSON.stringify({
        id: this.getAttribute('data-id'),
        sourceColumn: this.getAttribute('data-column')
    }));
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    if (draggedItem) {
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
}

function setupDragAndDrop() {
    // Adicionar event listeners para cada coluna
    for (const columnId in taskLists) {
        const column = taskLists[columnId];
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });
        
        column.addEventListener('drop', handleDrop);
    }
}

function handleDrop(e) {
    e.preventDefault();
    const targetColumn = this.getAttribute('data-column');
    if (!targetColumn) return;
    
    let taskData;
    try {
        taskData = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch(err) {
        return;
    }
    
    if (!taskData) return;
    
    const sourceColumn = taskData.sourceColumn;
    const taskId = parseInt(taskData.id);
    
    if (sourceColumn === targetColumn) return;
    
    // Mover tarefa entre colunas
    moveTask(taskId, sourceColumn, targetColumn);
}

function moveTask(taskId, fromColumn, toColumn) {
    const taskIndex = tasks[fromColumn].findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    const task = tasks[fromColumn][taskIndex];
    tasks[fromColumn].splice(taskIndex, 1);
    tasks[toColumn].push(task);
    
    saveToLocalStorage();
    renderAllColumns();
    setupDragAndDrop(); // Reaplicar eventos
}

// ===== CRUD OPERAÇÕES =====
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    const newTask = {
        id: nextId++,
        text: text,
        date: taskDate.value || '',
        category: getRandomCategory()
    };
    
    tasks.todo.push(newTask);
    taskInput.value = '';
    taskDate.value = '';
    
    saveToLocalStorage();
    renderColumn('todo');
    updateAllCounters();
    setupDragAndDrop();
}

function getRandomCategory() {
    const categories = ['low', 'medium', 'high'];
    return categories[Math.floor(Math.random() * categories.length)];
}

function deleteTask(taskId, columnId) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks[columnId] = tasks[columnId].filter(t => t.id !== taskId);
        saveToLocalStorage();
        renderColumn(columnId);
        updateAllCounters();
        setupDragAndDrop();
    }
}

function editTask(textElement, taskId, columnId) {
    const oldText = textElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = oldText;
    input.className = 'task-text editing';
    input.style.width = '100%';
    
    textElement.style.display = 'none';
    textElement.parentNode.insertBefore(input, textElement);
    input.focus();
    
    const saveEdit = () => {
        const newText = input.value.trim();
        if (newText && newText !== oldText) {
            const task = tasks[columnId].find(t => t.id === taskId);
            if (task) {
                task.text = newText;
                saveToLocalStorage();
                renderColumn(columnId);
                setupDragAndDrop();
            }
        } else {
            textElement.style.display = 'block';
            input.remove();
        }
    };
    
    input.addEventListener('blur', saveEdit);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });
}

function clearDoneTasks() {
    if (tasks.done.length === 0) {
        alert('Não há tarefas concluídas para limpar!');
        return;
    }
    
    if (confirm(`Tem certeza que deseja excluir ${tasks.done.length} tarefa(s) concluída(s)?`)) {
        tasks.done = [];
        saveToLocalStorage();
        renderColumn('done');
        updateAllCounters();
        setupDragAndDrop();
    }
}

// ===== CONTADORES =====
function updateAllCounters() {
    counters.todo.textContent = tasks.todo.length;
    counters.doing.textContent = tasks.doing.length;
    counters.done.textContent = tasks.done.length;
}

// ===== DARK MODE =====
function setupDarkMode() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.parentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.textContent = '☀️';
    } else {
        document.body.parentElement.setAttribute('data-theme', 'light');
        darkModeToggle.textContent = '🌙';
    }
}

function toggleDarkMode() {
    const htmlElement = document.body.parentElement;
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        darkModeToggle.textContent = '🌙';
    } else {
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        darkModeToggle.textContent = '☀️';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    darkModeToggle.addEventListener('click', toggleDarkMode);
    if (clearDoneBtn) {
        clearDoneBtn.addEventListener('click', clearDoneTasks);
    }
}

// ===== SUPORTE PARA TOUCH (Mobile) =====
let touchStartX = 0;
let touchStartY = 0;
let touchDraggedItem = null;

function setupTouchSupport() {
    document.querySelectorAll('.task-card').forEach(card => {
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchDraggedItem = card;
            card.style.opacity = '0.5';
        }, { passive: false });
        
        card.addEventListener('touchmove', (e) => {
            if (!touchDraggedItem) return;
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;
            
            // Verificar em qual coluna está o toque
            const elementUnderTouch = document.elementFromPoint(touchX, touchY);
            const targetColumn = elementUnderTouch?.closest('.task-list');
            
            if (targetColumn && targetColumn !== touchDraggedItem.parentElement) {
                // Realizar o move
                const taskId = parseInt(touchDraggedItem.getAttribute('data-id'));
                const sourceColumn = touchDraggedItem.getAttribute('data-column');
                const targetColumnId = targetColumn.getAttribute('data-column');
                
                if (sourceColumn !== targetColumnId) {
                    moveTask(taskId, sourceColumn, targetColumnId);
                    touchDraggedItem = null;
                }
            }
        });
        
        card.addEventListener('touchend', () => {
            if (touchDraggedItem) {
                touchDraggedItem.style.opacity = '1';
                touchDraggedItem = null;
            }
        });
    });
}

// ===== INICIALIZAR APLICAÇÃO =====
init();
setTimeout(() => {
    setupTouchSupport();
}, 100);