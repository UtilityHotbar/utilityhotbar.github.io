import markdown
import os

with open('templates/template.html') as t:
    template = t.read()

for thing in os.scandir('markdown'):
    if thing.is_file():
        with open(thing.path) as f:
            data = f.read()
        html_data = markdown.markdown(data, extensions=["extra"])
        formatted_page = template.replace("%CONTENT%", html_data)
        with open(f"public/{thing.name.removesuffix('.md')}.html", "w") as g:
            g.write(formatted_page)