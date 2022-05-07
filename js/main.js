/* variables and long-living event listeners*/

// used globally
 const memory_buttons_wrapper = document.getElementById('memoryButtonsWrapper');
// const memory_buttons_children = [];
// for(x of memory_buttons_wrapper.children)
//   memory_buttons_children.push(x);

const main_buttons_wrapper = document.getElementById('mainButtonsWrapper');
const main_buttons_children = [];
for(x of main_buttons_wrapper.children)
  main_buttons_children.push(x);

// animation and logic trigger after mouse click for all buttons
let currently_active;
const all_buttons = document.getElementsByTagName('BUTTON');
for(let x of all_buttons)
  x.addEventListener('mousedown', buttonMouseDown);

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


// used to toggle between ◱ and □ inside the button
const top_full = document.getElementById('full');
let full_size = false;
let fs_initX, fs_initY;
let fs_init_width, fs_init_height;
/*
full_size:
- set when clicking full screen button
- unset when pressing it again or drag-resizing
*/


// animation and logic for field top overflow buttons
const overflow_left_button = document.getElementById('overflowLeft');
const overflow_right_button = document.getElementById('overflowRight');


// logic for menu button, menu and his/mem height
const menu_wrapper = document.getElementById('menuWrapper');
const menu_list = document.getElementById('menuList');
const his_and_mem_wrapper = document.getElementById('hisAndMemWrapper');


// calculator right side logic
const calc_right_wrapper = document.getElementById('calculatorRightWrapper');
const history_show_button = document.getElementById('showHistoryButton');
const memory_show_button = document.getElementById('mShow');
const delete_button_wrapper = document.getElementById('deleteWrapper');
const delete_button = document.getElementById('deleteHisMem');
const his_mem_choice_buttons_wrapper = document.getElementById('calcRightTop');
const his_mem_opacity_wrapper = document.getElementById('calcLeftOpacityWrapper');
his_mem_opacity_wrapper.addEventListener('click', showHisMem);
let enough_space_for_right = true;
let showing_right_wrapper_when_small = false;
let showing_right_wrapper_when_big = true;
let right_wrapper_not_hidden = true;

/* functions considering left and right side of calculator */
function enoughSpaceForRight() {
  if(calculator.clientWidth >= 560 && !showing_right_wrapper_when_big) {
    calc_right_wrapper.style.display = 'block';
    calc_right_wrapper.style.minWidth = '240px';
    calc_right_wrapper.style.maxWidth = '320px';
    calc_right_wrapper.style.position = 'relative';
    calc_right_wrapper.style.top = '0';
    calc_right_wrapper.style.zIndex = '4';

    delete_button_wrapper.style.zIndex = '4';
    delete_button_wrapper.style.display = 'block';

    his_mem_choice_buttons_wrapper.style.display = 'block';

    history_show_button.style.display = 'none';
    memory_show_button.style.display = 'none';

    enough_space_for_right = true;
    showing_right_wrapper_when_big = true;
    right_wrapper_not_hidden = true;
    shouldDisplayDeleteButton();
  }
  else if(calculator.clientWidth < 560 && right_wrapper_not_hidden) {
    calc_right_wrapper.style.display = 'none';
    calc_right_wrapper.style.minWidth = '100%';
    calc_right_wrapper.style.maxWidth = '100%';
    calc_right_wrapper.style.position = 'absolute';
    calc_right_wrapper.style.top = '170px';
    calc_right_wrapper.style.zIndex = '6';

    delete_button_wrapper.style.zIndex = '6';
    delete_button_wrapper.style.display = 'none';

    his_mem_choice_buttons_wrapper.style.display = 'none';

    history_show_button.style.display = 'block';
    memory_show_button.style.display = 'block';

    enough_space_for_right = false;
    showing_right_wrapper_when_big = false;
    right_wrapper_not_hidden = false;
  }
}

function shouldDisplayDeleteButton() {
  if(currently_showing === 'history') {
    if(history_field.children[0].tagName === 'P')
      delete_button.style.display = 'none';
    else
      delete_button.style.display = 'block';
  }
  else {
    if(memory_field.children[0].tagName === 'P')
      delete_button.style.display = 'none';
    else
      delete_button.style.display = 'block';
  }
}

function showHisMem(show_what) {
  if(!showing_right_wrapper_when_small) {
    calc_right_wrapper.style.display = 'block';
    delete_button_wrapper.style.display = 'block';
    his_mem_opacity_wrapper.style.display = 'block';
    show_what === 'history' ? historyChoose() : memoryChoose();
    shouldDisplayDeleteButton();
    showing_right_wrapper_when_small = true;
  }
  else {
    calc_right_wrapper.style.display = 'none';
    delete_button_wrapper.style.display = 'none';
    his_mem_opacity_wrapper.style.display = 'none';
    showing_right_wrapper_when_small = false;
  }
}


// history and memory logic
let currently_showing = 'history';
const history_field = document.getElementById('historyField');
const history_button = document.getElementById('hisButton');
let next_his_div_id = 0;
const memory_field = document.getElementById('memoryField');
const memory_button = document.getElementById('memButton');
let next_mem_div_id = 0;


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

/* history and memory functions */

//choose which field to shown
function historyChoose() {
  const classes = history_button.classList;

  if(classes.contains('chosen'))
    return;

  classes.add('chosen');
  history_field.style.display = 'block';

  memory_button.classList.remove('chosen');
  memory_field.style.display = 'none';

  currently_showing = 'history';
  shouldDisplayDeleteButton();
}

function memoryChoose() {
  const classes = memory_button.classList;

  if(classes.contains('chosen'))
    return;

  classes.add('chosen');
  memory_field.style.display = 'block';

  history_button.classList.remove('chosen');
  history_field.style.display = 'none';

  currently_showing = 'memory';
  shouldDisplayDeleteButton();
}

//clear currently shown field, after pressing button
function hisMemClear() {
  if(currently_showing === 'history')
    history_field.innerHTML = '<p>Nie ma jeszcze historii</p>';
  else
    memoryClear();

  shouldDisplayDeleteButton();
}

//history logic
function historyAdd() {
  const his_div = document.createElement('div');
  his_div.addEventListener('mousedown', buttonMouseDown);
  his_div.id = `historyElement${next_his_div_id}`;
  next_his_div_id++;
  his_div.innerHTML = `<p>${field_top.innerHTML}</p><h4>${field_bottom.innerHTML}</h4>`;
  history_field.insertBefore(his_div, history_field.firstElementChild);

  if(history_field.childElementCount > 20)
    history_field.removeChild(history_field.lastElementChild);
  else if(history_field.children[1].tagName === 'P')
    history_field.removeChild(history_field.lastElementChild);

  shouldDisplayDeleteButton();
}

function historyRead(element) {
  let top_buf = element.children[0].innerHTML;

  if(top_buf.indexOf(' + ') !== -1)
    current_operator = '+';
  else if(top_buf.indexOf(' - ') !== -1)
    current_operator = '-';
  else if(top_buf.indexOf(' * ') !== -1)
    current_operator = '*';
  else if(top_buf.indexOf(' / ') !== -1)
    current_operator = '/';

  const A_and_B = top_buf.split(` ${current_operator} `);

  calcA = parseFloat(A_and_B[0].replace(',', '.'));
  calcB = parseFloat(A_and_B[1].replace(',', '.'));

  doMaths('true');
}

//memory logic
function memoryClear() {
  memory_field.innerHTML = '<p>Brak elementów zapisanych w pamięci</p>';
  checkMemoryDisabled();
  shouldDisplayDeleteButton();
}

function memoryRemoveElement(element) {
  memory_field.removeChild(element.parentElement);
  if(memory_field.childElementCount === 0)
    memoryClear();
}

function checkMemoryDisabled() {
  if(memory_field.children[0].tagName === 'P')
    memory_buttons_wrapper.classList.add('disableSomeButtons');
  else
    memory_buttons_wrapper.classList.remove('disableSomeButtons');
}

function memoryRead(element) {
  if(memory_field.children[0].tagName === 'P')
    return;
  
  clearInput(true);

  if(element === 'read latest')
    field_bottom.innerHTML = memory_field.children[0].children[0].innerHTML;
  else
    field_bottom.innerHTML = element.children[0].innerHTML;

  adjustFontSize();
}

function memoryAddOrSubstract(element, operation) {
  //add or substract field bottom from memory element
  if(memory_field.children[0].tagName === 'P')
    memoryStore(0);

  let a;
  let b = parseBottom();

  //when no specified element is chosen, it takes the latest one
  if(element === 0) {
    a = parseFloat(memory_field.children[0].children[0].innerHTML.replace(/ /g, '').replace(',', '.'));
    memory_field.children[0].children[0].innerHTML = operation === 'add' ? a + b : a - b;
  }
  else {
    let button_parent = element.parentElement;
    a = parseFloat(button_parent.children[0].innerHTML.replace(/ /g, '').replace(',', '.'));
    button_parent.children[0].innerHTML = operation === 'add' ? a + b : a - b;
  }
}

function memoryStore(store_what) {
  //store current bottom field in memory
  const mem_div = document.createElement('div');
  mem_div.id = `memoryElement${next_mem_div_id}`;
  mem_div.addEventListener('mousedown', buttonMouseDown);
  mem_div.innerHTML = `<h4>${store_what}</h4>`;
  
  const mc_button = document.createElement('button');
  mc_button.id = `mcButton${next_mem_div_id}`;
  mc_button.innerHTML = 'MC';
  mc_button.addEventListener('mousedown', buttonMouseDown);
  mem_div.appendChild(mc_button);

  const mp_button = document.createElement('button');
  mp_button.id = `mpButton${next_mem_div_id}`;
  mp_button.innerHTML = 'M+';
  mp_button.addEventListener('mousedown', buttonMouseDown);
  mem_div.appendChild(mp_button);

  const mm_button = document.createElement('button');
  mm_button.id = `mmButton${next_mem_div_id}`;
  mm_button.innerHTML = 'M-';
  mm_button.addEventListener('mousedown', buttonMouseDown);
  mem_div.appendChild(mm_button);
  
  next_mem_div_id++;
  memory_field.insertBefore(mem_div, memory_field.firstElementChild);

  if(memory_field.childElementCount > 20)
    memory_field.removeChild(memory_field.lastElementChild);
  else if(memory_field.children[1].tagName === 'P')
    memory_field.removeChild(memory_field.children[1]);

  checkMemoryDisabled();
  shouldDisplayDeleteButton();
}


/* when useless button is pressed */
function wrapTopLeft() {
  if(full_size)
    return;
  wrapper.style.top = '0';
  wrapper.style.left = '0';
}


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


/* updating menu list and his/mem wrapper height */
function updateWrappersHeight() {
  menu_list.style.height = calculator.clientHeight - 70 + 'px';
  main_buttons_wrapper.style.height = calculator.clientHeight - 200 + 'px';

  if(enough_space_for_right)
    his_and_mem_wrapper.style.height = calculator.clientHeight - 110 + 'px';
  else
    his_and_mem_wrapper.style.height = calculator.clientHeight - 240 + 'px';
}

/* resizing calculator */
function resizeUpdate() {
  isTopOverflown();
  enoughSpaceForRight();
  updateWrappersHeight();
  if(showing_right_wrapper_when_small)
    showHisMem(currently_showing);
}

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

  full_size = false;
  top_full.innerHTML = '<span>□</span>';
  resizeUpdate();
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
  resizeUpdate();
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
  resizeUpdate();
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
function doMaths(dont_add) {
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
  if(typeof dont_add === 'undefined')
    historyAdd();
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

    case 'deleteHisMem': hisMemClear(); break;

    case 'hisButton': historyChoose(); break;
    case 'memButton': memoryChoose(); break;

    case 'mStore': memoryStore(field_bottom.innerHTML); break;
    case 'mAdd': memoryAddOrSubstract(0, 'add'); break;
    case 'mSubstract': memoryAddOrSubstract(0, 'substract'); break;
    case 'mClear': memoryClear(); break;
    case 'mRead': memoryRead('read latest'); break;
    case 'mShow': showHisMem('memory'); break;

    case 'showHistoryButton': showHisMem('history'); break;

    case 'embedButton': wrapTopLeft(); break;
  }
  
  if(element.id.indexOf('historyElement') !== -1)
    historyRead(element);
  else if(element.id.indexOf('mpButton') !== -1)
    memoryAddOrSubstract(element, 'add');
  else if(element.id.indexOf('mmButton') !== -1)
    memoryAddOrSubstract(element, 'substract');
  else if(element.id.indexOf('mcButton') !== -1)
    memoryRemoveElement(element);
  else if(element.id.indexOf('memoryElement') !== -1)
    memoryRead(element);
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
- przy obliczeniach można przekroczyć max safe int,
przez co dalsze wyniki są niepoprawne
*/