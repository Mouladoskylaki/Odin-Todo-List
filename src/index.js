// console.log('Index.js loaded');

import './styles/styles.css';
import { submitTodo } from './todos.js';
import { renderTodos } from './UI.js';
import { renderProjects } from './UI.js';
import { newProject } from './projects.js';
import { format, parse, set } from 'date-fns';
import { state } from './state.js';

export const formatType = 'MMM-dd-yyyy';

const submitBtn = document.querySelector('.submit-btn');
submitBtn.addEventListener('click', submitTodo);

let newProjectBtn = document.querySelector('.new-project');
newProjectBtn.addEventListener('click', newProject);

renderProjects();
renderTodos();

////////////
// const tasks = [
//     { id: 1, name: 'Task 1', date: 'May-01-25' },
//     { id: 2, name: 'Task 2', date: 'Dec-01-25' },
//     { id: 3, name: 'Task 3', date: 'Jan-01-25' }
//   ];

//   tasks.forEach(task => {
//     task.parsedDate = parse(task.date, formatType, new Date());
//   });

//   tasks.sort((a, b) => a.parsedDate - b.parsedDate);
//   console.log(state.projects[0]);
// let testToolTipBtn = document.querySelector('.testBtn');

// export const toolTipFun = (element) => {
//   let toolTipDiv = document.createElement('div');
//   toolTipDiv.classList.add('toolTip');
  
//   let toolTipText = document.createElement('span');
//   toolTipText.classList.add('toolTipText');
//   toolTipText.textContent = 'toolTip Text!'
//   toolTipDiv.appendChild(toolTipText);

//   element.addEventListener('mouseover', () => {
//     console.log('tsa!');
//     element.classList.add('toolTip');
//     element.appendChild(toolTipText);
//   })
//   console.log("toolTip")
// };
// toolTipFun(testToolTipBtn);
  