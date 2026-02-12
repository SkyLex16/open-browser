(function() {
  try {
    var ua = navigator.userAgent || navigator.vendor || window.opera;
    var url = window.location.href;

    var isInstagram = ua.indexOf('Instagram') > -1;
    var isFacebook  = (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    var isTwitter   = ua.indexOf('Twitter') > -1;
    var isTikTok    = ua.indexOf('musical_ly') > -1 || ua.indexOf('BytedanceWebview') > -1;

    var isInApp = isInstagram || isFacebook || isTwitter || isTikTok;
    if (!isInApp) return; // Ne rien faire dans un vrai navigateur

    var isIOS     = /iPhone|iPad|iPod/.test(ua);
    var isAndroid = /Android/.test(ua);

    // --- IMPORTANT ---
    // Les webviews (surtout iOS) bloquent souvent les redirections "automatiques".
    // Une action "user gesture" (clic) est beaucoup plus fiable.
    // On injecte donc une petite barre en haut qui propose "Ouvrir dans le navigateur".

    function injectOpenInBrowserUI(onClick) {
      var bar = document.createElement('div');
      bar.setAttribute('style',
        'position:fixed;left:0;right:0;top:0;z-index:2147483647;' +
        'background:#111;color:#fff;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;' +
        'padding:12px 14px;display:flex;align-items:center;gap:10px;box-shadow:0 2px 8px rgba(0,0,0,.3)'
      );

      var txt = document.createElement('div');
      txt.textContent = 'Ouvrez cette page dans votre navigateur pour une meilleure expérience.';
      txt.setAttribute('style','font-size:14px;flex:1');

      var btn = document.createElement('button');
      btn.textContent = 'Ouvrir le navigateur';
      btn.setAttribute('style',
        'background:#1d9bf0;border:0;border-radius:10px;color:#fff;padding:10px 14px;font-weight:600;cursor:pointer'
      );
      btn.addEventListener('click', function(e){
        e.preventDefault();
        try { onClick(); } catch(e) {}
      });

      bar.appendChild(txt);
      bar.appendChild(btn);
      document.body.appendChild(bar);

      // Évite que la barre recouvre le contenu cliquable en haut
      document.documentElement.style.scrollPaddingTop = '56px';
      document.body.style.paddingTop = '56px';
    }

    function tryOpenExternal() {
      if (isIOS) {
        // iOS : les schemes "x-safari-" ou "safari-" sont souvent BLOQUÉS sans user gesture.
        // On tente window.open (plus toléré lorsqu'il vient d'un click).
        var opened = window.open(url, '_blank', 'noopener,noreferrer');
        if (!opened) {
          // Fallback : message
          alert('Sur iOS, veuillez utiliser ••• > Ouvrir dans Safari pour quitter Instagram.');
        }
      } else if (isAndroid) {
        // Android : Intent Chrome + fallback générique
        var intent = 'intent://' + url.replace(/^https?:\/\//,'') +
          '#Intent;scheme=https;package=com.android.chrome;end';
        // On tente d’abord via location (plus agressif)
        window.location.href = intent;
        // Puis un léger fallback après 300ms (toujours lié au click)
        setTimeout(function(){
          var browserIntent = 'intent://' + url.replace(/^https?:\/\//,'') +
            '#Intent;scheme=https;action=android.intent.action.VIEW;end';
          window.location.href = browserIntent;
        }, 300);
      }
    }

    // Injecte l’UI pour déclencher l’ouverture via une action utilisateur
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function(){ injectOpenInBrowserUI(tryOpenExternal); });
    } else {
      injectOpenInBrowserUI(tryOpenExternal);
    }
  } catch(err) {
    // Evite de casser la page
    console && console.warn && console.warn('open-browser.js error', err);
  }
})();
