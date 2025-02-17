# daarbnotes - simple, offline, privacy focused notes app with screen reader support

## About: why make another notes app?

Recently, I got into the habit of journaling on a daily basis. I used apple notes for this purpose as it was a good app that had decent screen reader support. As I am blind, being able to navigate my notes app with a screen reader is an important feature.

I have tried apps like Obsidian in the past. And while Obsidian is a marvelous piece of software, it unfortunately isn't really screen reader friendly.

Now, I mentioned that apple notes is screen reader friendly so why make this project? Well, there was a small issue in apple notes. It would read arabic text very slowly for some reason.

That in and of itself is a small issue that I could solve in a variety of methods. I could copy the text out of apple notes and paste it anywhere on my system and the screen reader would read it properly

### So why make a notes app?

This small inconvenience wasn't really enough of a reason to make my notes app. But what truly gave me pause was when I thought to myself in the middle of journaling "what if apple is reading my notes?"

While my notes are nothing special. They are still my notes. They represent my thoughts and ideas. They represent my journey and plans. They aren't special; but they are MY notes and I don't want anyon e reading them without permission dammit!

And thats how daarbnotes was born.

### Features

- Stores notes in your home directory and sets permissions to 0700. Ain't no one reading your notes without permission (well unless its root....)
- Is fully accessible
- RTL SUPPORT!!!!!!!!!!

## Live Development

To run in live development mode, run `wails dev` in the project directory. This will run a Vite development
server that will provide very fast hot reload of your frontend changes. If you want to develop in a browser
and have access to your Go methods, there is also a dev server that runs on http://localhost:34115. Connect
to this in your browser, and you can call your Go code from devtools.

# License

This project is licensed under the AGPLv3 license.
