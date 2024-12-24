// console.log('Index.js loaded');

import './styles/styles.css';
import { submitTodo } from './todos.js';
import { renderTodos } from './UI.js';
import { renderProjects } from './UI.js';
import { newProject } from './projects.js';

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', submitTodo);

let newProjectBtn = document.querySelector('.new-project');
newProjectBtn.addEventListener('click', newProject);

renderProjects();
renderTodos();