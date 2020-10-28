import generate from './generate';
import parser from './parser';

const html = `<div class="div" id="app" style="color:red;font-size:18px">
  hello,world{{data}} xxx {{demo}}
  <p id='xx'>测试</p>
</div>`;

const ast = parser(html);
const code = generate(ast);
