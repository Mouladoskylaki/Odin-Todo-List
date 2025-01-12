// console.log('Todos.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { getSelectedProject } from "./projects";
import { format } from "date-fns";

let titleInput = document.querySelector('.title-input');
let descriptionInput = document.querySelector('.description-input');
let dueDateInput = document.querySelector('.dueDate-input');
let priorityInput = document.querySelector('.priority-input');

class Todo {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.originalIndex = state.projects[0].todos.length;
    }
}

let testTodo = new Todo('School', 'Maths', 'May-11-2025', '4');
state.projects[0].todos.push(testTodo);
let testTodo2 = new Todo('Work', 'Paint', 'Dec-10-2025', '4');
state.projects[0].todos.push(testTodo2);
let testTodo3 = new Todo('Gym', 'Chest', 'Jan-11-2025', '4');
state.projects[0].todos.push(testTodo3);

export const submitTodo = (event) => {
    let formattedDate = dueDateInput.value ? format(dueDateInput.value, 'MMM-dd-yyyy') : '';
    event.preventDefault();
    let newTodo = new Todo(titleInput.value, descriptionInput.value, formattedDate, priorityInput.value);
    console.log(dueDateInput.value)
    let { index: currentProjectIndex, name: currentProjectName } = getSelectedProject();
    state.projects[currentProjectIndex].todos.push(newTodo);
    if (currentProjectIndex !== 0) {
        state.projects[0].todos.push(newTodo);
    }
    pubSub.publish('newTodo', newTodo);
    console.log(newTodo)
};

export const deleteTodo = (projectIndex, todoIndex) => {
  let { index: currentProjectIndex, name: currentProjectName } = getSelectedProject();
  state.projects[currentProjectIndex].todos.splice(todoIndex, 1);
  pubSub.publish('todoDeleted', { projectIndex, todoIndex});
}
