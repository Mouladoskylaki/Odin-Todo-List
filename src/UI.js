// console.log('UI.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { deleteTodo } from "./todos";

let defaultProject = document.querySelector('.default-project');

const renderTodo = (task, todoIndex, projectIndex = 0) => {
    let newTodo = document.createElement('div');
    newTodo.classList.add('newTodo');
    defaultProject.appendChild(newTodo);

    let deleteTodoBtn = document.createElement('button');
    deleteTodoBtn.classList.add('deleteTodoBtn');
    deleteTodoBtn.innerHTML = 'x';
    newTodo.appendChild(deleteTodoBtn);

    deleteTodoBtn.addEventListener('click', () => {
        deleteTodo(projectIndex, todoIndex);
        console.log(state.projects[0])
        renderTodos();
    });

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

const renderTodos = (projectIndex = 0) => {
    defaultProject.innerHTML = "";
    const project = state.projects[projectIndex];
    project.todos.forEach((todo, todoIndex) => {
        renderTodo(todo, todoIndex, projectIndex);
    });
};

pubSub.subscribe('newTodo', (todo) => {
    console.log(todo);
    renderTodos();
});

renderTodos();
