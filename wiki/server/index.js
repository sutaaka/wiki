const Koa = require('koa')
const Router = require('koa-router')
const koaBody = require('koa-body')
const mysql = require('mysql')
const fs = require('fs')

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
  dipto = []
  for(i=0;i<word.length;i++){
    console.log('yayyayyay!')
    //全カテゴリ取得
    results = await getAllCategory(word[i])
    console.log('results')
    // console.log(results[0].child.toString('utf-8'))
    // for(k=0;k<results.length;k++){

    // }
    //子カテゴリの名前保存
    childs = results.map(result => {return result.child})
    console.log(childs.length)
    // console.log('childs')
    // console.log(childs)
    //小カテゴリ名の重複削除
    child = childs.filter(function (x, i, self) {
      return self.indexOf(x) === i;
    });

    pages = []
    //小カテゴリのページ取得
    for(m=0;m<child.length;m++){
      page = await promisedQuery(child[m],'page')
      pages.push(page)
    }

    //小カテゴリページの一次元化
    var list = [];
    for(var p=0;p<pages.length;p=p+1){
      for(var q=0;q<pages[p].length;q=q+1){
        list.push(pages[p][q].url);
      }
    }

    //小カテゴリページの重複削除
    var dip = list.filter(function (x, i, self) {
      return self.indexOf(x) === i;
  });

    console.log('b')
    // console.log(b)
    dipto = dipto.concat(dip)
    console.log(dipto)
    if(i>0){
      dipto = dipto.filter(function (x, i, self) {
        return self.indexOf(x) === i && i !== self.lastIndexOf(x);
    })
    }
  }

  //小カテゴリページの一次元化
//   list = []
//   for(var i=0;i<ws.length;i=i+1){
//     for(var j=0;j<ws[i].length;j=j+1){
//       list.push(ws[i][j]);
//     }
//   }

//   //小カテゴリページの重複取り出し
//   var dipto = list.filter(function (x, i, self) {
//     return self.indexOf(x) === i && i !== self.lastIndexOf(x);
// });
  // var dipto = list.filter(function (x, i, self) {
    // return self.indexOf(x) !== self.lastIndexOf(x);
  // });
  console.log('dipto')
  console.log(dipto)


  // console.log('ws')
  // console.log(ws)

  // for(i=0;i<ws.length;i++){
    // for(j=0;j<ws[i].length;j++){
      // console.log(ws[i][j])
      // results = await promisedQuery(ws[i][j],'page')
      // console.log('child')
      //console.log(results)
      // xs.push(results)
    // }
  // }
  // console.log('xs')
  //console.log(xs)
  // var list = [];
  // for(var i=0;i<xs.length;i=i+1){
    // for(var j=0;j<xs[i].length;j=j+1){
      // list.push(xs[i][j].url);
    // }
  // }
  // console.log('list')
  // console.log(list)


  // var c = list.filter(function (x, i, self) {
  //   return self.indexOf(x) !== self.lastIndexOf(x);
  // });

  // console.log('c')
  // console.log(c)

  // var d = c.filter(function (x, i, self) {
    // return self.indexOf(x) === i;
// });

  const e = []
  for(i=0;i<dipto.length;i++){
    console.log(i)
    page_name = await pageid(dipto[i])
    // console.log(page_name[0].pt.toString('utf-8'))
    e.push({page:{
      name: page_name[0].pt.toString('utf-8'),
      url: `https://ja.wikipedia.org/?curid=${dipto[i]}`
    }})
  }
  // c.map(async dd =>{
    // page_name = await pageid(dd)
    // return {page: {
      // name: page_name
      //url: `https://ja.wikipedia.org/?curid=${result.url}`
    // }
    // }
  // })

  return e
}

const cache = (json,word) => {
  if(word.length > 1){
    for(i=0;i<json.length;i++){
      match = 0
      for(j=0;j<json[i].selects.name.length;j++){
        for(k=0;k<word.length;k++){
          if(json[i].selects.name[j]===word[k]){
            match++
          }
        }
      }
      if(match === word.length){
        return json[i].selects.results
      }
    }
    return false
  }
}


const pageid = (id) =>{ return new Promise((resolve, reject) => {
  connection.query(`SELECT page_title AS pt FROM wiki.page WHERE page_id = ${id};`, function (error, results, fields) {
      if (error) reject(error)
      resolve(results)
})
})
}

const getAllCategory = (word) => { return new Promise((resolve, reject) => {
  connection.query(`SELECT child_name AS child FROM topic_la WHERE parent_name = "${word}";`, function (error, results, fields) {
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
    data = []
    const { word } = ctx.request.body
    results = await getCategory(word)
    console.log(results)
    data = results.map(result => result.category.name)
    // for(let i=0; i<3; i++){
      // data[i] = results[i].category.name
    // }
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
    const startTime = Date.now(); // 開始時間
    const json = JSON.parse(fs.readFileSync('cache.json', 'utf8'))
    // console.log(json[0])
    const { word } = ctx.request.body
    console.log('word')
    // console.log(word)
    if(word.length > 1){
      const results = cache(json,word)
      if(results){
        ctx.body = results
      }
      else{
          body = await get(word)
          console.log('len')
          console.log(body.length)
          if(body.length>0){
          if(json.length>9){
            json.shift()
            json.push({selects : {
              name : word,
              results : body
            }})
          }
          else{
            json.push({selects : {
              name : word,
              results : body
            }})
          }
          fs.writeFile('cache.json', JSON.stringify(json),function(err, result) {
            if(err) console.log('error', err);
          });
          ctx.body = body
        }
        else{
          ctx.body = [{page:{
            name: 'No results'
          }}]
        }
      }
    }
    else{
      ctx.body = [{page:{
        name: 'No results'
      }}]
    }
    console.log("ctx.body")
    console.log(ctx.body)
    const endTime = Date.now(); // 終了時間
    console.log('time')
    console.log((endTime - startTime)/1000 + ' 秒')
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
