// projects.js
import { state } from "./state";
import { renderTodos } from "./UI";
import { renderProjects } from "./UI";

let newProjectInput = document.querySelector('.new-project-input');

export const newProject = () => {
    state.projects.push({name: newProjectInput.value, todos: []});
    console.log(newProjectInput.value);
    console.log(state.projects);
    let neoIndex;
    const neoProject = state.projects.find((project, index) => {
        if (project.name === newProjectInput.value) {
            neoIndex = index
        }
    })
    let project = document.querySelector('.project-list > .project-element:last-child');
    project.classList.add('active');
    console.log(project)
    console.log(neoIndex)
    renderTodos(neoIndex, newProjectInput.value);
    renderProjects(neoIndex);
}

export const addToProject = (task, selectedProjectName) => {
    const selectedProject = state.projects.find(
        (project) => project.name === selectedProjectName
    );

    if (selectedProject) {
        const isDuplicate = selectedProject.todos.some((todo) =>
            todo.title === task.title &&
            todo.description === task.description &&
            todo.dueDate === task.dueDate &&
            todo.priority === task.priority
        );

        if (isDuplicate) {
            console.log(`Task already exists in "${selectedProject.name}" project.`);
            return;
        }

        selectedProject.todos.push(task);
        console.log(`Task added to the "${selectedProject.name}" project.`);
    } else {
        console.log(`Project "${selectedProjectName}" not found.`);
    }
};

export const deleteProject = (projectIndex) => {
    const projectName = state.projects[projectIndex].name;

    if (projectName === 'Default') {
                    console.log('Cannot delete "Default" project');
                    return;
                }
                console.log(`Project "${projectName}" deleted`);
                state.projects.splice(projectIndex, 1);          
};

export const getSelectedProject = () => {
    const activeElement = document.querySelector('.project-element.active .project-name');
    let selectedProjectIndex;
    let selectedProjectName;
    state.projects.forEach((project, index) => {
        if (project.name === activeElement.textContent) {
            selectedProjectIndex = index;
            selectedProjectName = project.name;
        }
    })
    console.log(selectedProjectIndex, selectedProjectName);
    return { index: selectedProjectIndex, name: selectedProjectName };
};