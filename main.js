$( document ).ready(function() {
  $("#convert").click(function() {
    var xml_raw = $("#xml").val();
    if (xml_raw.length > 0) {
      var output = "";
      var xml_doc = $.parseXML(xml_raw);
      var cascade = $(xml_doc).find("haarcascade");
      $(cascade).find("stages").children().each(function () {
        output += readStage($(this)) + ",";
      });
      output = output.slice(0,-1); // Removes last comma

      var size = $(cascade).find("size").text().trim().split(" ");
      output += "],size:[" + size[0] + "," + size[1] + "],tilted:true}";
      $("#jsfeat").val(output);
    }
  });
});

function readStage($stage) {
  var output = "{complexClassifiers:[";

  $stage.find("trees").children().each(function () {
    output += readTree($(this)) + ",";
  });
  output = output.slice(0,-1); // Removes last comma

  output += "],threshold:" + $stage.find("stage_threshold").text() + "}";
  return output;
};

function readTree($tree) {
  var output = "{simpleClassifiers:[";

  $tree.children().each(function () {
    output += readNode($(this)) + ",";
  });
  output = output.slice(0,-1); // Removes last comma

  return output;
};

function readNode($node) {
  var output = "{features:[";

  $node.find("feature").find("rects").children().each(function () {
    output += "[" + $(this).text().trim().replace(" ", ",") + "]";
  });
  output += "]"
  output += ",tilted:" + $node.find("tilted").text();
  var left = $node.find("left_val");
  if (left.length > 0) { output += ",left_val:" + left.text(); }
  var right = $node.find("right_val");
  if (right.length > 0) { output += ",right_val:" + right.text(); }
  output += ",threshold:" + $node.find("threshold").text() + "}";
  return output;
};
