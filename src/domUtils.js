// domUtils.js
import { state } from "./state";
import { renderTodos } from "./UI";

export const colorizeByProperty = (element, obj) => {
    const priorityColors = {
        '1': '#FF3B30',
        '2': '#FF9500',
        '3': '#FFCC00',
        'completed' : '#4CAF50'
    };
    element.style.backgroundColor = priorityColors[obj] || 'white';
};

export const expandTasks = (makeEditableFunction, description, priority, taskElement) => {

    let expandBtn = document.createElement('button');
    expandBtn.classList.add('expandBtn');
    expandBtn.innerHTML = '...';
    taskElement.appendChild(expandBtn);

    let taskExpanded = false;
    expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!taskExpanded) {
        makeEditableFunction('description', description);
        makeEditableFunction('priority', priority); 
        taskExpanded = true;
        } else if (taskExpanded === true) {
         const description = taskElement.querySelector('.description');
         const priority = taskElement.querySelector('.priority');
         taskElement.removeChild(description);
         taskElement.removeChild(priority);
         taskExpanded = false;
         renderTodos();
        }
    });
};
