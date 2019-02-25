import mysql.connector
import copy

conn = mysql.connector.connect(
    host = 'localhost',
    port = 3306,
    user = 'root',
    password ='',
    database = 'wiki',
)

cur = conn.cursor()


#def trch(ty):
#    try:
#        cur.execute('SELECT child_id FROM wiki.node_id_data WHERE parent_name = "%s" AND degree = 1;' % (ty))
#    except:
#        print('error')
#        cur.execute("SELECT child_id FROM wiki.node_id_data WHERE parent_name = '%s' AND degree = 1;" % (ty))
#    rows = cur.fetchall()
#    print(rows)
#
#
#woa =['楽譜','セイコーホームシアター"S"', '土曜ナイトドラマ_(テレビ朝日)', 'ウイークエンドドラマ', 'テレビ朝日系ミステリースペシャル', '土曜ワイド劇場', 'Lドラ']
#
##for item in woa:
##    print(item)
##    trch(item)
#
#ty = "人工知能学者"
#cur.execute('SELECT child_name FROM wiki.parent_page WHERE parent_name = "%s" AND degree = 1;' % (ty))
#rows = cur.fetchall()
#i=0
#for item in rows:
#    print(i)
#    print(item[0].decode('utf-8'))
#    i += 1
#
#
#print('end')


#tya = 'セイコーホームシアター"S"'
# word = ['楽器','地域別の音楽','音楽のジャンル','音楽学','音響機器','音楽史','音楽の一覧','音楽関連のスタブ','音楽評論','音楽関連のテンプレート','音楽教育','音楽関連の組織','音楽用語','音楽に関するメディア','ウィキポータル音楽の関連記事','編曲','音楽作品','音楽産業','作曲','楽譜','音楽の技法','音楽検閲','音楽博物館','音楽アーカイブ','音楽文化']
# ty = 'subcat'
#ty = tya.encode('utf-8')
#trch(ty)
#cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))
#cur.execute("SELECT child_name FROM wiki.parent_page WHERE parent_name = '%s';" % (ty))

#rows = cur.fetchall()

# for item in word:
cur.execute("SELECT * FROM wiki.categorylinks WHERE cl_type = 'subcat';")
    # cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, item))
rs = cur.fetchall()


    # results = []
    # for row in rs:
    #laRow = row[0].decode('utf-8')
    #print("parent  %d |  %s |  %d |  %d" % (row[0],laRow,row[2],row[3]))
        # print(row[2])
print(len(rs))

#print('end')
#print(rows)





#for row in rows:
#    print(row)

#rows[0].replace(",","")
#print(rows[0])
#print(len(rows))
