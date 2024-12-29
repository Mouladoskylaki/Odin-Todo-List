// console.log('UI.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { deleteTodo } from "./todos";
import { addToProject } from "./projects";
import { deleteProject } from "./projects";
import { getSelectedProject } from "./projects";

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

    deleteTodoBtn.addEventListener('click', () => {
        deleteTodo(projectIndex, todoIndex);
        console.log(state.projects[0]);
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
    
    // Add to Project
    let addToProjectBtn = document.createElement('button');
    addToProjectBtn.classList.add('addToProjectBtn');
    addToProjectBtn.innerHTML = 'add to Project';
    newTodo.appendChild(addToProjectBtn);

    addToProjectBtn.addEventListener("click", () => {
        const selectedProjectName = selectProjectList.value;
        addToProject(task, selectedProjectName); // Use the function from `projects.js`
    });

// ---------------------------------------------

    let title = document.createElement('div');
    title.innerHTML = `Title: ${task.title}`;
    newTodo.appendChild(title);

    let description = document.createElement('div');
    description.innerHTML = `Description: ${task.description}`;
    newTodo.appendChild(description);

    let dueDate = document.createElement('div');
    dueDate.innerHTML = `DueDate: ${task.dueDate}`;
    newTodo.appendChild(dueDate);

    let priority = document.createElement('div');
    priority.innerHTML = `Priority: ${task.priority}`;
    newTodo.appendChild(priority);
}

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
    let makeActiveIndex;
    makeActiveIndex = makeActive;
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
