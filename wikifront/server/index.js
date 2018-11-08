const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const mysql = require('mysql');
const util = require('util');


const app = new Koa()
const router = new Router()

//mysql接続
const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  database: 'wiki'
});

//サブカテゴリ取得
const promisedQuery = (word,type) => {return new Promise((resolve, reject) => {
    connection.query(`SELECT cl_to AS parent, page_title AS child FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = "${word}";`, function (err, results, fields) {
      if (err) {
        reject(err)
      }
      resolve(results)
    })
  })
}


//データ取得
const getSubcategory = (word) =>{return new Promise(async (resolve, reject) =>{
  console.log(word)
  const subcatResults = []

  //サブカテゴリ取得
  const results = await promisedQuery(word,"subcat")
  .catch(err => {
    console.error(err)
  })

  //サブサブカテゴリ取得
  for(let i=0; i<results.length; i++){
    subcatResults[i] = await promisedQuery(results[i].child.toString('utf-8'),"subcat")
  }

  //親設定
  const subcatParents = subcatResults.map(subcatResult => subcatResult[0].parent.toString('utf-8'))
  data = subcatParents.map(subcatParent =>{
      return {parent: {
        name: subcatParent,
        child: []
      }}
    })

  //子設定
  for(let i=0; i<subcatResults.length; i++){
    for(let j=0; j<subcatResults[i].length; j++){
      if(data[i].parent.name === subcatResults[i][j].parent.toString('utf-8')){
        data[i].parent.child.push(subcatResults[i][j].child.toString('utf-8'))
      }
    }
  }
  resolve(data)
  })

}

connection.connect();

router
  .get('/', async (ctx, next) => {
    ctx.body = await getSubcategory('主要カテゴリ')
    console.log(ctx.body)
    return next()
  })
  .post('/', async (ctx, next) => {
    const { word } = ctx.request.body
    ctx.body = await getSubcategory(word)
    console.log(ctx.body)
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





