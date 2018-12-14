const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

  connection.connect();

  //idを入力すると名前が得られる
  const category = (number) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT page_title AS na FROM page WHERE page_id = ${number};`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const promisedQuery = (word,type) =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT page_title AS child FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

//親の名前と子のidが取得できる
const getSubcat = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_from AS id, cl_to AS name FROM categorylinks WHERE cl_type = "subcat";`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})

}

const test = () =>{ return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM category_relation;`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  }
  )
})
}

const insertRelation = (parentName, childName, childId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_relation(parent_name, child_name, child_id) VALUES ('${parentName}', '${childName}', ${childId});`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

const insertRelation2 = (parentName, childName, childId) =>{ return new Promise((resolve, reject) => {
    connection.query(`INSERT INTO wiki.category_relation(parent_name, child_name, child_id) VALUES ("${parentName}", "${childName}", ${childId});`, function (error, results, fields) {
        if (error) reject(error)
        resolve(results)
  })
})
}

async function asyncMap(results, operation) {
    return Promise.all(results.map(async result => await operation(result.name, 'subcat')))
}




//データベースに親子関係をテキストで保存する





async function main(){

    //const results = await test()

    //i = 0
    //results.forEach(element => {
    //    console.log(element.parent_name.toString('utf-8'))
    //    console.log(element.child_name.toString('utf-8'))
    //    console.log(element.child_id)
    //    i++
    //});

    //console.log(i)


    //親の名前と子のidが取得できる
    //const results = await getSubcat()

    //console.log(results[167815])
    j = 0
    for(i=0; i<results.length; i++){
        childName = await category(results[i].id)
        console.log('i ;   ' + i + '   j ;   ' + j)
        if(childName.length>0){
            j++
        if ((childName[0].na.toString('utf-8')).indexOf("'") != -1) {
            console.log('iR2')
            console.log('parent ;  ' + results[i].name.toString('utf-8'))
            console.log('child ;  ' + childName[0].na.toString('utf-8'))
            e = await insertRelation2(results[i].name, childName[0].na, results[i].id)
            }
            else if((results[i].name.toString('utf-8')).indexOf("'") != -1){
                console.log('iR2')
                console.log('parent ;  ' + results[i].name.toString('utf-8'))
                console.log('child ;  ' + childName[0].na.toString('utf-8'))
                e = await insertRelation2(results[i].name, childName[0].na, results[i].id)
            }
            else{
                console.log('def')
                console.log('parent ;  ' + results[i].name.toString('utf-8'))
                console.log('child ;  ' + childName[0].na.toString('utf-8'))
                e = await insertRelation(results[i].name, childName[0].na, results[i].id)
            }
        }

    }




    //results.forEach(result => {
    //    console.log(result.id)
    //    console.log(result.name.toString('utf-8'))
    //});

    //console.log(results)

    //const cons = await category()
    //cons.forEach(con => {
    //    console.log('cat_id ;  ' + cons[0].cat_id)
    //    console.log('cat_title ;  ' + cons[0].cat_title.toString('utf-8'))
    //});

    //const js = await promisedQuery("学問", "subcat")
    //js.forEach(j => {
    //    console.log('child ;' + j.child.toString('utf-8'))
    //    console.log('childId ;' + j.childId)
    //    console.log('}')
    //});

    //const results = await test(1450112)
    //for(i=0; i<results.length; i++){
    //    console.log(results[i].name.toString('utf-8'))
    //    ids = await getId(results[i].name)
    //    console.log(ids)
    //}

    console.log('end')

}

main()
