import { parseStartTag, advance, parseMustacheString } from '../src/utils';

describe('parseStartTag', () => {
  test('should return match object', () => {
    const input = '<div id="test" style="color:red;display:none"></div>';
    expect(parseStartTag(input)).toEqual({
      htmlRest: '</div>',
      startTagMatch: {
        tagName: 'div',
        attrs: [
          { name: 'id', value: 'test' },
          { name: 'style', value: 'color:red;display:none' },
        ],
      },
    });
  });
});

describe('advance', () => {
  test('should delete string 1', () => {
    expect(advance('1234', 1)).toBe('234');
  });
});

describe('parseMustacheString', () => {
  test('只包含变量', () => {
    const input = `{{demo}}`;
    const res = `_v(_s(demo))`;
    expect(parseMustacheString(input)).toBe(res);
  });

  test('包含变量和文本', () => {
    const input = `你好{{demo}}{{demo2}}`;
    const res = `_v("你好"+_s(demo)+_s(demo2))`;
    expect(parseMustacheString(input)).toBe(res);
  });

  test('包含变量和文本、空格', () => {
    const input = `你好 {{demo}} {{demo2}}`;
    const res = `_v("你好 "+_s(demo)+" "+_s(demo2))`;
    expect(parseMustacheString(input)).toBe(res);
  });
});
