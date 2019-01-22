# coding: utf-8
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

#cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))

cur.execute("SELECT * FROM wiki.categorylinks;")
rows = cur.fetchall()

for row in rows:
    p = row[1].decode('utf-8')
    c = row[2].decode('utf-8')
    print(p)
    print(c)
    try:
        cur.execute("INSERT INTO wiki.cl (parent_name, child_name, child_id) VALUES ( '%s', '%s', %d);" % (p, c,row[3]))
    except:
        cur.execute('INSERT INTO wiki.cl (parent_name, child_name, child_id) VALUES ( "%s", "%s", %d);' % (p, c,row[3]))
    conn.commit()

print('end')