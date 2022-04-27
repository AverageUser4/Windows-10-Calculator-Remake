/* grabbing and moving around the calculator */
const html = document.getRootNode();

const wrapper = document.getElementById('calculatorWrapper');
const calculator = document.getElementById('calculator');

const calc_header = document.getElementById('calcHeaderWrapper');
calc_header.addEventListener('mousedown', mouseDown);

let init_calcX, init_calcY;
let init_mouseX, init_mouseY;
let offsetX, offsetY;

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
let init_width, init_height;
let currently_moving;
let min_width = parseInt(getComputedStyle(calculator).minWidth);
let min_height = parseInt(getComputedStyle(calculator).minHeight);

let top_extended = false;
let left_extended = false;

const main_buttons_wrapper = document.getElementById('mainButtonsWrapper');

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

for(let x in res_pos) {
  res_pos[x].addEventListener('mousedown', resizeMouseDown);
}

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

/* inserting input */
window.addEventListener('keydown', insertNumber);

const field_top = document.getElementById('calculationFieldTop');
const field_bottom = document.getElementById('calculationFieldBottom');

function insertNumber(event) {
  if(event.which < 48 || event.which > 57 ||
  field_bottom.innerHTML.length > 20)return;

  field_bottom.innerHTML += (event.which - 48);

  if(field_bottom.innerHTML.length > 3) {
    let buf_str = '';
    let counter = 1;
    for(let i = field_bottom.innerHTML.length - 1; i > 0; i--) {
      buf_str += field_bottom.innerHTML.charAt(i);
      if(counter % 3 === 0 && field_bottom.innerHTML.charAt(i) !== ' ') {
        buf_str += ' ';
        console.log('abc');
      }
      if(i === 1)
        buf_str += field_bottom.innerHTML.charAt(0);
    }
    
    let better_str = '';
    for(let i = field_bottom.innerHTML.length - 1; i >= 0; i--) {
      better_str += buf_str.charAt(i);
    }
    field_bottom.innerHTML = better_str;
  }
}