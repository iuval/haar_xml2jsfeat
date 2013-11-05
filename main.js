$( document ).ready(function() {
  $("input:file").on("change", function(evt){
    var files = evt.target.files; // FileList object
    if (!files.length) {
      alert('Please select a file!');
      return;
    }

    var file = files[0];
    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        var text = readXML($.parseXML(evt.target.result));
        var pom = document.createElement('a');
        pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        pom.setAttribute('download', files[0].name + ".jsfeat");
        pom.click();
      }
    };

    reader.readAsBinaryString(file);
  });
});

function readXML(xml_doc) {
  var output = "";

  var cascade = $(xml_doc).find("haarcascade");
  $(cascade).find("stages").children().each(function () {
    output += readStage($(this)) + ",";
  });
  output = output.slice(0,-1); // Removes last comma

  var size = $(cascade).find("size").text().trim().split(" ");
  output += "],size:[" + size[0] + "," + size[1] + "],tilted:true}";

  return output;
}

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
    output += "[" + $(this).text().trim().replace(" ", ",") + "],";
  });
  output = output.slice(0,-1); // Removes last comma
  output += "]"
  output += ",tilted:" + $node.find("tilted").text();
  var left = $node.find("left_val");
  if (left.length > 0) { output += ",left_val:" + left.text(); }
  var right = $node.find("right_val");
  if (right.length > 0) { output += ",right_val:" + right.text(); }
  output += ",threshold:" + $node.find("threshold").text() + "}";
  return output;
};
