// console.log('UI.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { deleteTodo } from "./todos";
import { addToProject } from "./projects";
import { deleteProject } from "./projects";
import { getSelectedProject } from "./projects";
import { format, parse } from "date-fns";
import { formatType } from ".";
import { colorizeByProperty } from "./domUtils";
import { expandTasks } from "./domUtils";
import { createButton } from "./utils";

let defaultProject = document.querySelector('.default-project');
let projectList = document.querySelector('.project-list');

export const renderTodo = (task, todoIndex, projectIndex) => {
    let newTodo = document.createElement('div');
    newTodo.classList.add('newTodo');
    defaultProject.appendChild(newTodo);

    // Delete task Btn
    createButton('deleteTodoBtn', 'x', newTodo, () => {
        deleteTodo(projectIndex, todoIndex);
        console.log(state.projects[0]);
    });
    
    // Add to Project Btn
    createButton('addToProjectBtn', 'add to Project', newTodo, () => {
        const selectedProjectName = selectProjectList.value;
        addToProject(task, selectedProjectName);
    });

    // Project List
    let selectProjectList = document.createElement('select');
    selectProjectList.classList.add('selectProjectList');
    newTodo.appendChild(selectProjectList);
    state.projects.forEach((project) => {
        let projectOption = document.createElement('option');
        projectOption.classList.add('projectOption');
        projectOption.value = project.name;
        projectOption.innerHTML = project.name;
        selectProjectList.appendChild(projectOption);
    });

    // Completed Checkbox
    let completedCheckbox = document.createElement('input');
    completedCheckbox.classList.add('completedCheckbox');
    completedCheckbox.type = "checkbox";
    newTodo.appendChild(completedCheckbox);
    
    let localStorageTask = JSON.parse(localStorage.getItem(`newTodo${task.originalIndex}`));
    
    if (!localStorageTask.priorityFallback) {
        localStorageTask.priorityFallback = task.priority;
    }
    
    if (localStorageTask.priority === 'completed') {
        completedCheckbox.checked = true;
    } else {
        completedCheckbox.checked = false;
    }

    completedCheckbox.addEventListener('change', (event) => {
        let priorityElem = document.querySelector('.priority');
        if (event.target.checked) {
            completedCheckbox.setCustomValidity('Task marked as completed');
            completedCheckbox.reportValidity();
            console.log('completed');
            localStorageTask.priority = 'completed';
            colorizeByProperty(newTodo, 'completed');
            if (priorityElem) {
                priorityElem.innerHTML = 'Priority: completed';
            }
            setTimeout(() => {
                completedCheckbox.setCustomValidity('');
                completedCheckbox.reportValidity();
            }, 2300);
        } else {
            completedCheckbox.setCustomValidity('');
            completedCheckbox.reportValidity();
            console.log('not completed');
            colorizeByProperty(newTodo, localStorageTask.priorityFallback);
            localStorageTask.priority = localStorageTask.priorityFallback;
            if (priorityElem) {
                priorityElem.innerHTML = `Priority: ${localStorageTask.priorityFallback}`;
            }
        }
        localStorage.setItem(`newTodo${task.originalIndex}`, JSON.stringify(localStorageTask));
    });
    
    

    // Make tasks editable
    const makeEditableTasks = (property, value) => {
        let div = document.createElement('div');
        div.classList.add(property);
        div.setAttribute('contenteditable', 'true');
        div.innerHTML = `${property.charAt(0).toUpperCase() + property.slice(1)}: ${value}`;
        newTodo.appendChild(div);

        if (property === 'dueDate') {
            div.addEventListener('click', (event) => {
                let dateBeforeEdit = format(value, 'MMM-dd-yyyy');
                div.innerHTML = `DueDate: `;
                let editDate = document.createElement('input');
                editDate.type = 'date';
                editDate.value = dateBeforeEdit;
                div.appendChild(editDate);

                editDate.addEventListener('click', (event) => {
                    event.stopImmediatePropagation();
                });

                editDate.addEventListener('change', () => {
                    let newDate = format(editDate.value, 'MMM-dd-yyyy');
                    console.log(newDate);
                    div.innerHTML = `DueDate: ${newDate}`;
                    task[property] = newDate;
                    localStorageTask[property] = newDate;
                    localStorage.setItem(`newTodo${task.originalIndex}`, JSON.stringify(localStorageTask));
                });

                editDate.addEventListener('blur', () => {
                    div.innerHTML = `DueDate: ${dateBeforeEdit}`;
                    task[property] = dateBeforeEdit;
                });
            })
        }

        div.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                div.blur();
            }
        })

        div.addEventListener('blur', (event) => {
            if (property === 'dueDate' && event.relatedTarget && event.relatedTarget.type === 'date') {
                return;
            }
            if (property === 'dueDate') {
                task[property] = value;
                div.innerHTML = `DueDate: ${value}`;
            } else {
            const updatedValue = div.textContent.split(':')[1].trim();
            if (property === 'priority') {
                colorizeByProperty(newTodo, updatedValue);
                localStorageTask.priorityFallback = updatedValue;
                completedCheckbox.checked = false;
                localStorage.setItem(`newTodo${task.originalIndex}`, JSON.stringify(localStorageTask));
            }
                task[property] = updatedValue;
                console.log(`Updated ${property}: ${updatedValue}`);
                localStorageTask[property] = updatedValue;
                localStorage.setItem(`newTodo${task.originalIndex}`, JSON.stringify(localStorageTask));
            }
        });
    };

    makeEditableTasks('title', task.title);
    makeEditableTasks('dueDate', task.dueDate);

    expandTasks(makeEditableTasks, task.description, localStorageTask.priority, newTodo);
    colorizeByProperty(newTodo, task.priority);

};

export const renderTodos = (projectIndex, projectName) => {
    let { name: currentProjectName, index: currentProjectIndex} = getSelectedProject();
    if (projectIndex) {
        currentProjectIndex = projectIndex
    }
    if (projectName) {
        currentProjectName = projectName
    }

    defaultProject.innerHTML = `"${currentProjectName}" project`;
    
    const project = state.projects[currentProjectIndex];

    project.todos.forEach((todo, todoIndex) => {
        let todoInLocal = JSON.parse(localStorage.getItem(`newTodo${todo.originalIndex}`));

        if (todoInLocal) {
            console.log('ifLocal');
            renderTodo(todoInLocal, todoIndex, currentProjectIndex)
        } else {
            console.log('notLocal')
        }
    });
};

export const renderProjects = (makeActive) => {
    let sorted = false;
    let makeActiveIndex = makeActive;
    projectList.innerHTML = "";
    state.projects.forEach((project, projectIndex) => {
        let projectElement = document.createElement('div');
        projectElement.classList.add('project-element');
        let projectNameSpan = document.createElement('span');
        projectNameSpan.classList.add('project-name');
        projectNameSpan.textContent = project.name;

        projectElement.appendChild(projectNameSpan);
        projectList.appendChild(projectElement);

        if (projectIndex === 0) {
            projectElement.classList.add('active');
        }
        if (makeActiveIndex) {
            if (makeActiveIndex === projectIndex) {
                projectElement.classList.add('active');
            } else {
                projectElement.classList.remove('active');
            }
        }
// Sorting
        let sortBtn = document.createElement('button');
        sortBtn.classList.add('sortBtn');
        sortBtn.innerHTML = `Sort`;
        projectElement.appendChild(sortBtn);

        sortBtn.addEventListener('click', () => {

            project.todos.forEach((todo, index) => {
                todo.parsedDate = parse(todo.dueDate, formatType, new Date());
            });
            project.todos.sort((a, b) => a.parsedDate - b.parsedDate);
            sorted = true;
            sortBtn.classList.add('changed');
            console.log(`Project "${project.name}" sorted by date`);
            renderTodos();
        })
        // Delete Project Btn
        createButton('deleteProjectBtn', 'x', projectElement, (event) => {
            event.stopPropagation();
            deleteProject(projectIndex);
            renderProjects();
        })

        projectElement.addEventListener('click', () => {
            document.querySelectorAll('.project-element').forEach((el) => el.classList.remove('active'));
            projectElement.classList.add('active');
            console.log(`Rendered project "${project.name}"`);
            renderTodos(projectIndex = projectIndex, `${project.name}`);
            
        })
    }
    );
};

pubSub.subscribe('newTodo', (todo) => {
    let { index: currentProjectIndex } = getSelectedProject();
    console.log(todo);
    console.log(`Todo added to "Default" project`);
    renderTodos(currentProjectIndex);
    console.log(state.projects);
});

pubSub.subscribe('todoDeleted', ({projectIndex, todoIndex}) => {
    console.log(`Todo deleted from project "${state.projects[projectIndex].name}"`);
    renderTodos(projectIndex);
});