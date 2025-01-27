export const toolTipFun = (element, element2, text) => {
    let toolTipText;

    element.addEventListener('click', () => {
        if (toolTipText) {
            // Remove the tooltip if it exists
            element2.removeChild(toolTipText);
            toolTipText = null;
            element2.classList.remove('toolTip');
        } else {
            // Create and show the tooltip
            toolTipText = document.createElement('span');
            toolTipText.classList.add('toolTipText');
            toolTipText.textContent = text;

            element2.classList.add('toolTip');
            element2.appendChild(toolTipText);

            // Automatically remove the tooltip after 3 seconds
            setTimeout(() => {
                if (toolTipText && element2.contains(toolTipText)) {
                    element2.removeChild(toolTipText);
                    toolTipText = null;
                    element2.classList.remove('toolTip');
                }
            }, 3000);
        }
    });
};
