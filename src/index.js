// console.log('Index.js loaded');

import './styles/styles.css';
import { submitTodo } from './todos.js';
import './UI.js';

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', submitTodo);
