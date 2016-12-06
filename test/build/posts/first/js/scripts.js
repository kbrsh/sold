var elem = document.getElementById("post").textContent;

/* calculate read time */
var readTime = function( elem ) {
  var wpm = 200,                      // words per minute the average person reads
      count = elem.split(' ').length; // get word count from specified element
  return Math.ceil( count/wpm );      // return number of minutes
};

document.getElementById("readTime").innerHTML = readTime(elem);
twemoji.size = "16x16"
twemoji.parse(document.body);

function humanizeDate (date) {
  var elapsed = Math.round((+new Date - date.getTime()) / 1000)

  var minute = 60
  var hour = minute * 60
  var day = hour * 24
  var week = day * 7
  var month = day * 30
  var year = month * 12

  if (elapsed < 60) return 'Just now.'
  else if (elapsed < 2 * minute) return 'A minute ago'
  else if (elapsed < hour) return Math.floor(elapsed / minute) + ' minutes ago'
  else if (elapsed < 24 * hour) {
    elapsed = Math.floor(elapsed / hour)
    if (elapsed === 1) return elapsed + ' hour ago'
    else return elapsed + ' hours ago'
  }
  else if (elapsed < month) return Math.floor(elapsed / day) + ' days ago'
  else if (elapsed < year) return Math.floor(elapsed / month) + ' months ago'
  else if (elapsed >= year) {
    elapsed = Math.floor(elapsed / year)
    if (elapsed === 1) return 'A year ago'
    else return elapsed + ' years ago'
  }
  else return false
}

var metaDate = new Date(document.head.querySelector('[name="date"]').content)

document.getElementById('humanDate').innerHTML = humanizeDate(metaDate) ? humanizeDate(metaDate) : ""