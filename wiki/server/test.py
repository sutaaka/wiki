import mysql.connector

conn = mysql.connector.connect(
    host = 'localhost',
    port = 3306,
    user = 'root',
    password ='',
    database = 'wiki',
)

cur = conn.cursor()

ty = "実験式"

cur.execute('SELECT * FROM wiki.node_data WHERE category_name = "%s" AND degree = 1;' % (ty))

rows = cur.fetchall()

#results = []
for row in rows:
    laRow = row[1].decode('utf-8')
    print("parent  %d |  %s |  %d" % (row[0],laRow,row[2]))

    #print(row)
print(len(rows))
