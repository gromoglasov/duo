const initialState = {
  activeKeys:[],
  activeKeyboardKeys: {
    65: 261.63,
    87: 277.18,
    83: 293.66,
    69: 311.13,
    68: 329.63,
    70: 349.23,
    84: 369.99,
    71: 392.00,
    89: 415.30,
    72: 440.00,
    85: 466.16,
    74: 493.88,
    75: 523.25,
    79: 554.37,
    76: 587.33,
    80: 622.25,
    186: 659.25,
    222: 698.46},
  userInput: {},
};


const reducer = (state = initialState, action) => {
  let newState;
  let newArr = [...state.activeKeyboardKeys];
  let updatedInput = Object.assign({}, state.userInput);
  switch (action.type) {
  case 'PLAY_NOTE':
    if (action.noteKey !== undefined) {
      if (!updatedInput[action.noteKey]) updatedInput[action.noteKey] = [];
      updatedInput[action.noteKey].push(Date.now());
    }
    newState = {
      activeKeys: [...state.activeKeys,
        action.noteKey],
      userInput: updatedInput,
      activeKeyboardKeys: state.activeKeyboardKeys,
    };
    return newState;
  case 'STOP_NOTE':
    if (action.noteKey !== undefined) updatedInput[action.noteKey].push(Date.now());
    newState = {
      activeKeys: stopNote(state.activeKeys, action.noteKey),
      userInput: updatedInput,
      activeKeyboardKeys: state.activeKeyboardKeys
    };
    return newState;
  case 'MOVE_UP':
    for (let i=0; i < action.changeArr.length; i++) {
      newArr.slice();
      newArr.push(action.changeArr[i]);
    }
    newState = {
      activeKeys: [...state.activeKeys],
      userInput: state.userInput,
      activeKeyboardKeys: newArr
    };
    return newState;
  case 'MOVE_DOWN':
    for (let i=0; i < action.changeArr.length; i++) {
      newArr.pop();
      newArr.unshift(action.changeArr[i]);
    }
    newState = {
      activeKeys: [...state.activeKeys],
      userInput: state.userInput,
      activeKeyboardKeys: newArr
    };
    return newState;
  default:
    return state;
  }
};

function stopNote (arrayOfNotes, note) {
  let newArrayOfNotes = [...arrayOfNotes];
  let index = newArrayOfNotes.indexOf(note);
  if (index > -1) {
    newArrayOfNotes.splice(index, 1);
  }
  return newArrayOfNotes;
}

export default reducer;
