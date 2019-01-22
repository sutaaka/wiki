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
                categoryIn(newWordArray,newIndex,item)
                #ページin
                #pages = subpage(item)
                #if len(pages) > 0:
                #    pagein(newWordArray,newIndex,pages)
                print(newIndex)
                newIndex[len(newIndex)-1] +=1
                print('$$$$$$$$$$$$$$$$$存在終了')



            else:
                print('+++++++++++++++++++存在しない')
                #print("indexes")
                #print(indexes)
                #ページin
                #pages = subpage(item)
                #if len(pages) > 0:
                #    pagein(newWordArray,newIndex,pages)
                categoryIn(newWordArray,newIndex,item)
                print('(((((((((((((((((((pageindexes')
                print(newIndex)
                newIndex[len(indexes)-1] +=1
                print('@@@@@@@@@@@@@しない終了')

    print('------------再帰関数終了')



def subcat(word,ty = "subcat"):
    try:
        cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))
    except:
        print('error')
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
    try:
        cur.execute("SELECT cl_to AS parentName, page_title AS childName, cl_from AS pageId FROM page JOIN categorylinks ON categorylinks.cl_from=page.page_id WHERE categorylinks.cl_type = '%s' AND categorylinks.cl_to = '%s';" % (ty, word))

    except:
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
            print(page)
            try:
                cur.execute('INSERT INTO wiki.parent_page (parent_name, page_id, degree) VALUES ( "%s", %d, %d);' % (item, page,(len(alignArray)-i)))
            except:
                cur.execute("INSERT INTO wiki.parent_page (parent_name, page_id, degree) VALUES ( '%s', %d, %d);" % (item, page,(len(alignArray)-i)))
            conn.commit()

def categoryIn(wordArray,indexes,child):
    alignArray = alignment(wordArray,indexes)
    print(child)
    #try:
    #    cur.execute("SELECT category_id FROM wiki.category_id WHERE category_name = '%s';" % (child))
    #except:
    #    cur.execute('SELECT category_id FROM wiki.category_id WHERE category_name = "%s";' % (child))

    #rows = cur.fetchall()
    #print(rows[0])
    #for i, item in enumerate(alignArray):
    #    try:
    #        cur.execute("INSERT INTO wiki.parent_page (parent_name, child_name, degree) VALUES ( '%s', '%s', %d);" % (item, rows[0][0],(len(alignArray)-i)))
    #    except:
    #        cur.execute('INSERT INTO wiki.parent_page (parent_name, child_name, degree) VALUES ( "%s", "%s", %d);' % (item, rows[0][0],(len(alignArray)-i)))
    #    conn.commit()

    for i, item in enumerate(alignArray):
        try:
            cur.execute("INSERT INTO wiki.parent_page (parent_name, child_name, degree) VALUES ( '%s', '%s', %d);" % (item, child,(len(alignArray)-i)))
        except:
            cur.execute('INSERT INTO wiki.parent_page (parent_name, child_name, degree) VALUES ( "%s", "%s", %d);' % (item, child,(len(alignArray)-i)))
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
#wordArray = [['音楽'], ['ウィキポータル音楽の関連記事', '音楽関連のスタブ', '音楽の一覧', '音楽関連のテンプレート', '音楽アーカイブ', '音楽学', '音楽検閲', '音楽史', '音楽の技法', '音楽博物館', '音響機器', '楽譜', '楽器', '音楽教育', '音楽作品', '作曲', '音楽産業', '音楽のジャンル', '音楽関連の組織', '地域別の音楽', '音楽評論', '音楽文化', '編曲', '音楽に関するメディア', '音楽用語'], ['各国の音楽関連組織', '音楽業界団体', '音楽グループ', '音楽博物館', '音楽関連企業', '音楽系教育機関', 'コンサート会場', '放送音楽関連の組織', 'ホール', 'レコード・レーベル'], ['ホールの画像', '演芸場', '劇場', 'コンサートホール', '日本のホール', 'ライブハウス'], ['各国の劇場', '都市別の劇場', '円形劇場', '演芸場', '歌劇場', 'キャバレー', '国立劇場', 'ストリップ劇場', '舞台', '舞台芸術', 'プラネタリウム'], ['舞台芸術', 'セットデザイナー', '日本の舞台制作会社・団体', '舞台機構'], ['舞台作品', '舞台芸術の賞', '舞台芸術を題材とした作品', '舞台美術家', '舞台芸術関連のスタブ', '舞台芸術のテンプレート', 'アイスショー', '演劇', '芸能', '公演', 'サーカス', 'ダンス', '人形劇', 'バーレスク', '舞台芸術博物館', 'パフォーマンス・アート', 'バレエ', 'フィクションの諸形式_(舞台芸術)', 'プロレス', '舞台芸術史'], ['各国の演劇', '演劇関係者', '舞台劇の映画化作品', '演劇祭', '演劇学校', '脚本', '劇場', '劇団', '劇付随音楽', '公演', '演劇を題材とした作品', '演劇のジャンル', '演劇に関する出版社', '演劇の賞', '演劇の登場人物', 'ドラマ', '舞台芸術史', '役', '演劇理論'], ['オペラ', '歌舞伎', '戯曲_(中国)', '喜劇', '狂言', '時代劇', '新派', '能', 'バーレスク', 'パフォーマンス・アート', 'バレエ', '風刺劇', 'ミュージカル'], ['時代劇アニメ', '時代劇映画', '時代劇専門チャンネル', 'テレビ時代劇', '赤穂事件を題材にした作品', '石川五右衛門を題材にしたフィクション作品', '大岡越前を題材にした作品', '鞍馬天狗', '剣劇俳優', '子連れ狼', 'コミック乱', '清水次郎長を題材とした作品', '新選組を題材とした作品', '戦国自衛隊', '殺陣', '東映時代劇', '遠山の金さん', '徳川吉宗を題材にした作品', '捕物_(時代劇)', '鼠小僧を題材にしたフィクション作品', '奉行所関係者を題材とした作品', '水戸黄門', '宮本武蔵を題材としたフィクション作品', '柳生氏を題材とした作品'], ['テレビ時代劇のシリーズ', 'NHKの時代劇', 'TBSの時代劇', 'テレビ朝日の時代劇', 'テレビ東京の時代劇', 'テレビドラマ・時代劇放送枠', '日本テレビの時代劇', 'フジテレビの時代劇', '池波正太郎原作のテレビドラマ', '江戸を舞台としたテレビドラマ', '新選組を題材としたテレビドラマ', '津本陽原作のテレビドラマ', '東映テレビ時代劇', '藤沢周平原作のテレビドラマ', '舟橋聖一原作のテレビドラマ', '吉川英治原作のテレビドラマ'], ['JTBC金土ドラマ', 'プレミアムドラマ', 'BS時代劇', 'ドラマ愛の詩', '連続テレビ小説', '少年ドラマシリーズ', 'ドラマ新銀河', '○曜時代劇_(NHK)', '銀河テレビ小説', 'NHK夜の連続ドラマ', '大河ドラマ', 'NHKドラマ人間模様', '月曜ドラマシリーズ', 'よる★ドラ', 'ドラマDモード', '水曜ドラマ_(NHK)', 'ドラマ8', 'ドラマ10', '土曜ドラマ_(NHK)', '土曜ドラマスペシャル', 'SBSドラマスペシャル', 'SBS日日ドラマ', 'SBS月火ドラマ', 'SBS週末特別企画ドラマ', 'ポーラテレビ小説', 'TBS・朝日放送平日昼1時枠の連続ドラマ', '愛の劇場', 'テレビ映画_(TBS系昼ドラ)', 'TBS平日昼1時30分枠の連続ドラマ', 'ひるドラ', 'ドラマ30', '妻そして女シリーズ', 'CBC制作昼の連続ドラマ', 'ドラマ23', '朝日放送制作・TBS日曜6時30分枠の連続ドラマ', 'TBS日曜8時枠の連続ドラマ', '日曜劇場', 'TBS・CBC日曜10時枠の連続ドラマ', 'JTドラマBOX', 'ブラザー劇場', 'ナショナル劇場', 'パナソニック_ドラマシアター', '月曜ミステリーシアター', '朝日放送制作・TBS月曜8時枠の連続ドラマ', 'TBS月曜9時枠の連続ドラマ', '月曜ドラマスペシャル', '月曜ミステリー劇場', 'TBS月曜10時枠の連続ドラマ', 'ドラマNEO', 'TBS火曜7時枠の連続ドラマ', 'TBS火曜8時枠の連続ドラマ', 'TBS火曜9時枠の連続ドラマ', '木下恵介アワー', 'TBS火曜10時枠の連続ドラマ', 'TBS火曜ドラマ', 'TBS水曜7時30分枠の連続ドラマ', 'TBS水曜8時枠の連続ドラマ', 'TBS水曜ドラマ', '水曜劇場_(TBS)', 'TBS水曜10時枠の連続ドラマ', '水ドラ!!', 'TBS木曜7時30分枠の連続ドラマ', 'ケンちゃんシリーズ', 'TBS木曜8時枠の連続ドラマ', 'TBS木曜9時枠の連続ドラマ', '木曜ドラマ9', '朝日放送制作・TBS木曜9時30分枠の連続ドラマ', 'TBS木曜10時枠の連続ドラマ', 'カネボウ木曜劇場', '木下恵介・人間の歌シリーズ', '木曜座', 'TBS金曜7時枠の連続ドラマ', 'TBS金曜8時枠の連続ドラマ', '近鉄金曜劇場', 'TBS金曜9時枠の連続ドラマ', 'TBS金曜ドラマ', 'サンヨーテレビ劇場', 'Friday_Break', 'TBS土曜8時枠の連続ドラマ', 'TBS土曜9時枠の連続ドラマ', 'TBS土曜10時枠の連続ドラマ', 'TvN月火ドラマ', 'TvN水木ドラマ', 'TvN金土ドラマ', '連続ドラマW', '土曜ナイトドラマ_(朝日放送)', 'ドラマL', '朝日放送火曜8時枠の連続ドラマ', '朝日放送火曜9時枠の連続ドラマ', '朝日放送金曜9時枠の連続ドラマ', 'MBCシットコム', 'MBC月火ドラマ', 'MBC水木ミニシリーズ', 'MBC週末ドラマ', 'MBC週末企画ドラマ', '白雪劇場', '関西テレビ日曜9時枠の連続ドラマ', '関西テレビ月曜10時枠の連続ドラマ', '松本清張シリーズ_(関西テレビ)', '関西テレビ火曜9時枠の連続ドラマ', '関西テレビ火曜10時枠の連続ドラマ', '関西テレビ水曜10時枠の連続ドラマ', '阪急ドラマシリーズ', 'ドラマNEXT', 'KBS1連続ドラマ', 'KBS大河ドラマ', 'KBS月火ドラマ', 'KBS水木ドラマ', 'KBS週末連続ドラマ', 'トミカヒーローシリーズ', '帯ドラマ劇場', '日曜ワイド', 'NECサンデー劇場', 'テレビ朝日日曜8時枠の連続ドラマ', '日本映画名作ドラマ', 'テレビ朝日日曜深夜ドラマ', 'テレビ朝日月曜7時30分枠の連続ドラマ', 'テレビ朝日月曜8時枠の連続ドラマ', '月曜ドラマ・イン', 'テレビ朝日月曜9時枠の連続ドラマ', 'ポーラ名作劇場', 'テレビ朝日火曜8時枠の連続ドラマ', 'テレビ朝日火曜9時枠の連続ドラマ', 'テレビ朝日水曜8時枠の連続ドラマ', 'テレビ朝日水曜9時枠の刑事ドラマ', 'テレビ朝日木曜8時枠の連続ドラマ', '木曜ミステリー', '木曜ドラマ_(テレビ朝日)', 'テレビ朝日木曜10時枠の連続ドラマ', 'テレビ朝日金曜7時30分枠の連続ドラマ', 'NET金曜8時枠の連続ドラマ', '朝日放送・テレビ朝日金曜9時枠の連続ドラマ', '毎日放送・NET金曜9時枠の連続ドラマ', '金曜ナイトドラマ', 'テレビ朝日土曜7時30分枠の連続ドラマ', 'テレビ朝日土曜8時枠の連続ドラマ', 'セイコーホームシアター"S"', '土曜ナイトドラマ_(テレビ朝日)', 'ウイークエンドドラマ', 'テレビ朝日系ミステリースペシャル', '土曜ワイド劇場', 'Lドラ', '土曜ドラマ24', 'テレビ東京日曜9時枠の連続ドラマ', 'テレビ東京月曜9時枠の連続ドラマ', 'テレビ東京月曜10時枠の連続ドラマ', 'ドラマBiz', 'テレビ東京火曜8時枠の連続ドラマ', 'テレビ東京水曜8時枠の連続ドラマ', '水曜ミステリー9', 'ソコアゲ★ナイト', '木ドラ25', 'テレビ東京金曜8時枠の連続ドラマ', '金曜8時のドラマ', 'ドラマ24', 'テレビ東京土曜未明の深夜ドラマ', 'ドラマ25', '超星神シリーズ', 'テレビ東京系土曜深夜ドラマ', '東海テレビ制作昼の帯ドラマ', 'オトナの土ドラ', 'シンドラ', '愛のサスペンス劇場', '日本テレビ日曜8時枠の連続ドラマ', '日本テレビ日曜9時枠の連続ドラマ', '日曜ドラマ', '日本テレビ日曜10時30分枠の連続ドラマ', '日本テレビ月曜7時枠の連続ドラマ', '日本テレビ月曜8時枠の連続ドラマ', '日本テレビ月曜9時枠の連続ドラマ', '山一名作劇場', '日本テレビ火曜8時枠の連続ドラマ', 'DRAMA_COMPLEX', '日本テレビ火曜9時枠の連続ドラマ', '火曜サスペンス劇場', '火曜ドラマゴールド', '日本テレビ火曜10時枠の連続ドラマ', '日本テレビ水曜7時枠の連続ドラマ', '日本テレビ水曜7時30分枠の連続ドラマ', '日本テレビ水曜8時枠の連続ドラマ', '日本テレビ水曜9時枠の連続ドラマ', '日本テレビ水曜10時枠の連続ドラマ', '日本テレビ木曜8時枠の連続ドラマ', '日本テレビ金曜8時枠の連続ドラマ', '金曜劇場_(日本テレビ)', '日本テレビ土曜7時30分枠の連続ドラマ', '日本テレビ土曜8時枠の連続ドラマ', '土曜グランド劇場', '日本テレビ土曜9時枠の連続ドラマ', '土曜ドラマ_(日本テレビ)', '日本テレビ土曜10時枠の連続ドラマ', '火曜ドラマ_(BSジャパン)', '火曜スペシャル', '連続ドラマJ', 'お昼のテレビ小説', 'ライオン奥様劇場', '妻たちの劇場', '新春ドラマスペシャル', '東映不思議コメディーシリーズ', 'フジテレビ日曜8時枠の連続ドラマ', 'ドラマチック・サンデー', 'フジテレビ日曜9時枠の連続ドラマ', '百万人の劇場', 'フジテレビ月曜7時枠の連続ドラマ', 'フジテレビ月曜7時30分枠の連続ドラマ', '月曜ドラマランド', 'フジテレビ月曜8時枠の連続ドラマ', 'フジテレビ月曜9時枠の連続ドラマ', 'ブレイクマンデー24', 'シャープ火曜劇場', 'フジテレビ火曜8時枠の連続ドラマ', 'フジテレビ火曜9時枠の連続ドラマ', 'フジテレビ水曜8時枠の連続ドラマ', 'フジテレビ水曜9時枠の連続ドラマ', '水曜劇場_(フジテレビ)', 'フジテレビ水曜10時枠の連続ドラマ', '青春★ENERGY', 'フジテレビ木曜7時枠の連続ドラマ', 'フジテレビ木曜7時30分枠の連続ドラマ', 'フジテレビ木曜8時枠の連続ドラマ', '木曜ドラマストリート', 'フジテレビ木曜9時30分枠の連続ドラマ', 'フジテレビ木曜9時枠の連続ドラマ', 'フジテレビ木曜10時枠の連続ドラマ', 'フジテレビ金曜7時枠の連続ドラマ', 'フジテレビ金曜8時枠の連続ドラマ', 'フジテレビ金曜9時枠の連続ドラマ', 'シオノギテレビ劇場', '金曜劇場_(フジテレビ)', 'フジテレビ土曜7時枠の連続ドラマ', 'フジテレビ土曜7時30分枠の連続ドラマ', 'フジテレビ土曜8時枠の連続ドラマ', 'ボクたちのドラマシリーズ', 'フジテレビ土曜9時枠の連続ドラマ', 'フジテレビ土曜10時枠の連続ドラマ', 'フジテレビ系土曜ドラマ', '土ドラ', 'ドラマイズム', '大丸名作劇場', '読売テレビ土曜7時枠の連続ドラマ', '朝の連続ドラマ', '読売テレビ月曜10時枠の連続ドラマ', '読売テレビ木曜9時枠の連続ドラマ', '木曜ナイトドラマ', '木曜ミステリーシアター', '木曜ドラマ_(読売テレビ)', '読売テレビ土曜10時枠の連続ドラマ']]
#index = [0, 18, 8, 2, 8, 0, 7, 10, 5, 3, 5, 135]

print("start")
recursion(wordArray,index)
print("end")