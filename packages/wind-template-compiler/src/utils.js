import { NODE_TYPE } from './parser';

export function parseStartTag(html = '') {
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  const startTagClose = /^\s*(\/?)>/;
  const ncname = '[a-zA-Z_][\\w\\-\\.]*';
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);

  const result = {
    startTagMatch: null, // 将开始标签的标签名 、 属性转换成 js 对象形式
    htmlRest: html, // 解析完成后，剩余的 html 字符串
  };

  const start = html.match(startTagOpen);
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
    };
    html = advance(html, start[0].length);
    let end, attr;
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(attribute))
    ) {
      match.attrs.push({
        name: attr[1],
        value: attr[3] || attr[4] || attr[5], //单双引号 和 没有引号的情况
      });
      html = advance(html, attr[0].length);
    }
    if (end) {
      // 如果解析到 > 或者 自闭和标签 />
      html = advance(html, end[0].length);
      result.startTagMatch = match;
      result.htmlRest = html;
    }
  }

  return result;
}

export function advance(html, length) {
  return html.substring(length);
}

export function createASTElement(tagName, attrs, children = []) {
  return {
    tagName,
    attrs,
    children,
    type: NODE_TYPE.element,
  };
}

export function parseMustacheString(text) {
  // 解析含有 Mustache 的字符串 类似  测试{{a}} {{b}} => _v('测试'+_s(a)+" "+_s(b))
  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  let match,
    index,
    lastIndex = (defaultTagRE.lastIndex = 0),
    textArr = [];

  while ((match = defaultTagRE.exec(text))) {
    index = match.index;
    if (index > lastIndex) {
      textArr.push(JSON.stringify(text.slice(lastIndex, index)));
    }
    textArr.push(`_s(${match[1].trim()})`);
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    textArr.push(JSON.stringify(text.slice(lastIndex)));
  }
  return `_v(${textArr.join('+')})`;
}
