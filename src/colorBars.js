
var github = new Github({
  username: "mikestaub",
  password: "umasslowell22",
  auth: "basic"
});
var repo = github.getRepo('angular', 'angular.js');

//https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
//https://raw.githubusercontent.com/michael/github/master/github.js

var colorBars = function(){
  var rows = {};

  var totalRows = $('.content span a').length;
  var count = 0;

  var addCSS = function(){
    var sorted = Object.keys(rows).sort(function(a,b){return rows[a]-rows[b]});
    var max = rows[sorted[sorted.length-1]]; // todo don't sort, reduce

    for(var key in rows){
      // ratio to file with largest linecount
      var pct = parseInt(rows[key] / max * 100);
      if(rows[key] === -1){ // is a dir
        pct = 0;
      }
      $("a[href$='"+key+"']").parent().parent().parent().find('.message').css("background", "linear-gradient(to right, #e6f1f6 "+pct+"%,#e6f1f6 "+pct+"%,#f8f8f8 "+pct+"%)");
      if(pct === 100){
        var count = "<span style='float: right;'>"+rows[key]+"</span>";
        $("a[href$='"+key+"']").parent().parent().parent().find('.message').append($.parseHTML(count));
      }
    }
  };

  $('.content span a').each(function(index, item){
    var fullPath = $(item).attr('href');
    var path = $(item).attr('href').split('/');
    path = path.slice(5, path.length).join('/');
    // todo dynamic branch
    repo.read("master", path, function(err, content){
      if(err){
        console.log('error', err);
      }
      var numLines = content.split("\n").length;
      // todo is this robust?
      if(content[0] === '['){
        rows[fullPath] = -1; // is a dir
      } else {
        rows[fullPath] = numLines;
      }

      if(++count === totalRows){
        addCSS();
      }
    });
  });
}
