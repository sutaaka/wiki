const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const mysql = require('mysql')

const app = new Koa()
const router = new Router()

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'wiki'
  });

connection.connect();
const promisedQuery = (word,type) =>{ return new Promise((resolve, reject) => {
        connection.query(`SELECT cl_to AS parent, page_title AS child FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
            if (error) reject(error)
            resolve(results)
      })
  })
}

async function getSubcategory(word){
const subcatResults = []
const results = await promisedQuery(word,'subcat')

for(let i=0; i<results.length; i++){
  subcatResults[i] = await promisedQuery(results[i].child.toString('utf-8'),'subcat')
}
//console.log(subcatResults[0])

  const parents = results.map(result => result.child.toString('utf-8'))

  const data = parents.map(parent =>{
      return {parent: {
        name: parent,
        child: []
      }
    }
  })

  for(let i=0; i<results.length; i++){
    for(let j=0; j<subcatResults[i].length; j++){
      if(data[i].parent.name === subcatResults[i][j].parent.toString('utf-8')){
        data[i].parent.child.push(subcatResults[i][j].child.toString('utf-8'))
      }
    }
  }

    return data
}

//getSubcategory('学問')
router
  .get('/', async (ctx, next) => {
    ctx.body = await getSubcategory('主要カテゴリ')
    console.log(ctx.body)
    return next()
  })
  .post('/', async (ctx, next) => {
    const { word } = ctx.request.body

    ctx.body = await getSubcategory(word)
    ctx.status = 201
  })



app
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    // ctx.set('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS');
    return next()
  })
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001, () => console.log('listen'))
