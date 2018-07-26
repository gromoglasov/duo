
export const playNote = (noteKey) => ({
  type: 'PLAY_NOTE',
  noteKey,

});

export const stopNote = (noteKey) => ({
  type: 'STOP_NOTE',
  noteKey
});
