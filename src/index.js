// console.log('Index.js loaded');

import './styles/styles.css';
import { submitTodo } from './todos.js';
import { renderTodos } from './UI.js';
import { renderProjects } from './UI.js';
import { newProject } from './projects.js';
import { format, parse, set } from 'date-fns';
import { state } from './state.js';
import { populateArrFromLocal } from './localStorageManager.js';

export const formatType = 'MMM-dd-yyyy';

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', submitTodo);

let newProjectBtn = document.querySelector('.new-project');
newProjectBtn.addEventListener('click', newProject);

populateArrFromLocal();
renderProjects();
renderTodos();

let foot = document.querySelector('.foot');
let logBtn = document.createElement('button');
logBtn.innerHTML = 'log';
foot.appendChild(logBtn);

let pushBtn = document.createElement('button');
pushBtn.innerHTML = 'push';
foot.appendChild(pushBtn);

logBtn.addEventListener('click', () => {
    console.log(state.projects)
})

pushBtn.addEventListener('click', () => {
console.log(state.projects)
    
})
  