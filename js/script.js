// 1. APPLICATION STATE
// - Holds the state of the application
// - This is the single source of truth for the application state
const state = {
  currentInput: localStorage.getItem('currentInput') || '',
};

// 2. STATE ACCESSORS/MUTATORS FN'S
// - Functions that allow us to get and set the state
// - Here we will create functions to update and clear the input
function updateInput(value) {
  switch (value) {
    case 'C':
      state.currentInput = '';
      break;
    case '=':
      try {
        state.currentInput = eval(state.currentInput).toString();
      } catch {
        state.currentInput = 'Error';
      }
      break;
    case '+/-':
      if (state.currentInput) {
        state.currentInput = state.currentInput.charAt(0) === '-' ?
          state.currentInput.slice(1) :
          '-' + state.currentInput;
      }
      break;
    case 'CAT':
      fetchQuote();
      return;
    default:
      state.currentInput += value;
  }
  localStorage.setItem('currentInput', state.currentInput);
}

function clearInput() {
  state.currentInput = '';
  localStorage.removeItem('currentInput');
}

// 3. DOM NODE REFERENCES
// - Static references to DOM nodes needed after the start of the application
const display$ = document.querySelector("#display");
const buttons$ = document.querySelectorAll(".button");

// 4. DOM NODE CREATION FN'S
// - Dynamic creation of DOM nodes needed upon user interaction
// - Here we will create a function that will update the display
function updateDisplay() {
  display$.value = state.currentInput;
  adjustTextareaHeight();
}

// Adjust the height of the textarea dynamically
function adjustTextareaHeight() {
  display$.style.height = 'auto';
  display$.style.height = display$.scrollHeight + 'px';
}

// 5. RENDER FN'S
// - These functions will render the application state to the DOM
// - Here we will use a very naive but simple approach to re-render the display
function render() {
  updateDisplay();
}

// 6. EVENT HANDLERS
// - These functions handle user interaction e.g. button clicks, key presses etc.
// - These functions will call the state mutators and then call the render function
// - The naming convention for the event handlers is on<DOM NODE><Event>
function onButtonClick(event) {
  const value = event.target.dataset.value;
  updateInput(value);
  render();
}

function onKeyPress(event) {
  const key = event.key;
  if (/\d/.test(key) || ['+', '-', '*', '/', '.'].includes(key)) {
    updateInput(key);
  } else if (key === 'Enter') {
    updateInput('=');
  } else if (key === 'Escape') {
    updateInput('C');
  } else if (key === 'Backspace') {
    state.currentInput = state.currentInput.slice(0, -1);
  }else if(key === 'c'){
    state.currentInput = '';
  } else if (key.toLowerCase() === 'k') {
    updateInput('CAT');
  }
  render();
}

// 7. INIT BINDINGS
// - These are the initial bindings of the event handlers
buttons$.forEach(button => button.addEventListener('click', onButtonClick));
document.addEventListener('keydown', onKeyPress);

// 8. INITIAL RENDER
// - Here will call the render function to render the initial state of the application
render();

// Fetch Cat Quotes Jokes
function fetchQuote() {
  fetch('https://meowfacts.herokuapp.com/')
    .then(response => response.json())
    .then(data => {
      state.currentInput = data.data[0];
      localStorage.setItem('currentInput', state.currentInput);
      render();
    })
    .catch(error => {
      console.error('Error fetching quote:', error);
      state.currentInput = 'Error';
      localStorage.setItem('currentInput', state.currentInput);
      render();
    });
}
