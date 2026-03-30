/**
* PHP Email Form Validation - v3.11
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach( function(e) {
    e.addEventListener('submit', function(event) {
      event.preventDefault();

      let thisForm = this;

      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');
      
      if( ! action ) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData( thisForm );

      if ( recaptcha ) {
        if(typeof grecaptcha !== "undefined" ) {
          grecaptcha.ready(function() {
            try {
              grecaptcha.execute(recaptcha, {action: 'php_email_form_submit'})
              .then(token => {
                formData.set('recaptcha-response', token);
                php_email_form_submit(thisForm, action, formData);
              })
            } catch(error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!')
        }
      } else {
        php_email_form_submit(thisForm, action, formData);
      }
    });
  });

  function php_email_form_submit(thisForm, action, formData) {
    let isPhpHandler = /\.php(\?|$)/i.test(action);
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: isPhpHandler
        ? {'X-Requested-With': 'XMLHttpRequest'}
        : {'Accept': 'application/json'}
    })
    .then(async response => {
      let contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch (e) {
          errorBody = '';
        }
        throw new Error(errorBody || `${response.status} ${response.statusText} ${response.url}`);
      }

      // Some form providers return JSON; the original PHP script returns plain text ("OK").
      if (contentType.includes('application/json')) {
        try {
          return { body: await response.json() };
        } catch (e) {
          return { body: '' };
        }
      }

      return { body: await response.text() };
    })
    .then(({ body }) => {
      thisForm.querySelector('.loading').classList.remove('d-block');

      // For the original PHP handler, success is the literal text "OK".
      // For static-host-friendly form providers (Formspree/Getform/etc.), any 2xx response is treated as success.
      let isOkText = (typeof body === 'string') && body.trim() === 'OK';

      let success = isPhpHandler ? isOkText : true;

      if (success) {
        thisForm.querySelector('.sent-message').classList.add('d-block');
        thisForm.reset(); 
      } else {
        throw new Error(body ? body : 'Form submission failed and no error message returned from: ' + action); 
      }
    })
    .catch((error) => {
      let message = (error && error.message) ? error.message : String(error);
      message = enhanceCommonErrors(message, action);
      displayError(thisForm, message);
    });
  }

  function enhanceCommonErrors(message, action) {
    if (String(action || '').includes('REPLACE_ME')) {
      return [
        'Form endpoint not configured.',
        '',
        'You are using a placeholder:',
        'action="https://formspree.io/f/REPLACE_ME"',
        '',
        'Fix: replace REPLACE_ME with your real Formspree endpoint in Style/index.html.',
      ].join('\n');
    }

    // Live Server (VS Code) is a static server and returns 405 for POST requests.
    // Contact forms that post to .php require a PHP-capable server (Apache/Nginx/PHP built-in server).
    if ((/^\s*405\b/.test(message) || message.includes(' 405 ')) && /\.php(\?|$)/i.test(action)) {
      return [
        '405 Method Not Allowed.',
        '',
        'You are probably serving this site with a static server (e.g. VS Code Live Server on port 5500).',
        'PHP files are not executed there, so POST to "forms/contact.php" will fail.',
        '',
        'Fix (PHP built-in server):',
        '1) Open a terminal in the "Style" folder',
        '2) Run: php -S 127.0.0.1:8000',
        '3) Open: http://127.0.0.1:8000/',
      ].join('\n');
    }

    return message;
  }

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').innerHTML = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
