const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

connection.connect();

connection.query(`SELECT cl_to AS parent, page_title AS child FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "page" AND categorylinks.cl_to = "学問";`, function (error, results, fields) {
    if (error) console.log(error)
    results.forEach(result => {
        console.log(result.parent.toString('utf-8'))
        console.log(result.child.toString('utf-8'))
    });
})
