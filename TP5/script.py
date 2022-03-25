import json

with open("arq-son-EVO.json") as in_file:
    content = json.loads(in_file.read())
    musics = content["musicas"]

music_id = 0

out_string = '{ \"musicas\" : ['

size = len(musics)

for entry in musics:
    music_id += 1
    entry['id'] = music_id
    data = json.dumps(entry)
    out_string += data
    if(music_id != size):
        out_string += ','
    out_string += '\n'

out_string += '] }'
out_file = open('arq-son2.json',"w",encoding='utf-8')
out_file.write(out_string)