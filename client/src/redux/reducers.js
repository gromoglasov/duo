const initialState = {activeKeys:[]};

const reducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
  case 'PLAY_NOTE':
    newState = {
      activeKeys: [...state.activeKeys,
        action.noteKey]
    };
    return newState;
  case 'STOP_NOTE':
    newState = {
      activeKeys: stopNote(state.activeKeys, action.noteKey)
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
