export default {
    semi: true, // 每行結尾加分號
    singleQuote: true, // 使用單引號
    quoteProps: 'as-needed', // 需要時才加引號
    useTabs: false, // 使用空格縮排
    tabWidth: 2, // 縮排寬度
    trailingComma: 'es5', // 尾逗號（ES5 格式）
    printWidth: 80, // 每行最大寬度
    endOfLine: 'lf', // 行結尾符號 LF
    arrowParens: 'always', // 箭頭函式參數加括號
    bracketSpacing: true, // 大括號內側空格
    embeddedLanguageFormatting: 'auto', // 自動格式化嵌入語言
    plugins: [
      'prettier-plugin-organize-imports', // 整理 import
      'prettier-plugin-packagejson', // package.json 排序
      'prettier-plugin-organize-attributes', // HTML 屬性排序
    ],
    htmlWhitespaceSensitivity: 'ignore', // 忽略 HTML 空白敏感性
    vueIndentScriptAndStyle: true, // 縮排 Vue <script> 和 <style>
    attributeGroups: [
      '^v-if$',
      '^v-else$',
      '^v-else-if$',
      '^v-for$',
      '^v-show$',
      '^(?::)?id$',
      '^(?::)?ref',
      '^(?::)?key',
      '^v-(?!loading$!if$!else$!else-if$!for$)',
      '^v-loading$',
      '^v-slot$',
      '^v-model$',
      '^(?::)?model',
      '^(?::)?class$',
      '^(?::)?name$',
      '^(?::)?label$',
      '^(?::)?lang$',
      '^(?::)?src$',
      '^(?::)?type$',
      '^(?::)?href$',
      '^(?::)?value$',
      '^(?::)?title$',
      '^(?::)?alt$',
      '^(?::)?placeholder$',
      '$DEFAULT',
      '^(?::)?disabled$',
      '^(?::)?loading$',
      '^(?::)?src$',
      '^@',
    ],
    attributeSort: 'ASC', // 屬性排序（升序）
}
