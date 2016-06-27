var fs = require('fs');
var Handlebars = require('handlebars');
var sass = require('node-sass');

var language = 'en';

function render(resume) {

  var css = sass.renderSync({
    file: __dirname + '/style.scss'
  }).css;

  var template = Handlebars.compile(fs.readFileSync(__dirname + '/resume.hbs', 'utf-8'));

  if(resume.basics && resume.basics.location && resume.basics.location.countryCode) {
    if(resume.basics.location.countryCode === 'NO') {
      language = 'no';
    }
  }

  var translation = require(__dirname + '/i18n/' + language + '.json');

  function format_date(date_string) {
    var date = new Date(date_string);

    if (!date.getFullYear() || !date_string)
      return date_string;

    var stuff = date_string.split('-');
    var output = '';

    if(stuff[1] && stuff[1] !== '')
      output += translation.months[date.getMonth()] + ' ';

    return output + date.getFullYear();
  }

  Handlebars.registerHelper('get_network_class', function (network) {
    return network.toLowerCase().replace(' ', '-');
  });

  Handlebars.registerHelper('get_pretty_location', function (data) {
    var region = data.region;
    var countryCode = data.countryCode;
    
    var out = '';

    if(region && region !== '') {
      out += region + ', ';
    }

    if(countryCode && countryCode !== '') {
      out += countryCode;
    }

    return out === '' ? false : out;
  });

  Handlebars.registerHelper('if_new_row', function (index, options) {
    if(index % 3 === 0) {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper('if_end_row', function (index, options) {
    if(index % 3 === 2) {
      return options.fn(this);
    }
  });

  Handlebars.registerHelper('get_work_date', function (work) {
    var date = "";

    if (work.startDate)
      date += format_date(work.startDate);

    if (work.endDate) {
      date += " &ndash; ";
      date += format_date(work.endDate);
    } else {
      date = translation.since + " " + date;
    }

    return date;
  });

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
