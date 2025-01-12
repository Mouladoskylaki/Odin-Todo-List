// console.log('UI.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { deleteTodo } from "./todos";
import { addToProject } from "./projects";
import { deleteProject } from "./projects";
import { getSelectedProject } from "./projects";
import { format, parse } from "date-fns";
import { formatType } from ".";
import { toolTipFun } from "./toolTip";


let defaultProject = document.querySelector('.default-project');
let projectList = document.querySelector('.project-list');

const renderTodo = (task, todoIndex, projectIndex) => {
    let newTodo = document.createElement('div');
    newTodo.classList.add('newTodo');
    defaultProject.appendChild(newTodo);

    let deleteTodoBtn = document.createElement('button');
    deleteTodoBtn.classList.add('deleteTodoBtn');
    deleteTodoBtn.innerHTML = 'x';
    newTodo.appendChild(deleteTodoBtn);

    let expandBtn = document.createElement('button');
    expandBtn.classList.add('expandBtn');
    expandBtn.innerHTML = '&#10530;';
    newTodo.appendChild(expandBtn);

    deleteTodoBtn.addEventListener('click', () => {
        deleteTodo(projectIndex, todoIndex);
        console.log(state.projects[0]);
    });
    
    // Add to Project
    let addToProjectBtn = document.createElement('button');
    addToProjectBtn.classList.add('addToProjectBtn');
    addToProjectBtn.innerHTML = 'add to Project';
    newTodo.appendChild(addToProjectBtn);

    addToProjectBtn.addEventListener("click", () => {
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
                task[property] = updatedValue;
                console.log(`Updated ${property}: ${updatedValue}`);
            }
        });
    };

    makeEditableTasks('title', task.title);
    makeEditableTasks('dueDate', task.dueDate);

// Expand Tasks
    let taskExpanded = false;
    expandBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        if (!taskExpanded) {
        makeEditableTasks('description', task.description);
        makeEditableTasks('priority', task.priority); 
        taskExpanded = true;
        } else if (taskExpanded === true) {
         const description = newTodo.querySelector('.description');
         const priority = newTodo.querySelector('.priority');
         newTodo.removeChild(description);
         newTodo.removeChild(priority);
         taskExpanded = false;
        }
    })
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
        renderTodo(todo, todoIndex, currentProjectIndex);
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
        let sortBtn = document.createElement('button');
        sortBtn.classList.add('sortBtn');
        sortBtn.innerHTML = `Sort`;
        projectElement.appendChild(sortBtn);

        toolTipFun(sortBtn, 'sort by Date', 'sort by original index');

        sortBtn.addEventListener('click', () => {
            if (sorted) {
                // sortBtn.innerHTML = `Sort by Date`;
                console.log(project.todos);
                console.log('Sorted by original index');
                project.todos.sort((a, b) => a.originalIndex - b.originalIndex)
                console.log(project.todos);
                renderTodos();
                sorted = false;
                sortBtn.classList.remove('changed');
                return
            }

            project.todos.forEach((todo, index) => {
                todo.parsedDate = parse(todo.dueDate, formatType, new Date());
            });
            project.todos.sort((a, b) => a.parsedDate - b.parsedDate);
            sorted = true;
            sortBtn.classList.add('changed');
            console.log(`Project "${project.name}" sorted by date`);
            // sortBtn.innerHTML = `Reset Sorting`;
            renderTodos();
        })

        let deleteProjectBtn = document.createElement('button');
        deleteProjectBtn.classList.add('deleteProjectBtn');
        deleteProjectBtn.innerHTML ='x';
        projectElement.appendChild(deleteProjectBtn);

        deleteProjectBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteProject(projectIndex);
            renderProjects();
        });

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
    console.log(state.projects)
});

pubSub.subscribe('todoDeleted', ({projectIndex, todoIndex}) => {
    console.log(state.projects[projectIndex].name)
    console.log(`Todo deleted from project "${state.projects[projectIndex].name}"`);
    renderTodos(projectIndex);
});