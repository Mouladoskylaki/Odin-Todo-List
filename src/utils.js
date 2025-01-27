// utils.js

export const createButton = 
(className, textContent, parent, onClick) => {

    const button = document.createElement('button');
    button.classList.add(className);
    button.textContent = textContent;
    parent.appendChild(button);
    button.addEventListener('click', onClick);
    return button;  
};
