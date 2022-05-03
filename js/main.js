/* variables and long-living event listeners*/

// used globally
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
calc_header.addEventListener('mousedown', mouseDownCalcHeader);
let init_calcX, init_calcY;
let init_mouseX, init_mouseY;
let offsetX, offsetY;
// resizing
let init_width, init_height;
let currently_moving;
let min_width = parseInt(getComputedStyle(calculator).minWidth);
let min_height = parseInt(getComputedStyle(calculator).minHeight);
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
for(x of memory_buttons_children)
  x.addEventListener('mousedown', buttonMouseDown);

for(x of main_buttons_children)
  x.addEventListener('mousedown', buttonMouseDown);

// animation and logic for top buttons
const top_minimize = document.getElementById('minimize');
const top_full = document.getElementById('full');
const top_close = document.getElementById('close');
top_minimize.addEventListener('mousedown', buttonMouseDown);
top_full.addEventListener('mousedown', buttonMouseDown);
top_close.addEventListener('mousedown', buttonMouseDown);

/*
- set when clicking full screen button
- unset when pressing it again or drag-resizing
*/
let full_size = false;
let fs_initX, fs_initY;
let fs_init_width, fs_init_height;

// animation and logic for field top overflow buttons
const overflow_left_button = document.getElementById('overflowLeft');
const overflow_right_button = document.getElementById('overflowRight');
overflow_left_button.addEventListener('mousedown', buttonMouseDown);
overflow_right_button.addEventListener('mousedown', buttonMouseDown);

// logic for menu button and menu scrolling
const menu_open = document.getElementById('menu');
const menu_close = document.getElementById('menuClose');
const menu_wrapper = document.getElementById('menuWrapper');
const menu_scrollbar = document.getElementById('menuScrollbar');
menu_open.addEventListener('mousedown', buttonMouseDown);
menu_close.addEventListener('mousedown', buttonMouseDown);
menu_wrapper.addEventListener('wheel', scrollMenu);
let menu_scroll_position = 0;
let scroll_pos_max = -932 + calculator.clientHeight;


//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


/* grabbing and moving around the calculator */
function mouseDownCalcHeader(event) {
  calc_header.style.cursor = 'grabbing';

  init_calcX = wrapper.getBoundingClientRect().x;
  init_calcY = wrapper.getBoundingClientRect().y;
  init_mouseX = event.pageX;
  init_mouseY = event.pageY;

  window.addEventListener('mousemove', moveCalc);
  window.addEventListener('mouseup', mouseUpCalcHeader);
}

function mouseUpCalcHeader() {
  calc_header.style.cursor = 'grab';
  window.removeEventListener('mousemove', moveCalc);
  window.removeEventListener('mouseup', mouseUpCalcHeader);
}

function moveCalc(event) {
  offsetX = event.pageX - init_mouseX;
  offsetY = event.pageY - init_mouseY;
  let left_val = init_calcX + offsetX;
  let top_val = init_calcY + offsetY;
  let cur_width = wrapper.getBoundingClientRect().width - 14;
  let cur_height = wrapper.getBoundingClientRect().height - 14;

  if(left_val < -14)left_val = -14;  
  if(top_val < -14)top_val = -14;  
  if(left_val > window.innerWidth - cur_width)left_val = window.innerWidth - cur_width;  
  if(top_val > window.innerHeight - cur_height)top_val = window.innerHeight - cur_height;  

  wrapper.style.left = `${left_val}px`;
  wrapper.style.top = `${top_val}px`;
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

  window.addEventListener('mousemove', resizeMouseMove);
  window.addEventListener('mouseup', resizeMouseUp);
}

function resizeMouseMove(event) {
  let pageX_buf = event.pageX;
  let pageY_buf = event.pageY;

  if(pageX_buf < 0)pageX_buf = 0;
  if(pageY_buf < 0)pageY_buf = 0;
  if(pageX_buf > window.innerWidth)pageX_buf = window.innerWidth;
  if(pageY_buf > window.innerHeight)pageY_buf = window.innerHeight;

  offsetX = pageX_buf - init_mouseX;
  offsetY = pageY_buf - init_mouseY;

  if(currently_moving === 'top' || currently_moving === 'topLeft'
  || currently_moving === 'topRight') 
  {
    calculator.style.height = `${init_height - offsetY}px`;
    if(offsetY < 0 || parseInt(getComputedStyle(calculator).height) > min_height) 
      wrapper.style.top = `${init_calcY + offsetY}px`;
  }

  if(currently_moving === 'left' || currently_moving === 'topLeft'
  || currently_moving === 'bottomLeft') 
  {
    calculator.style.width = `${init_width - offsetX}px`;
    if(offsetX < 0 || parseInt(getComputedStyle(calculator).width) > min_width)
      wrapper.style.left = `${init_calcX + offsetX}px`;
  }

  if(currently_moving === 'bottom' || currently_moving === 'bottomLeft'
  || currently_moving === 'bottomRight') 
  { calculator.style.height = `${init_height + offsetY}px`; }

  if(currently_moving === 'right' || currently_moving === 'topRight'
  || currently_moving === 'bottomRight') 
  { calculator.style.width = `${init_width + offsetX}px`; }

  main_buttons_wrapper.style.height = `${parseInt(getComputedStyle(calculator).height) - 200}px`;
  full_size = false;
  top_full.innerHTML = '<span>□</span>';
  isTopOverflown();
  scrollMenu();
}

function resizeMouseUp() {
  window.removeEventListener('mousemove', resizeMouseMove);
  window.removeEventListener('mouseup', resizeMouseUp);
}

/* seting calculator into min dimensions and putting it into original place */
function minSize() {
  wrapper.style.top = '0';
  wrapper.style.left = '0';
  calculator.style.width = '0';
  calculator.style.height = '0';
  top_full.innerHTML = '<span>□</span>';
  full_size = false;
  main_buttons_wrapper.style.height = `${parseInt(getComputedStyle(calculator).height) - 200}px`;
  isTopOverflown();
  scrollMenu();
}

/* toggling between full window and normal mode */
function fullSize() {
  if(!full_size) {
    fs_initX = wrapper.getBoundingClientRect().x + 'px';
    fs_initY = wrapper.getBoundingClientRect().y + 'px';
    fs_init_width = calculator.getBoundingClientRect().width + 'px';
    fs_init_height = calculator.getBoundingClientRect().height + 'px';
    wrapper.style.top = '-15px';
    wrapper.style.left = '-15px';
    calculator.style.width = '100vw';
    calculator.style.height = '100vh';
    top_full.innerHTML = '◱';
    full_size = true;
  }
  else {
    wrapper.style.left = fs_initX;
    wrapper.style.top = fs_initY;
    calculator.style.width = fs_init_width;
    calculator.style.height = fs_init_height;
    top_full.innerHTML = '<span>□</span>';
    full_size = false;
  }
  main_buttons_wrapper.style.height = `${parseInt(getComputedStyle(calculator).height) - 200}px`;
  isTopOverflown();
  scrollMenu();
}


/* change calculator's style when it's active */
function calcAddActive(event) {
  calculator.classList.add('activeCalculator');
  if(typeof event !== 'undefined')
    event.stopPropagation();
}
function calcRemoveActive() {
  calculator.classList.remove('activeCalculator');
}

/* menu scrolling */
function scrollMenu(event) {
  if(typeof event !== 'undefined') {
    if(event.deltaY > 0)
      menu_scroll_position -= 25;
    else
      menu_scroll_position += 25;
  }

  scroll_pos_max = -932 + calculator.clientHeight;

  if(menu_scroll_position > 0)
    menu_scroll_position = 0;
  else if(menu_scroll_position < scroll_pos_max)
    menu_scroll_position = scroll_pos_max;

  menu_scrollbar.style.top = menu_scroll_position * (803 / scroll_pos_max) + 'px';
  menu_wrapper.style.top = menu_scroll_position + 'px';
  calcAddActive();
}


/* handling overflow in field top */
function isTopOverflown() {
  if(field_top.scrollWidth > field_top.clientWidth) {
    overflow_left_button.style.display = 'block';
    overflow_right_button.style.display = 'block';
  }
  else {
    overflow_left_button.style.display = 'none';
    overflow_right_button.style.display = 'none';
  }
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
  adjustFontSize();
}

function changeSign() {
  if(first_calc_done) {
    let buf = parseBottom();
    clearInput(true);
    field_bottom.innerHTML = buf;
  }
    
  field_bottom.innerHTML = parseBottom() * -1;
  field_bottom.innerHTML = field_bottom.innerHTML.replace('.', ',');
  adjustFontSize();
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

  if(typeof current_operator === 'undefined' || first_calc_done) {
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
    first_calc_done = true;
    adjustFontSize();
    isTopOverflown();
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
  field_top.innerHTML = field_bottom.innerHTML.replace(/ /g, '') + ` ${current_operator}`;
  calcA = parseBottom();
  waiting_for_b = true;
  first_calc_done = false;
  dont_change_b = false;
  isTopOverflown();
}

//on = or enter, when we are ready to perform calculation
function doMaths() {
  if(typeof current_operator === 'undefined')
    return;
    
  let calcC;

  if(!dont_change_b)
    calcB = parseBottom();

  calcA = Number(calcA);
  calcB = Number(calcB);

  switch(current_operator) {
    case '+': calcC = calcA + calcB; break;
    case '-': calcC = calcA - calcB; break;
    case '*': calcC = calcA * calcB; break;
    case '/': calcC = calcA / calcB; break;
  }

  if(String(calcC).indexOf('.') !== -1)
    calcC = resultCorrection(calcC);
  
  let calcA_buf = String(calcA).replace('.', ',');
  let calcB_buf = String(calcB).replace('.', ',');

  //add parentheses for negative B
  if(calcB < 0)
    field_top.innerHTML = `${calcA_buf} ${current_operator} (${calcB_buf}) =`;
  else
    field_top.innerHTML = `${calcA_buf} ${current_operator} ${calcB_buf} =`;
    
  if(String(calcC).length > 24)
    calcC = Number(calcC).toExponential();

  field_bottom.innerHTML = String(calcC).replace('.', ',');

  calcA = calcC;
  dont_change_b = true;
  first_calc_done = true;

  adjustFontSize();
  isTopOverflown();
}

function resultCorrection(calcC) {
  let calcA_str = String(calcA);
  let calcB_str = String(calcB);
  let calcA_deci_length = calcA_str.substring(calcA_str.indexOf('.') + 1).length;
  let calcB_deci_length = calcB_str.substring(calcB_str.indexOf('.') + 1).length;

  //removing trailing zeros
  if(String(calcC).indexOf('e') === -1) {
    switch(current_operator) {
      case '+':
      case '-':
        calcC = calcC.toFixed(Math.max(calcA_deci_length, calcB_deci_length));
        break;
      case '*':
        calcC = calcC.toFixed(calcA_deci_length + calcB_deci_length);
        break;
      case '/':
        calcC = calcC.toPrecision(21);
        break;
    }

    calcC = String(calcC);

    while(calcC.endsWith('0'))
      calcC = calcC.slice(0, -1);
  
    if(calcC.endsWith('.')) {
      calcC = calcC.slice(0, -1);
      return calcC;
    }
  }

  calcC = String(calcC);
  let calcC_arr = calcC.split('.');
  let dot_pos = calcC_arr[0].length;
  let first_not_zero_pos = 1000;
  let remove_some = false;

  //removing very little fraction after zeros, eg. 1 / 10 = 0,10000000000000005551
  if(!calcC.startsWith('0'))
    first_not_zero_pos = dot_pos - 1;

  for(let i = dot_pos + 1; i < calcC.length; i++) {
    if(calcC.charAt(i) === 'e')
      break;
    if(calcC.charAt(i) !== '0' && !remove_some)
      first_not_zero_pos = i;
    if(i > first_not_zero_pos + 5) {
      remove_some = true;
      break;
    }
  }
  if(remove_some)
    calcC = calcC.slice(0, first_not_zero_pos + 1) + (calcC.indexOf('e') !== -1 ? calcC.slice(calcC.indexOf('e')) : '');

  //changing 9,999999999e+20 to 1e+21 etc.
  if(calcC.indexOf('e') !== -1 && calcC_arr[0] === '9') {
    let full_exp = calcC.slice(calcC.indexOf('e'));
    let e_and_sign = full_exp.slice(0, 2);
    let exp_val = full_exp.slice(2);
    let nine_count = 0;

    for(let i = dot_pos + 1; i < calcC.length; i++) {
      if(calcC.charAt(i) === '9')
        nine_count++;
      if(nine_count > 5) {
        exp_val = Number(exp_val);
        exp_val += 1;
        calcC = 1 + e_and_sign + exp_val;
        break;
      }
    }
  }
  return calcC;
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

    case 'minimize': minSize(); break;
    case 'full': fullSize(); break;

    case 'overflowLeft': field_top.scrollLeft -= 50; break;
    case 'overflowRight': field_top.scrollLeft += 50; break;

    case 'menu': menu_wrapper.style.display = 'block'; break;
    case 'menuClose': menu_wrapper.style.display = 'none'; break;
  }
}

function keyboardPress(event) {
  calcAddActive();
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
    default: calcRemoveActive(); break;
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

function adjustFontSize() {
  if(field_bottom.innerHTML.length <= 12) field_bottom.style.fontSize = '2.8rem';
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
    isTopOverflown();
  }
  field_bottom.innerHTML = '0';
  dont_change_b = false;
  adjustFontSize();
}

function formatBottom() {
  if(field_bottom.innerHTML.indexOf('Infinity') !== -1)
    return;

  field_bottom.innerHTML = field_bottom.innerHTML.replace('.', ',');

  // makes number split every 3 digits
  if(field_bottom.innerHTML.length > 3
    && field_bottom.innerHTML.indexOf(',') === -1
    && field_bottom.innerHTML.indexOf('e') === -1)
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


/* animation for buttons on key press */
function animateButton(target) {
  target.classList.add('active');
  setTimeout(() => target.classList.remove('active'), 80);
}
/* animation for buttons on click and logic trigger */
function buttonMouseDown(event) {
  calcAddActive(event);
  event.stopPropagation();
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

/*
- szybkie przesunięcie przy pomniejszaniu przesuwa kalkulator
- dodać wykrywanie okresu i usuwanie cyfr na końcu które nie są z nim zgodne
- po specialCalc nie ma korekcji rezultatów, można ją dodać
*/