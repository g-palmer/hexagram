var tag;
var timeout;

var wait200 = function(fn, arg1, arg2) {
  timeout = window.setTimeout(fn, 200, arg1, arg2);
};

var handleSubmit = function(evt) {
  var hashtag;

  if (evt) {
    evt.preventDefault();
    hashtag = $(evt.target).data('tag');
  } else {
    hashtag = $('#hashtag').val();
    hashtag = hashtag.slice(1);
  }

  var url = '/' + hashtag;
  var rows = $('#rows').val();
  var pad = $('#pad').val();
  var bg1 = $('#bg1').val();
  var bg2 = $('#bg2').val();

  url += '?rows='+rows+'&pad='+pad+'&bg1='+bg1+'&bg2='+bg2;

  window.location = url;

  return false;
};

$(function() {
  var $hashtag = $('#hashtag');
  var $tagContainer = $('#hashtag-container');
  var $gear = $('#gear');
  var $superuser = $('#superuser');
  var $settings = $('#settings');
  var $spinner = $('#spinner');

  var getTags = function(hash, callback) {
    $spinner.show();
    $.ajax({
      url: '/api/tags/' + hash,
      success: function(response){
        $spinner.hide();
        callback.call(self, response.tags);
      },
      error: function(error) {
        console.error(error);
      }
    });
  };

  var renderTags = function(tags) {
    if ($hashtag.val()) {
      $tagContainer.empty();
      tags.forEach(function(tag) {
        var $p = $('<p class="tag">');
        var $link = $('<a>').attr('href', '/'+tag.name).text('#' + tag.name).data('tag', tag.name);
        $link.appendTo($p);
        $p.appendTo($tagContainer);
      });
    }
  };

  $hashtag.on('keyup', function() {
    var text = $hashtag.val();
    if (text.length && text.charAt(0) !== '#') {
      $hashtag.val('#'.concat(text));
    }
    if (text.length > 2) {
      window.clearTimeout(timeout);
      text = text.slice(1);
      wait200(getTags, text, renderTags);
    } else if (!text.length) {
      $tagContainer.empty();
      window.clearTimeout(timeout);
    }
  });

  $gear.on('click', function() {
    $superuser.toggleClass('show');
    $gear.toggleClass('dark');
    $settings.toggleClass('dark');
  });

  $tagContainer.on('click', 'a', handleSubmit);
});
