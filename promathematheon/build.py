import markdown
from markdown.extensions import toc
import os

my_md = markdown.Markdown(extensions=['extra', 'toc'], extension_configs={'toc': {'toc_depth': "2-6"}})

def add_toc_table(textdata, toc):
    return textdata
    
def process(name_of_file,template="page.html"):
    rawname = name_of_file.removesuffix('.md')
    with open('content/'+name_of_file) as f:
        data = f.read()
    rendered = my_md.convert(data, )
    if my_md.toc is not None:
        rendered = add_toc_table(rendered, my_md.toc)
    my_md.reset()

    with open(f'templates/{template}') as t:
        temp_data = t.read()
    
    temp_data = temp_data.replace('%TITLE%', rawname).replace('%CONTENT%', rendered)

    with open(f'public/{rawname}.html', 'w') as g:
        g.write(temp_data)

if __name__ == '__main__':
    for thing in os.scandir("content"):
        if thing.is_file():
            if thing.path.endswith(".md"):
                print('processing',thing.path)
                process(thing.name)
