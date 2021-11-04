export const flattenArr = (arr) => {
  return arr.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {});
}

export const objToArr = (obj) => {
  return Object.keys(obj).map(key => obj[key]);
}

export const getParentNode = (node, parentClassName) => {
  let current = node;
  while(!!current) {
    if (current.classList.contains(parentClassName)) {
      return current;
    }
    current = current.parentNode;
  }
  return false;
}

export const timestampToString = (timestamp) => {
  const data = new Date(timestamp);
  return data.toLocaleDateString() + ' ' + data.toLocaleTimeString();
}