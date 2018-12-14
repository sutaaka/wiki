const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();


  const getCategory = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT category_id AS id FROM category_page WHERE cl_type = "subcat";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const promisedQuery = (word) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT page_title AS child FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "subcat" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

async function main(){
    const results = await getSubcat()




console.log('end')
}



main()