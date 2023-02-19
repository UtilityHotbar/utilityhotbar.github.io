import markdown

with open('text.md', 'r') as f:
    content = markdown.markdown(f.read(), extensions=['extra', 'sane_lists'])

with open('template.html', 'r') as f:
    packed_content = f.read().replace('%CONTENT%', content)

with open('index.html', 'w') as f:
    f.write(packed_content)