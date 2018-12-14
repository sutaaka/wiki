const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();


  const test = () =>{ return new Promise((resolve, reject) => {
    connection.query('SELECT category_id AS id FROM wiki.category_page;', function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  }
  )
})
}


async function main(){
    console.log('yay!')
    const results = await test()

    //results.forEach(result => {
    //    console.log(result.subpage_id)
    //});
    console.log(results.length)

    //if(results.length>1){
    //results.forEach(result => {
    //    console.log(result.parent_name.toString('utf-8'))
    //});
    console.log('end')
//}
}



main()