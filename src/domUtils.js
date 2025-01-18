// domUtils.js

export const colorizeByProperty = (element, obj) => {
    const priorityColors = {
        '1': 'red',
        '2': 'green',
        '3': 'orange'
    };
    element.style.backgroundColor = priorityColors[obj] || 'white';
};

export const expandTasks = (makeEditableFunction, description, priority, taskElement) => {

    let expandBtn = document.createElement('button');
    expandBtn.classList.add('expandBtn');
    expandBtn.innerHTML = '&#10530;';
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
        }
    });
};
