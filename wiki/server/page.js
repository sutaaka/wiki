const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();


  const promisedQuery = (word) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "page" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const promisedQuery2 = (word) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "page" AND categorylinks.cl_to = '${word}';`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

  const getCategory = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT category_id AS id, category_name AS name FROM category_id;`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const category = (number) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT page_title AS na FROM page WHERE page_id = ${number};`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const insertCategory = (categoryId, categoryName, pageId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_page (category_id, category_name, subpage_id) VALUES ( ${categoryId},'${categoryName}', ${pageId});`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}


const insertCategory2 = (categoryId, categoryName, pageId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_page (category_id, category_name, subpage_id) VALUES ( ${categoryId},"${categoryName}", ${pageId});`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

  const test = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM wiki.category_relation WHERE child_name = "教育工学者";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  }
  )
})
}


async function main(){
    //const results = await getCategory()

    console.log('start')
    j = 0
    k = 0
    for(i=18804; i<results.length ;i++){
        console.log(i)


        if ((results[i].name.toString('utf-8')).indexOf("'") != -1) {
            pageIds = await promisedQuery(results[i].name)
        }else{pageIds = await promisedQuery2(results[i].name)}

        if(pageIds.length > 0){
            if ((results[i].name.toString('utf-8')).indexOf("'") != -1) {
                for(p=0; p<pageIds.length; p++){
                    j++
                    e = await insertCategory2(results[i].id, results[i].name, pageIds[p].pageId)
                    console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
                    console.log('22222222222222222222222222222')
                    console.log('id ;  ' + results[i].id)
                    console.log('name ;  ' + results[i].name.toString('utf-8'))
                    console.log('page ;  ' + pageIds[p].pageId)
                }
            }
            else{
               for(p=0; p<pageIds.length; p++){
                    j++
                    e = await insertCategory(results[i].id, results[i].name, pageIds[p].pageId)
                    console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
                    console.log('def')
                    console.log('id ;  ' + results[i].id)
                    console.log('name ;  ' + results[i].name.toString('utf-8'))
                    console.log('page ;  ' + pageIds[p].pageId)
                }
            }
        }else{k++}
    }


console.log('end')
}



main()