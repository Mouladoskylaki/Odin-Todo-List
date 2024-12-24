// console.log('Todos.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";

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
    }
}

let testTodo = new Todo('School', 'Maths', 'Tomorrow', '4');
state.projects[0].todos.push(testTodo);

export const submitTodo = (event) => {
    event.preventDefault();
    let newTodo = new Todo(titleInput.value, descriptionInput.value, dueDateInput.value, priorityInput.value);
    state.projects[0].todos.push(newTodo);           

    pubSub.publish('newTodo', newTodo);
};

export const deleteTodo = (projectIndex, todoIndex) => {
  state.projects[projectIndex].todos.splice(todoIndex, 1);
  pubSub.publish('todoDeleted', { projectIndex, todoIndex});
}
