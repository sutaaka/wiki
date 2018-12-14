const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();


  const getSubcat = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_from AS id FROM categorylinks WHERE cl_type = "subcat";`, function (error, results, fields) {
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

const insertCategory = (categoryName, categoryId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_id (category_id, category_name) VALUES ( ${categoryId},'${categoryName}');`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const insertCategory2 = (categoryName, categoryId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_id (category_id, category_name) VALUES ( ${categoryId},"${categoryName}");`, function (error, results, fields) {
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
    const results = await getSubcat()
    const categoryId = results.map(result => result.id
    );
    console.log(categoryId)

    console.log('yay!')
    categoryIdM = categoryId.filter(function (result, i, self) {
        //console.log(result)
        return self.indexOf(result) === i;
    });

    console.log('start')
    j = 0
    k = 0
    for(i=185703; i<categoryIdM.length ;i++){
        console.log(i)
        console.log(categoryIdM[i])
        categoryName = await category(categoryIdM[i])
        console.log(categoryName)

        if ((categoryName[0].na).indexOf("'") != -1) {
            j++
            e = await insertCategory2(categoryName[0].na, categoryIdM[i])
            console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
            console.log('22222222222222222222222222222')
            console.log('id ;  ' + categoryIdM[i])
            console.log('name ;  ' + categoryName[0].na)
        }
        else{
            k++
            e = await insertCategory(categoryName[0].na, categoryIdM[i])
            console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
            console.log('def')
            console.log('id ;  ' + categoryIdM[i])
            console.log('name ;  ' + categoryName[0].na)
        }
}


    //console.log(b)
    //console.log(b.length)

    //if(results.length>1){
    //results.forEach(result => {
    //    console.log(result.parent_name.toString('utf-8'))
    //});
    //console.log('end')
//}
console.log('end')
}



main()