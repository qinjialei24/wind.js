import { NODE_TYPE } from './parser';
import { parseMustacheString } from './utils';

function generateAttrs(attrs) {
  let attrsString = '';

  attrs.forEach((attr) => {
    if (attr.name === 'style') {
      const styleObj = {};
      attr.value.split(';').forEach((item) => {
        const [name, value] = item.split(':');
        styleObj[name] = value;
      });
      attr.value = styleObj;
    }
    attrsString += `${attr.name}:${JSON.stringify(attr.value)},`;
  });
  return `{${attrsString.slice(0, -1)}}`;
}

function generateChild(childAst) {
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  if (childAst.type === NODE_TYPE.element) {
    const res = generate(childAst);
    return res;
  } else if (childAst.type === NODE_TYPE.text) {
    let text = childAst.text;
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`;
    } else {
      return parseMustacheString(text);
    }
  }
}

export function generateChildren(children = []) {
  return children.map((i) => generateChild(i)).join(',');
}

function generate(ast = '') {
  let code = `_c(
    '${ast.tagName}',
    ${ast.attrs.length > 0 ? generateAttrs(ast.attrs) : undefined},
    ${ast.children ? generateChildren(ast.children) : ''})`;
  return code;
}

export default generate;
