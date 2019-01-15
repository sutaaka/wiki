const mysql = require('mysql')
const fs = require('fs');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();


  function appendFile(path, data) {
    fs.appendFile(path, data, function (err) {
      if (err) {
          throw err;
      }
    });
  }


  const getSub = (word,type) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

  const get = (word,type) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = '${word}';`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const cl = {
    recursion: function(wordArray, indexs) {

        const results = await getSub(wordArray,"subcat");
        console.log("word  " + wordArray)
        console.log('index  ' + indexs)
        wordArray.push("学問")
        this.recursion(wordArray,indexs)
    }
}

async function main(){
    const indexs = [0];
    const wordArray = [['主要カテゴリ']];


    cl.recursion(wordArray,indexs);



console.log('end')
}



main()