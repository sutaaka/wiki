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

async function get(word){
  console.log('getstart')
  console.log('length  ' + word.length)
  ws = []
  xs = []
  results = []
  for(i=0;i<word.length;i++){
    console.log('yayyayyay!')
    results = await getAllCategory(word[i])
    console.log('results')
    console.log(results[0].child)
    for(k=0;k<results.length;k++){

    }
    a = results.map(result => {return result.child})
    console.log('a')
    console.log(a)
    b = a.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });
    ws.push(b)
  }

  for(i=0;i<ws.length;i++){
    for(j=0;j<ws[i].length;j++){
      console.log(ws[i][j].child)
      results = await promisedQuery(ws[i][j].child,'page')
      xs.push(results)
    }
  }
  console.log('xs')
  console.log(xs)
  var list = [];
  for(var i=0;i<xs.length;i=i+1){
    for(var j=0;j<xs[i].length;j=j+1){
      list.push(data[i][j].url);
    }
  }
  console.log('list')
  console.log(list)


  var c = list.filter(function (x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });

  const d = c.map(dd =>{
    return {page: {
      name: dd
      //url: `https://ja.wikipedia.org/?curid=${result.url}`
    }
    }
  })

  return d
}

const getAllCategory = (word) => { return new Promise((resolve, reject) => {
  connection.query(`SELECT child_name AS child FROM degree WHERE parent_name = "${word}";`, function (error, results, fields) {
      if (error) reject(error)
      resolve(results)
  })
})
}

const promisedQuery = (word,type) =>{ return new Promise((resolve, reject) => {
        connection.query(`SELECT cl_to AS parent, page_title AS child, cl_from AS url FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "${type}" AND categorylinks.cl_to = "${word}";`, function (error, results, fields) {
            if (error) reject(error)
            resolve(results)
      })
  })
}

async function getPage(word){
  const results = await promisedQuery(word,'page')

  data = results.map(result =>{
    return {page: {
      name: result.child.toString('utf-8'),
      url: `https://ja.wikipedia.org/?curid=${result.url}`
    }
    }
  })

  return data
}

async function getAllPage(word){
  const results = await promisedQuery(word,'page')

  data = results.map(result =>{
    return {page: {
      name: result.child.toString('utf-8'),
      url: `https://ja.wikipedia.org/?curid=${result.url}`
    }
    }
  })

  return data
}

async function getCategory(word){
  const categoryResults = []
  const results = await promisedQuery(word,'subcat')

  for(let i=0; i<results.length; i++){
    categoryResults[i] = await promisedQuery(results[i].child.toString('utf-8'),'subcat')
  }

  const categories = results.map(result => result.child.toString('utf-8'))

  const data = categories.map(category =>{
    return {category: {
        name: category,
        category: []
      }
    }
  })

  for(let i=0; i<results.length; i++){
    for(let j=0; j<categoryResults[i].length; j++){
      if(data[i].category.name === categoryResults[i][j].parent.toString('utf-8')){
        data[i].category.category.push(categoryResults[i][j].child.toString('utf-8'))
      }
    }
  }

    return data
}

router
  .post('/category', async (ctx, next) => {
    const data = []
    const { word } = ctx.request.body
    results = await getCategory(word)
    console.log(results)
   //const data = results.map(result => result.category.name)
    for(let i=0; i<3; i++){
      data[i] = results[i].category.name
    }
    ctx.body = data
    console.log(ctx.body)
    ctx.status = 201
  })
  .post('/page', async (ctx, next) =>{
    const { word } = ctx.request.body
    ctx.body = await getPage(word)
    console.log(ctx.body)
    ctx.status = 201
  })
  .post('/search', async (ctx, next) =>{
    const { word } = ctx.request.body
    console.log('word')
    console.log(word)
    ctx.body = await get(word)
    console.log("ctx.body")
    console.log(ctx.body)
    ctx.status = 201
    console.log('end')
  })


app
  .use((ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,HEAD,OPTIONS');
    return next()
  })
  .use(koaBody())
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3001, () => console.log('listen'))
