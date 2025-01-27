// console.log('Todos.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { getSelectedProject } from "./projects";
import { format, isValid } from "date-fns";
import { inputValidityListener } from "./formValidation";
import { dateInputValidityListener } from "./formValidation";
import { priorityInputValidityListener } from "./formValidation";

let titleInput = document.querySelector('.title-input');
let descriptionInput = document.querySelector('.description-input');
let dueDateInput = document.querySelector('.dueDate-input');
let priorityInput = document.querySelector('.priority-input');
let indexOfLastTodoInLocalStorage;

let inputValidityStates = {
    titleInput: { isValid: false },
    descriptionInput: { isValid: false },
    dueDateInput: { isValid: false },
    priorityInput: { isValid: false}
}

const getTodosInLocalStorage = () => {
    let todosInLocalStorage = [];
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('newTodo')) {
            let task = JSON.parse(localStorage.getItem(key));
            todosInLocalStorage.push(task)
        }
    })
    indexOfLastTodoInLocalStorage = todosInLocalStorage.length;
    };

class Todo {
    constructor(title, description, dueDate, priority) {
        getTodosInLocalStorage();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.originalIndex = indexOfLastTodoInLocalStorage;
    }
};

inputValidityListener(titleInput, inputValidityStates.titleInput, 50, 'Please enter a title.', 'Title must be 50 characters or fewer.');
inputValidityListener(descriptionInput, inputValidityStates.descriptionInput, 'Please provide a description.', 'Description must be 150 characters or fewer.');
dateInputValidityListener(dueDateInput, inputValidityStates.dueDateInput, 'Please select a due date to continue.');
priorityInputValidityListener(priorityInput, inputValidityStates.priorityInput, "Enter 1 (critical), 2 (important), or 3 (optional) only.");

export const submitTodo = (event) => {
    let formattedDate = dueDateInput.value ? format(dueDateInput.value, 'MMM-dd-yyyy') : '';
    event.preventDefault();
    if (!inputValidityStates.titleInput.isValid) {
        titleInput.setCustomValidity('Please enter a title. Must be 50 characters or fewer.');
        titleInput.reportValidity();
        return;
    }
    
    if (!inputValidityStates.descriptionInput.isValid) {
        descriptionInput.setCustomValidity('Please provide a description. Must be 150 characters or fewer.');
        descriptionInput.reportValidity();
        return;
    }

    if (!inputValidityStates.dueDateInput.isValid) {
        dueDateInput.setCustomValidity('Please select a due date to continue.');
        dueDateInput.reportValidity();
        return;
    }

    if (!inputValidityStates.priorityInput.isValid) {
        priorityInput.setCustomValidity("Enter 1 (critical), 2 (important), or 3 (optional) only.");
        priorityInput.reportValidity();
        return;
    }

    let newTodo = new Todo(titleInput.value, descriptionInput.value, formattedDate, priorityInput.value);
    console.log(dueDateInput.value)
    let { index: currentProjectIndex, name: currentProjectName } = getSelectedProject();
    state.projects[currentProjectIndex].todos.push(newTodo);
    if (currentProjectIndex !== 0) {
        state.projects[0].todos.push(newTodo);
        newTodo.addedToProject = currentProjectName;
    }
    localStorage.setItem(`newTodo${newTodo.originalIndex}`, JSON.stringify(newTodo));
    pubSub.publish('newTodo', newTodo);

    titleInput.value = '';
    descriptionInput.value = '';
    dueDateInput.value = '';
    priorityInput.value = '';

    inputValidityStates.titleInput.isValid = false;
    inputValidityStates.descriptionInput.isValid = false;
};

export const deleteTodo = (projectIndex, todoIndex) => {
  let { index: currentProjectIndex, name: currentProjectName } = getSelectedProject();
  console.log(state.projects[currentProjectIndex].todos[todoIndex].originalIndex);
  let storedItem = JSON.parse(localStorage.getItem(`newTodo${state.projects[currentProjectIndex].todos[todoIndex].originalIndex}`))
  let beforeTrans = storedItem.addedToProject;
  storedItem.addedToProject = "Default";
  let updatedItem = JSON.stringify(storedItem);
  localStorage.setItem(`newTodo${state.projects[currentProjectIndex].todos[todoIndex].originalIndex}`, updatedItem);
  if (projectIndex === 0) {
    localStorage.removeItem(`newTodo${state.projects[0].todos[todoIndex].originalIndex}`);
  }

  state.projects[currentProjectIndex].todos.splice(todoIndex, 1);
  pubSub.publish('todoDeleted', { projectIndex, todoIndex});
}