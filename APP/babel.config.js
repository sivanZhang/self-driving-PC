/* module.exports = {
  presets: [
    '@vue/app'
  ]
} */
const presets = [
    '@vue/app'
];
const plugins = [
    [
        "import", {
            "libraryName": "iview",
            "libraryDirectory": "src/components"
        }
    ]
];
module.exports = {
    presets,
    plugins
}