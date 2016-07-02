$(document).ready(function() {
  var $items = $(".zoom-list li");
  $items.on("mouseover", function() {
    $(this).addClass("zoomin");
  });
  $items.on("mouseout", function() {
    $(this).removeClass("zoomin");
  });
});
