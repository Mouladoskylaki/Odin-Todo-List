// toolTip.js

export const toolTipFun = (element, text, text2) => {
  let toolTipTimeOut;
    element.addEventListener('mouseover', () => {
      let toolTipDiv = document.createElement('div');
      toolTipDiv.classList.add('toolTip');
      
      let toolTipText = document.createElement('span');
      toolTipText.classList.add('toolTipText');
      toolTipText.textContent = text;
      toolTipDiv.appendChild(toolTipText);

      element.classList.add('toolTip');
      element.appendChild(toolTipText);

      toolTipTimeOut = setTimeout(() => {
        toolTipText.classList.add('fade-out');
        setTimeout(() => {
          if (toolTipText) {
            element.removeChild(toolTipText);
            element.classList.remove('toolTip');
          }
        }, 300);
      }, 3000);

      let elemChangedState = document.querySelector('.changed');
      if (element.classList.contains('changed')) {
        toolTipText.textContent = text2;
      }

    });
    
    element.addEventListener('mouseout', () => {
      clearTimeout(toolTipTimeOut);
        const toolTipText = document.querySelector('.toolTipText');
        if (toolTipText) {
          element.removeChild(toolTipText);
          element.classList.remove('toolTip');
        };
    });
  };