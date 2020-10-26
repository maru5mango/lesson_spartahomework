import requests
from bs4 import BeautifulSoup as Bsoup
from pymongo import MongoClient as Mongo

client = Mongo('localhost', 27017)
db = client.m_list

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
data = requests.get('https://www.genie.co.kr/chart/top200?ditc=D&rtm=Y', headers=headers)
soup = Bsoup(data.text, 'html.parser')


music_lists = soup.select('#body-content > div.newest-list > div > table > tbody > tr')


for music in music_lists:
    music.select_one('td.number > span').decompose()
    rank = music.select_one('td.number').text.strip()
    title = music.select_one('a.title.ellipsis').text.strip()
    artist_name = music.select_one('a.artist.ellipsis').text
    doc = {
        'rank': rank,
        'title': title,
        'artits': artist_name
    }
    db.m_list.update_one({'rank': rank}, {'$set': {'title': title}})
    db.m_list.update_one({'rank': rank}, {'$set': {'artits': artist_name}})
