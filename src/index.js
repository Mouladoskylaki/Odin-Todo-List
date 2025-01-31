// console.log('Index.js loaded');

import './styles/styles.css';
import { submitTodo } from './todos.js';
import { renderTodos } from './UI.js';
import { renderProjects } from './UI.js';
import { newProject } from './projects.js';
import { populateArrFromLocal } from './localStorageManager.js';
import { state } from './state.js';

document.getElementById('year').textContent = new Date().getFullYear();

export const formatType = 'MMM-dd-yyyy';

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', submitTodo);
submitBtn.addEventListener('keydown', (key) => {
    if (key === 'Enter') {
        submitTodo();
    }
})

let newProjectBtn = document.querySelector('.new-project');
newProjectBtn.addEventListener('click', newProject);

populateArrFromLocal();
renderProjects();
renderTodos();


  