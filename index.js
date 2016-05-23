var fs = require('fs');
var Handlebars = require('handlebars');
var sass = require('node-sass');

var language = 'no';

function render(resume) {

  var css = sass.renderSync({
    file: __dirname + './style.scss'
  }).css;

  var template = Handlebars.compile(fs.readFileSync('./resume.hbs', 'utf-8'));
  var translation = JSON.parse(fs.readFileSync('./i18n/' + language + '.json', 'utf-8'));

  return template({
    css: '<style>' + css + '</style>',
    resume: resume,
    t: translation,
    language: language
  });
}

module.exports = {
  render: render
};
