/* variables and long-living event listeners*/

// used globally
const html = document.getRootNode();
const main_buttons_wrapper = document.getElementById('mainButtonsWrapper');
const main_buttons_children = [];
for(x of main_buttons_wrapper.children)
  main_buttons_children.push(x);

// moving / resizing calculator
const wrapper = document.getElementById('calculatorWrapper');
const calculator = document.getElementById('calculator');
const calc_header = document.getElementById('calcHeaderWrapper');
calc_header.addEventListener('mousedown', mouseDown);
let init_calcX, init_calcY;
let init_mouseX, init_mouseY;
let offsetX, offsetY;
// resizing
let init_width, init_height;
let currently_moving;
let min_width = parseInt(getComputedStyle(calculator).minWidth);
let min_height = parseInt(getComputedStyle(calculator).minHeight);
let top_extended = false;
let left_extended = false;
const res_pos = {
  top: document.getElementById('top'),
  bottom: document.getElementById('bottom'),
  left: document.getElementById('left'),
  right: document.getElementById('right'),
  top_left: document.getElementById('topLeft'),
  top_right: document.getElementById('topRight'),
  bottom_right: document.getElementById('bottomRight'),
  bottom_left: document.getElementById('bottomLeft')
}
for(let x in res_pos)
  res_pos[x].addEventListener('mousedown', resizeMouseDown);

// inserting input with keyboard
window.addEventListener('keypress', keyboardPress);
window.addEventListener('keydown', keyboardDown);
const field_top = document.getElementById('calculationFieldTop');
const field_bottom = document.getElementById('calculationFieldBottom');

// animation for mouse click
let currently_active;
for(x of main_buttons_children)
  x.addEventListener('mousedown', buttonMouseDown);

// calculation logic
let current_operator;
let a, b, c;


/* grabbing and moving around the calculator */
function mouseDown(event) {
  calc_header.style.cursor = 'grabbing';

  init_calcX = wrapper.getBoundingClientRect().x;
  init_calcY = wrapper.getBoundingClientRect().y;
  init_mouseX = event.pageX;
  init_mouseY = event.pageY;

  html.addEventListener('mousemove', move);
  html.addEventListener('mouseup', mouseUp);
}

function mouseUp() {
  calc_header.style.cursor = 'grab';
  html.removeEventListener('mousemove', move);
  html.removeEventListener('mouseup', mouseUp);
}

function move(event) {
  offsetX = event.pageX - init_mouseX;
  offsetY = event.pageY - init_mouseY;

  wrapper.style.left = `${init_calcX + offsetX}px`;
  wrapper.style.top = `${init_calcY + offsetY}px`;
}


/* resizing calculator */
function resizeMouseDown(event) {
  currently_moving = event.currentTarget.id;

  init_calcX = wrapper.getBoundingClientRect().x;
  init_calcY = wrapper.getBoundingClientRect().y;
  init_width = calculator.getBoundingClientRect().width;
  init_height = calculator.getBoundingClientRect().height;
  init_mouseX = event.pageX;
  init_mouseY = event.pageY;

  html.addEventListener('mousemove', resizeMouseMove);
  html.addEventListener('mouseup', resizeMouseUp);
}

function resizeMouseMove(event) {
  offsetX = event.pageX - init_mouseX;
  offsetY = event.pageY - init_mouseY;

  if(currently_moving === 'top' || currently_moving === 'topLeft'
  || currently_moving === 'topRight') 
  {
    calculator.style.height = `${init_height - offsetY}px`;
    if(offsetY < 0) {
      wrapper.style.top = `${init_calcY + offsetY}px`;
      top_extended = true;
    }
    else if(parseInt(getComputedStyle(calculator).height) > min_height && top_extended)
      wrapper.style.top = `${init_calcY - offsetY}px`;
    else if(parseInt(getComputedStyle(calculator).height) > min_height)
      wrapper.style.top = `${init_calcY + offsetY}px`;
  }

  if(currently_moving === 'left' || currently_moving === 'topLeft'
  || currently_moving === 'bottomLeft') 
  {
    calculator.style.width = `${init_width - offsetX}px`;
    if(offsetX < 0) {
      wrapper.style.left = `${init_calcX + offsetX}px`;
      left_extended = true;
    }
    else if(parseInt(getComputedStyle(calculator).width) > min_width && left_extended)
      wrapper.style.left = `${init_calcX - offsetX}px`;
    else if(parseInt(getComputedStyle(calculator).width) > min_width)
      wrapper.style.left = `${init_calcX + offsetX}px`;
  }

  if(currently_moving === 'bottom' || currently_moving === 'bottomLeft'
  || currently_moving === 'bottomRight') 
  { calculator.style.height = `${init_height + offsetY}px`; }

  if(currently_moving === 'right' || currently_moving === 'topRight'
  || currently_moving === 'bottomRight') 
  { calculator.style.width = `${init_width + offsetX}px`; }

  main_buttons_wrapper.style.height = `${parseInt(getComputedStyle(calculator).height) - 200}px`;
}

function resizeMouseUp() {
  html.removeEventListener('mousemove', resizeMouseMove);
  html.removeEventListener('mouseup', resizeMouseUp);
  top_extended = false;
  left_extended = false;
}


/* inserting input with keyboard */
function adjustFontSize(len) {
  if(len <= 13)
    field_bottom.style.fontSize = '2.8rem';
  else
    field_bottom.style.fontSize = '1.6rem';
}

function changeNumField(numVal, isNum, add) {
  // while sending length to adjustFontSize, we assume the length will be changed by 1
  // but it can get changed by 2 if we add / remove space, pobably not very important

  // checks if we're adding or removing input
  if(add) {
    adjustFontSize(field_bottom.innerHTML.length + 1);
    if(field_bottom.innerHTML === '0' && isNum)
    field_bottom.innerHTML = '';

    if(isNum)
      field_bottom.innerHTML += (numVal);
    else
      field_bottom.innerHTML += ',';
  }
  else {
    field_bottom.innerHTML = field_bottom.innerHTML.slice(0, -1).trim();
    adjustFontSize(field_bottom.innerHTML.length);
    if(field_bottom.innerHTML === '')
      field_bottom.innerHTML = '0';
  }

  // makes number split every 3 digits
  if(field_bottom.innerHTML.length > 3
  && field_bottom.innerHTML.indexOf(',') === -1)
   {
    let spaceless_copy = '';
    for(let i = 0; i < field_bottom.innerHTML.length; i++) {
      if(field_bottom.innerHTML.charAt(i) !== ' ')
        spaceless_copy += field_bottom.innerHTML.charAt(i);
    }

    let len = spaceless_copy.length;
    let modulo = len % 3;
    let insert_new_space = modulo ? -2 : -1;
    let buf_str = '';

    for(let i = 0; i < len; i++) {
      if(insert_new_space != -2)
        insert_new_space++;

      if(i === modulo && i > 0 || insert_new_space === 3) {
        buf_str += ' ';
        insert_new_space = 0;
      }
      buf_str += spaceless_copy.charAt(i);
    }
    field_bottom.innerHTML = buf_str;
  }
}

function keyLogic(element, clickInput) {
  //animate if input comes from keyboard
  if(typeof clickInput === 'undefined')
    animateButton(element);

  //inserting and deleting user input
  let isNum = false;
  let insert = false;
  if(!isNaN(Number(element.innerHTML))) { isNum = true; insert = true; }
  else if((element.id === 'comma') && field_bottom.innerHTML.indexOf(',') === -1)
    insert = true;   
  if(insert && field_bottom.innerHTML.length <= 22)
    changeNumField(element.innerHTML, isNum, true);
  if(insert)return;
  if(element.id === 'backspace' && field_bottom.innerHTML !== '0')
    changeNumField(element.innerHTML, false, false);

  //other elements
  switch(element.id) {
    case 'add': defineOperator('+'); break;
    case 'substract': defineOperator('-'); break;
    case 'multiply': defineOperator('*'); break;
    case 'divide': defineOperator('/'); break;
    case 'equals': doMaths(); break;

    case 'clearLast': clearInput(false); break;
    case 'clearAll': clearInput(true); break;
  }
}

function clearInput(clear_all) {
  if(clear_all)
    field_top.innerHTML = '';
  field_bottom.innerHTML = '0';
  adjustFontSize(0);
}

function defineOperator(cur_ope) {
  current_operator = cur_ope;
  field_top.innerHTML = field_bottom.innerHTML + ` ${current_operator}`;
}

function doMaths() {
  if(typeof current_operator === 'undefined')
    return;

  a = parseFloat(field_top.innerHTML.replace(',', '.'));
  b = parseFloat(field_bottom.innerHTML.replace(',', '.'));

  switch(current_operator) {
    case '+': c = a + b; break;
    case '-': c = a - b; break;
    case '*': c = a * b; break;
    case '/': c = a / b; break;
  }
  field_top.innerHTML = `${a} ${current_operator} ${b} =`; 
  field_bottom.innerHTML = c;
}
 
function keyboardPress(event) {
  switch(event.key) {
    case '%': keyLogic(main_buttons_children[0]); break;
    case 'Delete': keyLogic(main_buttons_children[1]); break;
    case 'Escape': keyLogic(main_buttons_children[2]); break;
    case 'Backspace': keyLogic(main_buttons_children[3]); break;
    case 'q': keyLogic(main_buttons_children[4]); break;
    case 'w': keyLogic(main_buttons_children[5]); break;
    case 'e': keyLogic(main_buttons_children[6]); break;
    case '/': keyLogic(main_buttons_children[7]); break;
    case '7': keyLogic(main_buttons_children[8]); break;
    case '8': keyLogic(main_buttons_children[9]); break;
    case '9': keyLogic(main_buttons_children[10]); break;
    case '*': keyLogic(main_buttons_children[11]); break;
    case '4': keyLogic(main_buttons_children[12]); break;
    case '5': keyLogic(main_buttons_children[13]); break;
    case '6': keyLogic(main_buttons_children[14]); break;
    case '-': keyLogic(main_buttons_children[15]); break;
    case '1': keyLogic(main_buttons_children[16]); break;
    case '2': keyLogic(main_buttons_children[17]); break;
    case '3': keyLogic(main_buttons_children[18]); break;
    case '+': keyLogic(main_buttons_children[19]); break;
    case 'r': keyLogic(main_buttons_children[20]); break;
    case '0': keyLogic(main_buttons_children[21]); break;
    case ',':
    case '.': keyLogic(main_buttons_children[22]); break;
    case '=':
    case 'Enter': keyLogic(main_buttons_children[23]); break; 
  }
}

function keyboardDown(event) {
  switch(event.key) {
    case 'Backspace':
    case 'Delete':
    case 'Escape':
      keyboardPress(event);
  }    
}


/* animation for main buttons on key press */
function animateButton(target) {
  target.classList.add('active');
  setTimeout(() => target.classList.remove('active'), 80);
}
/* animation for main buttons on click and logic trigger */
function buttonMouseDown(event) {
  currently_active = event.currentTarget;
  currently_active.classList.add('active');
  currently_active.addEventListener('mouseup', mouseUpButton);
  window.addEventListener('mouseup', mouseUpWindow);
}
function mouseUpWindow() {
  currently_active.classList.remove('active');
  currently_active.removeEventListener('mouseup', mouseUpButton);
  window.removeEventListener('mouseup', mouseUpWindow);
}
function mouseUpButton() {
  keyLogic(currently_active, 'value');
}


