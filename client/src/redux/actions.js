export const playNote = (noteKey) => ({
  type: 'PLAY_NOTE',
  noteKey,
});

export const stopNote = (noteKey) => ({
  type: 'STOP_NOTE',
  noteKey
});

export const moveUp = (changeArr) => ({
  type: 'MOVE_UP',
  changeArr,
});

export const moveDown = (changeArr) => ({
  type: 'MOVE_DOWN',
  changeArr
});

export const record = () => ({
  type: 'RECORD',
});
