/* variables and long-living event listeners*/

// used globally
const html = document.getRootNode();

const memory_buttons_wrapper = document.getElementById('memoryButtonsWrapper');
const memory_buttons_children = [];
for(x of memory_buttons_wrapper.children)
  memory_buttons_children.push(x);

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

// change calculator's style when it's active
window.addEventListener('mousedown', calcRemoveActive);
calculator.addEventListener('mousedown', calcAddActive);
wrapper.addEventListener('mousedown', calcAddActive);

// inserting input with keyboard
window.addEventListener('keypress', keyboardPress);
window.addEventListener('keydown', keyboardDown);
const field_top = document.getElementById('calculationFieldTop');
const field_bottom = document.getElementById('calculationFieldBottom');

// animation for mouse click
let currently_active;
for(x of memory_buttons_children) {
  x.addEventListener('mousedown', buttonMouseDown);
  x.tabIndex = '-1';
}
for(x of main_buttons_children) {
  x.addEventListener('mousedown', buttonMouseDown);
  x.tabIndex = '-1';
}


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

/* change calculator's style when it's active */
function calcAddActive(event) {
  calculator.classList.add('activeCalculator');
  event.stopPropagation();
}

function calcRemoveActive() {
  calculator.classList.remove('activeCalculator');
}


/* inserting input with keyboard */
// calculation logic
let current_operator;

/*
- set when defining operator
- used in doMaths and percentCalc
*/
let calcA;

/*
- set in doMaths, specialCalc or percentCalc
- used in doMaths
*/
let calcB;

/* 
- set after choosing operator
- used only to clear 0 when inserting input
*/
let waiting_for_b = false;

/*
- set in specialCalc, percentCalc and doMaths
- used to keep b always the same when performing the same operation multiple times inside doMaths
and percentCalc
*/
let dont_change_b = false;

/*
- set after doMaths
- used to clear entire input when inserting input or using CE button
- also used to make % not do anything
- and to make =/- clear top
*/
let first_calc_done = false;

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

function changeNumField(numVal, isNum, add) {
  if(first_calc_done)
    clearInput(true);
  else if(waiting_for_b) {
    clearInput(false);
    waiting_for_b = false;
  }

  if(field_bottom.innerHTML.length >= 19 && add)
    return;

  // checks if we're adding or removing input
  if(add) {
    if(field_bottom.innerHTML === '0' && isNum)
    field_bottom.innerHTML = '';
    
    if(isNum)
    field_bottom.innerHTML += (numVal);
    else
    field_bottom.innerHTML += ',';
  }
  else {
    field_bottom.innerHTML = field_bottom.innerHTML.slice(0, -1).trim();
    if(field_bottom.innerHTML === '')
    field_bottom.innerHTML = '0';
  }
  adjustFontSize(field_bottom.innerHTML.length);
}

function changeSign() {
  if(first_calc_done) {
    let buf = parseBottom();
    clearInput(true);
    field_bottom.innerHTML = buf;
  }
    
  field_bottom.innerHTML = parseBottom() * -1;
  field_bottom.innerHTML = field_bottom.innerHTML.replace('.', ',');
  adjustFontSize(field_bottom.innerHTML.length);
}

function percentCalc() {
  if(typeof current_operator === 'undefined'
  || first_calc_done)return;

  if(!dont_change_b) {
    calcB = calcA * (parseBottom() / 100);
    dont_change_b = true;
  }
  doMaths();
}

function specialCalc(whichCalc) {
  let bottom_val = parseBottom();

  if(typeof current_operator === 'undefined') {
    switch(whichCalc) {
      case 'onexth':
        field_top.innerHTML = `1/(${bottom_val}) =`
        field_bottom.innerHTML = 1 / bottom_val;
        break;
      case 'square':
        field_top.innerHTML = `sqr(${bottom_val}) =`
        field_bottom.innerHTML = Math.pow(bottom_val, 2);
        break;
      case 'sqrt':
        field_top.innerHTML = `√(${bottom_val}) =`
        field_bottom.innerHTML = Math.sqrt(bottom_val);
        break;
    }
    adjustFontSize(field_bottom.innerHTML.length);
  }
  else {
    switch(whichCalc) {
      case 'onexth':
        calcB = 1 / bottom_val;
        break;
      case 'square':
        calcB = Math.pow(bottom_val, 2);
        break;
      case 'sqrt':
        calcB = Math.sqrt(bottom_val);
        break;
    }
    dont_change_b = true;
    doMaths();
  }
}

//on + - / *
function defineOperator(cur_ope) {
  current_operator = cur_ope;
  field_top.innerHTML = field_bottom.innerHTML + ` ${current_operator}`;
  calcA = parseBottom();
  waiting_for_b = true;
  first_calc_done = false;
  dont_change_b = false;
}

//on = or enter, when we are ready to perform calculation
function doMaths() {
  if(typeof current_operator === 'undefined')
    return;
    
  let calcC;

  if(!dont_change_b)
    calcB = parseBottom();

  switch(current_operator) {
    case '+': calcC = calcA + calcB; break;
    case '-': calcC = calcA - calcB; break;
    case '*': calcC = calcA * calcB; break;
    case '/': calcC = calcA / calcB; break;
  }

  if(calcB < 0)
    field_top.innerHTML = `${calcA} ${current_operator} (${calcB}) =`;
  else
    field_top.innerHTML = `${calcA} ${current_operator} ${calcB} =`;

  field_bottom.innerHTML = String(calcC).replace('.', ',');

  adjustFontSize(field_bottom.innerHTML.length);

  calcA = calcC;
  dont_change_b = true;
  first_calc_done = true;
}

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////
 
function parseBottom() {
  return parseFloat(field_bottom.innerHTML.replace(/ /g, '').replace(',', '.'));
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
  if(insert) {
    changeNumField(element.innerHTML, isNum, true);
    return;
  }
  if(element.id === 'backspace' && field_bottom.innerHTML !== '0')
    changeNumField(element.innerHTML, false, false);

  //other elements
  switch(element.id) {
    case 'add': defineOperator('+'); break;
    case 'substract': defineOperator('-'); break;
    case 'multiply': defineOperator('*'); break;
    case 'divide': defineOperator('/'); break;
    case 'equals': doMaths(); break;

    case 'clearLast': clearInput(first_calc_done ? true : false); break;
    case 'clearAll': clearInput(true); break;

    case 'plusMinus': changeSign(); break;

    case 'percent': percentCalc(); break;

    case 'oneDivByX': specialCalc('onexth'); break;
    case 'xSquare': specialCalc('square'); break;
    case 'squareRoot': specialCalc('sqrt'); break;
  }
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
    case 'x':
    case 'X':
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

function adjustFontSize(len) {
  if(len <= 13) field_bottom.style.fontSize = '2.8rem';
  else field_bottom.style.fontSize = '1.4rem';
  formatBottom();
}

//on escape, del or called by function
function clearInput(clear_all) {
  if(clear_all) {
    field_top.innerHTML = '';
    current_operator = undefined;
    calcA = undefined;
    calcB = undefined;
    waiting_for_b = false;
    first_calc_done = false;
  }
  field_bottom.innerHTML = '0';
  dont_change_b = false;
  adjustFontSize(1);
}

function formatBottom() {
  if(field_bottom.innerHTML.indexOf('Infinity') !== -1)
    return;

  // makes number split every 3 digits
  if(field_bottom.innerHTML.length > 3
    && field_bottom.innerHTML.indexOf(',') === -1)
     {
      let spaceless_copy = field_bottom.innerHTML.replace(/ /g, '');
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


// przesuwanie czasem nie działa jak należy...
// po znaku - może być wstawiona spacja przy formatowaniu, co należy zmienić
// trzeba opracować plan radzenia sobie z notacją wykładniczą
// numery powinny być ucinane jeśli są zbyt długie

// po wykonaniu jakiegoś special calc można dopisywać do wyniku jakieś cyfry, a góra się nie zmiena
