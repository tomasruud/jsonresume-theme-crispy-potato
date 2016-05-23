var fs = require("fs");
var Handlebars = require("handlebars");
var sass = require('node-sass');

function render(resume) {

  var css = sass.renderSync({
    file: './style/crispy-potato.scss'
  }).css;

  var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

  return Handlebars.compile(tpl)({
    css: css,
    resume: resume
  });
}

module.exports = {
  render: render
};
