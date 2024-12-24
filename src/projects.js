// projects.js
import { state } from "./state";
import { renderTodos } from "./UI";
import { renderProjects } from "./UI";

let newProjectInput = document.querySelector('.new-project-input');
let projectList = document.querySelector('.project-list');

export const newProject = () => {
    state.projects.push({name: newProjectInput.value, todos: []});
    console.log(newProjectInput.value);
    console.log(state.projects);
    renderTodos();
    renderProjects();
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
                console.log("project deleteted");
                state.projects.splice(projectIndex, 1);          
}