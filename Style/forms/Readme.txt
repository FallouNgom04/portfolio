This project includes a simple, self-contained contact form handler: `forms/contact.php`.

Important:
- PHP scripts do NOT run on static servers like VS Code Live Server (port 5500). You'll get `405 Method Not Allowed` on submit.
- Use a PHP-capable server instead (example with PHP built-in server):

  cd Style
  php -S 127.0.0.1:8000

Then open: http://127.0.0.1:8000/

Note:
- `contact.php` tries to send mail via PHP `mail()`; if that isn't configured, it saves submissions to `forms/_submissions/`.
