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

// let todo1 = {
//     title: "Implement Task Creation",
//     description: "Allowed users to add new tasks dynamically.",
//     dueDate: "Jan-09-2025",
//     priority: "1",
//     originalIndex: 1,
//     addedToProject: "Task Management Features"
//   }
  
//   localStorage.setItem(`newTodo1`, JSON.stringify(todo1));

  let testTodos = [
    {
      "title": "Implement Task Creation",
      "description": "Allowed users to add new tasks dynamically.",
      "dueDate": "Jan-09-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 1,
      "addedToProject": "Task Management Features"
    },
    {
      "title": "Enable Task Editing",
      "description": "Made task descriptions and priorities editable.",
      "dueDate": "Jan-10-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 2,
      "addedToProject": "Task Management Features"
    },
    {
      "title": "Add Task Completion Feature",
      "description": "Mark tasks as completed with a visual update.",
      "dueDate": "Jan-11-2025",
      "priority": "2",
      "priorityFallback" : 1,
      "originalIndex": 3,
      "addedToProject": "Task Management Features"
    },
    {
      "title": "Expand/Collapse Task Details",
      "description": "Show/hide details when clicking a task.",
      "dueDate": "Jan-12-2025",
      "priority": "2",
      "priorityFallback" : 1,
      "originalIndex": 4,
      "addedToProject": "Task Management Features"
    },
    {
      "title": "Allow Task Deletion",
      "description": "Added a button to remove tasks from the list.",
      "dueDate": "Jan-13-2025",
      "priority": "3",
      "priorityFallback" : 1,
      "originalIndex": 5,
      "addedToProject": "Task Management Features"
    },
    {
      "title": "Implement Project Categories",
      "description": "Allowed grouping of tasks under different projects.",
      "dueDate": "Jan-14-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 6,
      "addedToProject": "Project Management"
    },
    {
      "title": "Enable Switching Between Projects",
      "description": "Users can navigate between different projects.",
      "dueDate": "Jan-15-2025",
      "priority": "2",
      "priorityFallback" : 1,
      "originalIndex": 7,
      "addedToProject": "Project Management"
    },
    {
      "title": "Add Default Project on Load",
      "description": "Ensured a default project appears when the page loads.",
      "dueDate": "Jan-16-2025",
      "priority": "3",
      "priorityFallback" : 1,
      "originalIndex": 8,
      "addedToProject": "Project Management"
    },
    {
      "title": "Store Data in LocalStorage",
      "description": "Saved tasks and projects so they persist after refresh.",
      "dueDate": "Jan-17-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 9,
      "addedToProject": "Data Persistence"
    },
    {
      "title": "Load Data on Page Load",
      "description": "Fetched saved tasks from LocalStorage when opening the app.",
      "dueDate": "Jan-18-2025",
      "priority": "2",
      "priorityFallback" : 1,
      "originalIndex": 10,
      "addedToProject": "Data Persistence"
    },
    {
      "title": "Optimize Image Loading",
      "description": "Used lazy loading and compression for faster performance.",
      "dueDate": "Jan-19-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 11,
      "addedToProject": "Performance & Optimization"
    },
    {
      "title": "Use Webpack Asset Management",
      "description": "Managed images, fonts, and styles efficiently.",
      "dueDate": "Jan-20-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 12,
      "addedToProject": "Performance & Optimization"
    },
    {
      "title": "Preload Critical Resources",
      "description": "Improved initial loading speed with preloaded assets.",
      "dueDate": "Jan-21-2025",
      "priority": "1",
      "priorityFallback" : 1,
      "originalIndex": 13,
      "addedToProject": "Performance & Optimization"
    }
  ];

  testTodos.forEach((todo, index) => {
    localStorage.setItem(`newTodo${index + 1}`, JSON.stringify(todo));
  })
  