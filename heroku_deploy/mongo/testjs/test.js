
  var name_exercice = "comparaisonMatrice";
  var table_buffer = [];
  var folder = "assets/"+name_exercice;
  var nb_image = 0;

  nb_image = fs.readdir(folder, (err, files) => {
     files.length;
  });

  let n = 1;
  var fs = require('fs');

  while (n <= nb_image) {
    var buffer = fs.readFileSync(folder+n.toString());
    table_buffer.push(buffer);
    n++;
  }

