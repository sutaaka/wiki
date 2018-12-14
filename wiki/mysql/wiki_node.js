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

//const insert = (categoryName, pageId, degree) =>{ return new Promise((resolve, reject) => {
//    connection.query(`INSERT INTO wiki.node_data (category_name, page_id, degree) VALUES ( "${categoryName}", ${pageId}, ${degree});`, function (error, results, fields) {
//        if (error) reject(error)
//        resolve(results)
//  })
//})
//}

//async function asyncMap(pages, parentName,degree, operation) {
//    return Promise.all(pages.map(async page => await operation(parentName, page.pageId, degree)))
//}

//再帰関数
const recursion = async (wordArray,index)　=>{
    appendFile("test.txt", "++++++++++++++++++++++++++++++++++++++++call++++++++++++++++++++++++++++++++++++++++++++++\n");

    const newIndex = index.concat();
    const newWordArray = wordArray.concat();

    //最後尾（現在処理）の配列の長さ分ループ
    for(i=0; i<wordArray[(wordArray.length - 1)].length; i++){
        appendFile("test.txt", "\nLoop\n\n\ni =" + i +"\n\n\nwordArray\n" + index + "\n" + wordArray + "\n\n");

        //配列[i]のサブカテゴリ取得
        const results = await getSub(wordArray[wordArray.length - 1][i],"subcat");
        //console.log(results)

        //サブカテゴリがない場合
        if(results.length < 1){
            appendFile("test.txt", "\npage\n");
            console.log('page');
            //配列[i]のサブページ取得
            const pages = await getSub(wordArray[wordArray.length - 1][i],"page");

            //サブページが存在する場合
            if(pages.length > 0){
                //word配列を後ろからループ
                for(j=(wordArray.length - 1); j>-1; j--){
                    //word配列の長さからjを引いて親等を計算
                    const degree = (wordArray.length -1) - j;
                    appendFile("test.txt", "degree" + degree + "\n" + wordArray[j][index[j]] + "\n");
                    //ページ情報を保存
                    //const e = await asyncMap(pages,wordArray[j][index[j]] ,degree ,insert)
                }

                //現在の要素（カテゴリ番号）を +1 して次のサブカテゴリへ
                index[(index.length - 1)]++;

                //次のサブカテゴリがある場合
                if((wordArray[(wordArray.length - 1)][index[(index.length - 1)]])){
                }
                //次のサブカテゴリがない場合
                else{
                    return wordArray
                }
            }
        }
        else{
            appendFile("test.txt", "\ncategory_aru\n\n");
            //カテゴリ名リストを作成
            const categoryNames = [];//results.map(result => result.childName.toString('utf-8'))
            for(c=0; c<results.length; c++){
                categoryNames.push(results[c].childName.toString('utf-8'));
            }

            //word配列の最後尾にカテゴリ名リストを挿入
            newWordArray.push(categoryNames);
            //index配列の最後尾に、要素番号[0]を挿入
            newIndex.push(0);
            appendFile("test.txt", "\nnewWordArray\n" + newIndex + '\n' + newWordArray + "\n\n");

            //再帰関数呼び出し
            await recursion(newWordArray, newIndex);

            //appendFile("test.txt","\noldWordArray\n" + a +"\n\n");
            appendFile("test.txt","-------------------------------------called---------------------------------------------------------\n");

            //再帰関数が終われば現在の要素を+1する
            index[(index.length - 1)]++;
            console.log('index' + index);
        }

    }

}

async function main(){
    const index = [0];
    const wordArray = [['主要カテゴリ']];


    //const results = await promisedQuery("主要カテゴリ")

    recursion(wordArray,index);

//    const test = index.concat('b')
    //wordArray.concat([0])

    //console.log(index)
    //console.log(wordArray)
    //console.log(test)



    //console.log('start')
    //j = 0
    //k = 0
    //for(i=18804; i<results.length ;i++){
    //    console.log(i)


    //    if ((results[i].name.toString('utf-8')).indexOf("'") != -1) {
    //        pageIds = await promisedQuery(results[i].name)
    //    }else{pageIds = await promisedQuery2(results[i].name)}

    //    if(pageIds.length > 0){
    //        if ((results[i].name.toString('utf-8')).indexOf("'") != -1) {
    //            for(p=0; p<pageIds.length; p++){
    //                j++
    //                e = await insertCategory2(results[i].id, results[i].name, pageIds[p].pageId)
    //                console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
    //                console.log('22222222222222222222222222222')
    //                console.log('id ;  ' + results[i].id)
    //                console.log('name ;  ' + results[i].name.toString('utf-8'))
    //                console.log('page ;  ' + pageIds[p].pageId)
    //            }
    //        }
    //        else{
    //           for(p=0; p<pageIds.length; p++){
    //                j++
    //                e = await insertCategory(results[i].id, results[i].name, pageIds[p].pageId)
    //                console.log('i ;  ' + i + '  j ;   ' + j + '  k ;   ' + k)
    //                console.log('def')
    //                console.log('id ;  ' + results[i].id)
    //                console.log('name ;  ' + results[i].name.toString('utf-8'))
    //                console.log('page ;  ' + pageIds[p].pageId)
    //            }
    //        }
    //    }else{k++}
    //}


console.log('end')
}



main()