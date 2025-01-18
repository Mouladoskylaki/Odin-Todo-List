// console.log('Todos.js loaded');
import { state } from "./state";
import { pubSub } from "./pubsub";
import { getSelectedProject } from "./projects";
import { format } from "date-fns";
import { renderProjects, renderTodo } from "./UI";

let titleInput = document.querySelector('.title-input');
let descriptionInput = document.querySelector('.description-input');
let dueDateInput = document.querySelector('.dueDate-input');
let priorityInput = document.querySelector('.priority-input');
let indexOfLastTodoInLocalStorage;

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

// const testTodos = () => {
//     // localStorage.clear();
//     let testTodo0 = new Todo('School', 'Maths', 'May-11-2025', '1',);
//     state.projects[0].todos.push(testTodo0);
//     localStorage.setItem(`newTodo0`, JSON.stringify(testTodo0));
//     let testTodo1 = new Todo('Work', 'Paint', 'Dec-10-2025', '2');
//     state.projects[0].todos.push(testTodo1);
//     localStorage.setItem(`newTodo1`, JSON.stringify(testTodo1));
//     let testTodo2 = new Todo('Gym', 'Chest', 'Jan-11-2025', '3');
//     state.projects[0].todos.push(testTodo2);
//     localStorage.setItem(`newTodo2`, JSON.stringify(testTodo2));
//     };
// testTodos();

export const submitTodo = (event) => {
    let formattedDate = dueDateInput.value ? format(dueDateInput.value, 'MMM-dd-yyyy') : '';
    event.preventDefault();
    let newTodo = new Todo(titleInput.value, descriptionInput.value, formattedDate, priorityInput.value);
    console.log(dueDateInput.value)
    let { index: currentProjectIndex, name: currentProjectName } = getSelectedProject();
    state.projects[currentProjectIndex].todos.push(newTodo);
    // newTodo.addedToProject = currentProjectName;
    if (currentProjectIndex !== 0) {
        state.projects[0].todos.push(newTodo);
        newTodo.addedToProject = currentProjectName;
    }
    localStorage.setItem(`newTodo${newTodo.originalIndex}`, JSON.stringify(newTodo));
    pubSub.publish('newTodo', newTodo);
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

const getProjectIndexByName = (projectName) => {
    return state.projects.findIndex(project => project.name === projectName)
}

