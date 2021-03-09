export const constrainDragAxis = (draggableStyle: any, axis = 'y') => {
  const { transform } = draggableStyle;
  let activeTransform = {};
  if (transform) {
    if (axis === 'x') {
      activeTransform = {
        transform: `translate(${transform.substring(
          transform.indexOf('(') + 1,
          transform.indexOf(',')
        )}, 0)`,
      };
    } else if (axis === 'y') {
      activeTransform = {
        transform: `translate(0, ${transform.substring(
          transform.indexOf(',') + 1,
          transform.indexOf(')')
        )})`,
      };
    }
  }
  return {
    ...draggableStyle,
    ...activeTransform,
  };
};
