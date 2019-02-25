# coding: utf-8
import mysql.connector
import copy
import sys
sys.setrecursionlimit(10000)

circulation = 0
categoryNum = 0
conn = mysql.connector.connect(
    host = 'localhost',
    port = 3306,
    user = 'root',
    password ='',
    database = 'wiki',
)

cur = conn.cursor()

def recursion(wordArray,indexes):
    # print('===========再帰関数開始')
    # print(wordArray)
    # print(indexes)
    newIndex = copy.deepcopy(indexes)
    newWordArray = copy.deepcopy(wordArray)

    for i, item in enumerate(wordArray[(len(wordArray)-1)]):
        global categoryNum
        # print('yay')
        if duplication(newWordArray,newIndex,item):
            results = subcat(item)
            # print('results')
            if len(results)>0:
                categoryNum += 1
                newWordArray.append(results)
                newIndex.append(0)
                recursion(newWordArray,newIndex)
                newWordArray.pop(-1)
                newIndex.pop(-1)
                # categoryIn(newWordArray,newIndex,item)
                newIndex[len(newIndex)-1] +=1



            else:
                # categoryIn(newWordArray,newIndex,item)
                # print('else')
                categoryNum += 1
                newIndex[len(indexes)-1] +=1
        else:
            global circulation
            circulation +=1
            print(wordArray)
            print(indexes)
            print(categoryNum)
            print(circulation)
            # circulationIn(item)


def circulationIn(item):
    try:
        cur.execute('INSERT INTO wiki.circulation (category_name) VALUES ("%s")' % (item))
    except:
        cur.execute('INSERT INTO wiki.circulation (category_name) VALUES ("%s")' % (item))
    conn.commit()

def subcat(word,ty = "subcat"):
    try:
        cur.execute('SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "%s" AND categorylinks.cl_to = "%s";' % (ty, word))
    except:
        print('error')
        cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))

    rows = cur.fetchall()
    results = []
    for row in rows:
        laRow = row[1].decode('utf-8')
        results.append(laRow)
    return results


def subpage(word,ty = "page"):
    try:
        cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))

    except:
        cur.execute('SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = "%s" AND categorylinks.cl_to = "%s";' % (ty, word))

    rows = cur.fetchall()

    results = []
    for row in rows:
        laRow = row[2]
        results.append(laRow)
    return results



def categoryIn(wordArray,indexes,child):
    alignArray = alignment(wordArray,indexes)

    try:
        for i, item in enumerate(alignArray):
            if i<1:
                QUERY = 'INSERT INTO wiki.topic_la (parent_name, child_name) VALUES ("' +  item + '","' + child + '")'
            else:
                QUERY += ',' + '("' + item + '","' + child + '")'
        cur.execute(QUERY)
    except:
        for i, item in enumerate(alignArray):
            if i<1:
                QUERY = "INSERT INTO wiki.topic_la (parent_name, child_name) VALUES ('" +  item + "','" + child + "')"
            else:
                QUERY += "," + "('" + item + "','" + child + "')"
        cur.execute(QUERY)
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


wordArray = [['主要カテゴリ']]
index = [0]

print("start")
recursion(wordArray,index)
print(circulation)
print("end")