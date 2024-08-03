Hi! This is [Chris](https://utilityhotbar.github.io). If you're here to build a small personal website, this is the place for you! This website was built using the method I describe here, so it should be pretty good.

## 1. Setup

To set up a website, you need some data to put on the website. Here's some data:

```
hello world
```

If you save this in a file called `index.html`, most browsers will show it on click. However, that's a little unsatisfying. Let's use the [markdown](https://python-markdown.github.io/) system to add a little flair to our website. To do this, install markdown on your system:

```
$ pip3 install markdown
```

We should probably create a folder to store our work. Call this folder `MyWebsite`, and inside of it create a folder called `public`. We want to put our public-facing stuff in a folder where it's separate from everything else, because mixing code and output makes for a messy workflow.

Now, create a file `index.md` under `MyWebsite`. This will store the information you want to put into the website. Your folder structure should now look like this:

```
/MyWebsite
|-> index.md
|-> /public
```

Put some data in `index.md`, formatted using the markdown notation:

```markdown
# This is a header

Here is some body text. This is text in *italics* and **bold**. You can also include `code` and [links](https://www.google.com).
```

Now we need to turn this human-friendly markdown into html. Create a python file `build.py` under `MyWebsite`:

```python
import markdown

with open("index.md") as f:
    data = f.read()
html_data = markdown.markdown(data)
with open("public/index.html", "w") as g:
    g.write(html_data)
```

What this code does is that it reads the markdown we have written in `index.md`, converts it to valid HTML, and writes the result to `public/index.html`. Run it!

```
$ python3 build.py
```

This should now be your folder structure:

```
/MyWebsite
|-> index.md
|-> build.py
|-> /public
    |-> index.html
```

Open `index.html` in a text editor:

```html
<h1>This is a header</h1>
<p>Here is some body text. This is text in <em>italics</em> and <strong>bold</strong>. You can also include <code>code</code> and <a href="https://www.google.com">links</a>.</p>
```

So now we have some functional code. Click on `index.html` and open it in a browser. This should be a formatted website! Now you see why we put all the public facing data in `/public`, because we have unformatted text and raw code etc. in our working directory.

## 2. Templating

Let's say that you want to have two pages, an `index.html` page and an `about.html` page. You'll need the `index.md` and `about.md` files, of course, but let's say you want to put the same website title on all of the pages. It would be annoying to copy the same data from page to page! Luckily, templating saves us a lot of trouble.

Let's first do some reorganisation of our folder structure.

```
/MyWebsite
|-> build.py
|-> /markdown
    |-> index.md
|-> /templates
    |-> template.html
|-> /public
    |-> index.html
```

The `template.html` file houses, you guessed it, the template data for your website. You can generate it from markdown too, but I have one prepared for you here (based on the VS Code `html5` template):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>YOUR WEBSITE TITLE</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>YOUR WEBSITE TITLE</h1>
    %CONTENT%
</body>
</html>
```

Feel free to change everything except `%CONTENT%`. This is the indicator to tell our build system that each page's content will go here.

We now need to modify `build.py`:

```python
import markdown
import os

with open('templates/template.html') as t:
    template = t.read()

for thing in os.scandir('markdown'):
    if thing.is_file():
        with open(thing.path) as f:
            data = f.read()
        html_data = markdown.markdown(data)
        formatted_page = template.replace("%CONTENT%", html_data)
        with open(f"public/{thing.name.removesuffix('.md')}.html", "w") as g:
            g.write(formatted_page)
```

This takes the template we have made, iterates over all files in the directory `markdown`, and writes them into html by copying the file data into the template.

Run it again, and you should have a finished HTML page for each page in the `markdown` directory.

## CSS and styling

CSS is not hard! Create a `style.css` file in the `public` directory. Add the following style information:

```css
@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

.spectral-regular {
    font-family: "Spectral", serif;
    font-weight: 400;
    font-style: normal;
  }

body {
    background-color: antiquewhite;
    font-family: 'Spectral', Times, serif;
    padding: 10px;
}
```

The first line imports a font from [Google Fonts](https://fonts.google.com/) and adds it to your CSS file. The `.spectral-regular` instruction sets up the font that we've added, and the `body` instruction specifies that we should use a certain background colour, the font we've chosen, and add 10 pixels of space around the body content of the page. And it looks better already! There are loads of CSS tutorials online, feel free to check some of them out. I have some of my own on my [Github site](https://utilityhotbar.github.io/neoweb/) too!

## 4. Publishing
You now have a bunch of files, but no way to show them to people. So we will use [Github Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) to do this.

Create a new github repository with the name `WEBSITE_NAME.github.io`. Upload the `public` folder to the repository however you want (you can totally just use `upload existing file` on the web UI, it's not cheating). In the `Settings` tab, select `Pages` from the side menu. Make sure that Github Pages is building from the `main` branch and the `public` directory. After that, you should have a public site. To take it down, delete the repository or [disable the pages feature](https://docs.github.com/en/pages/getting-started-with-github-pages/unpublishing-a-github-pages-site).