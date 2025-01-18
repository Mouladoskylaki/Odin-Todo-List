// localStorageManager.js

import { state } from "./state";

export const populateArrFromLocal = (fun) => {
    Object.keys(localStorage).forEach((key, index) => {
     if (key.startsWith('newTodo')) {
         console.log(key);
         let localStorageTask = JSON.parse(localStorage.getItem(key));
         state.projects[0].todos.push(localStorageTask);
         state.projects[0].todos.sort((a, b) => a.originalIndex - b.originalIndex);
         if (localStorageTask.addedToProject) {
            if (localStorageTask.addedToProject === "Default") {
                return
            }
            let addedToProjectIndex = localStorageTask.addedToProject;
            console.log(addedToProjectIndex);
            if (state.projects.some(project => project.name === localStorageTask.addedToProject)) {
                if (undefined) {
                    console.log('no such project');
                }
                state.projects.forEach((project) => {
                    if (project.name === localStorageTask.addedToProject) {
                        project.todos.push(localStorageTask);
                        project.todos.sort((a, b) => a.originalIndex - b.originalIndex)
                    }
                })
                return
            } else {
                state.projects.push({name: localStorageTask.addedToProject, todos: []});
                state.projects.forEach((project) => {
                    if (project.name === localStorageTask.addedToProject) {
                        project.todos.push(localStorageTask);
                        project.todos.sort((a, b) => a.originalIndex - b.originalIndex)
                    }
                })
            }
         }
     }
 });
}