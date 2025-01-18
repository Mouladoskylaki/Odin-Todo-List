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
import { colorizeByProperty } from "./domUtils";
import { expandTasks } from "./domUtils";

let defaultProject = document.querySelector('.default-project');
let projectList = document.querySelector('.project-list');

export const renderTodo = (task, todoIndex, projectIndex) => {
    let newTodo = document.createElement('div');
    newTodo.classList.add('newTodo');
    defaultProject.appendChild(newTodo);

    let deleteTodoBtn = document.createElement('button');
    deleteTodoBtn.classList.add('deleteTodoBtn');
    deleteTodoBtn.innerHTML = 'x';
    newTodo.appendChild(deleteTodoBtn);

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

    expandTasks(makeEditableTasks, task.description, task.priority, newTodo);
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

export const populateArrFromLocal = (fun) => {
    Object.keys(localStorage).forEach((key, index) => {
     if (key.startsWith('newTodo')) {
         console.log(key);
         let localStorageTask = JSON.parse(localStorage.getItem(key));
         state.projects[0].todos.push(localStorageTask);
         state.projects[0].todos.sort((a, b) => a.originalIndex - b.originalIndex);
         if (localStorageTask.addedToProject) {
            if (localStorageTask.addedToProject === "Default") {
                return
            }
            let addedToProjectIndex = localStorageTask.addedToProject;
            console.log(addedToProjectIndex);
            if (state.projects.some(project => project.name === localStorageTask.addedToProject)) {
                if (undefined) {
                    console.log('no such project');
                }
                state.projects.forEach((project) => {
                    if (project.name === localStorageTask.addedToProject) {
                        project.todos.push(localStorageTask);
                        project.todos.sort((a, b) => a.originalIndex - b.originalIndex)
                    }
                })
                return
            } else {
                state.projects.push({name: localStorageTask.addedToProject, todos: []});
                state.projects.forEach((project) => {
                    if (project.name === localStorageTask.addedToProject) {
                        project.todos.push(localStorageTask);
                        project.todos.sort((a, b) => a.originalIndex - b.originalIndex)
                    }
                })
            }
         }
     }
 });
}

export const renderProjects = (makeActive) => {
    let sorted = false;
    let sortedLocaly = JSON.parse(localStorage.getItem('sorted'));
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

        const isSorted = (array, property) => {
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i][property] > array[i + 1][property]) {
                    return false;
                }
            }
            return true;
        };

        let alreadySortedByDate = isSorted(project.todos, 'originalIndex');
        
        if (alreadySortedByDate) {
            toolTipFun(sortBtn, 'sort by Date', 'sort by original index');
        } else {
            toolTipFun(sortBtn, 'sort by original index', 'sort by Date');

        }

        sortBtn.addEventListener('click', () => {
            if (sorted) {
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
    console.log(`Todo deleted from project "${state.projects[projectIndex].name}"`);
    renderTodos(projectIndex);
});