/**
 * 需求理解
 * 实现字符串模板引擎
 *
 * 核心功能要求：
 * 1. 支持数据插值：能够将模板中的变量占位符替换为数据对象中对应的值。
 *    - 语法：`<%= expression %>`，其中 `expression` 是一个可以求值的 JavaScript 表达式。
 * 2. 支持逻辑嵌入：能够在模板中嵌入 JavaScript 逻辑代码，如条件判断、循环等。
 *    - 语法：`<% logic %>`，其中 `logic` 是任意的 JavaScript 代码段。
 * 3. 数据访问：在模板的逻辑和表达式中，能够直接访问传入的数据对象的属性。
 */
class TemplateEngine {
  constructor(str) {
    this.str = str
  }
  render(obj) {
    const matcher = /<%=([\s\S]+?)%>|<%([\s\S]+?)%>/g;
    let code = 'var res = [];\n'
    code += 'with(obj) {\n'
    let index = 0
    let match
    while (match = matcher.exec(this.str)) {
      const firstCode = this.str.slice(index, match.index).replace(/'/g, "\\'").replace(/\n/g, "\\n")
      code += `res.push('${firstCode}');\n`
      if (match[1]) {
        code += `res.push(${match[1]});\n`
      } else if (match[2]) {
        code += `${match[2]};\n`
      }
      index = match.index + match[0].length
    }
    const lastCode = this.str.slice(index).replace(/'/g, "\\'").replace(/\n/g, "\\n")
    code += `res.push('${lastCode}');\n`
    code += '}\n'
    code += 'return res.join(\'\');\n'
    try {
      const func = new Function('obj', code)
      return func(obj)
    } catch (error) {
      throw new Error('模板解析错误')
    }
  }
}

const str = `
<ul>
  <% if (obj.show) { %>
    <% for (var i = 0; i < obj.users.length; i++) { %>
      <li>
        <a href="<%= obj.users[i].url %>">
          <%= obj.users[i].name %>
        </a>
      </li>
    <% } %>
  <% } else { %>
    <p>不展示列表</p>
  <% } %>
</ul>
`
const obj = {
  show: true,
  users: [
    {
      name: '张三',
      url: 'https://www.baidu.com'
    },
    {
      name: '李四',
      url: 'https://www.baidu.com'
    }
  ]
}

const templateEngine = new TemplateEngine(str)
const html = templateEngine.render(obj)
console.log(html);
