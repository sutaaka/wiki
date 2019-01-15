import mysql.connector
import copy
import sys
sys.setrecursionlimit(10000)

conn = mysql.connector.connect(
    host = 'localhost',
    port = 3306,
    user = 'root',
    password ='',
    database = 'wiki',
)

cur = conn.cursor()

def recursion(wordArray,indexes):
    print('===========再帰関数開始')
    print('wordArray')
    print(wordArray)
    print('indexes')
    print(indexes)
    newIndex = copy.deepcopy(indexes)
    newWordArray = copy.deepcopy(wordArray)

    for i, item in enumerate(wordArray[(len(wordArray)-1)]):

        if duplication(newWordArray,newIndex,item):
            results = subcat(item)
            #indexes[len(indexes)-1] = i
            #newIndex[len(newIndex)] = i
            print(i)
            #サブカテゴリが存在する場合
            if len(results)>0:
                print('========サブカテゴリが存在する')
                newWordArray.append(results)
                newIndex.append(0)
                #print("newWordArray")
                #print(newWordArray)
                #print("newIndex")
                #print(newIndex)
                recursion(newWordArray,newIndex)
                print("pop")
                newWordArray.pop(-1)
                newIndex.pop(-1)
                print(newIndex)
                newIndex[len(newIndex)-1] +=1
                print('$$$$$$$$$$$$$$$$$存在終了')



            else:
                print('+++++++++++++++++++存在しない')
                #print("indexes")
                #print(indexes)
                pages = subpage(item)
                if len(pages) > 0:
                    pagein(newWordArray,newIndex,pages)
                print('(((((((((((((((((((pageindexes')
                print(newIndex)
                newIndex[len(indexes)-1] +=1
                print('@@@@@@@@@@@@@しない終了')

    print('------------再帰関数終了')



def subcat(word,ty = "subcat"):
    cur.execute('SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "%s" AND categorylinks.cl_to = "%s";' % (ty, word))

    rows = cur.fetchall()
    print('subCatFunction')
    if len(rows)>0:
        print(rows[0][0].decode('utf-8'))

    #print(rows)
    results = []
    for row in rows:
        #print(row)
        laRow = row[1].decode('utf-8')
        #print(row)
        results.append(laRow)
    #print(results
    return results

def subpage(word,ty = "page"):
    cur.execute('SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "%s" AND categorylinks.cl_to = "%s";' % (ty, word))

    rows = cur.fetchall()
    print('subPageFunction')
    if len(rows)>0:
        print(rows[0][0].decode('utf-8'))

    results = []
    for row in rows:
        #print(row)
        laRow = row[2]
        #print(row)
        results.append(laRow)
    #print(results)
    return results

def pagein(wordArray,indexes,pages):
    alignArray = alignment(wordArray,indexes)
    for i, item in enumerate(alignArray):
        for j, page in enumerate(pages):
            cur.execute('INSERT INTO wiki.node_data (category_name, page_id, degree) VALUES ( "%s", "%s", %d);' % (item, page,(len(alignArray)-i)))
            conn.commit()




def alignment(wordArray,indexes):
    alignArray = []
    for var in range(0, len(indexes)):
        alignArray.append(wordArray[var][indexes[var]])
    return alignArray


def duplication(wordArray,indexes,item):
    ws = 0
    alignArray = alignment(wordArray,indexes)
    for parent in alignArray:
        if parent == item:
            ws += 1

        if ws > 1:
            return False

    return True



wordArray = [["主要カテゴリ"]]
index = [0]

print("start")
recursion(wordArray,index)
print("end")