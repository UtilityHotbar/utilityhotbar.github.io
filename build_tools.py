import markdown

with open('index.md', 'r', encoding='utf-8') as f:
    text = f.read()

content = markdown.markdown(text, extensions=['sane_lists'])

with open('html_template.txt', 'r') as h:
    html = h.read().replace('%CONTENT%', content)

with open('index.html', 'w', encoding='utf-8', errors="xmlcharrefreplace") as g:
    g.write(html)