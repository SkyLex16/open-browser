<script>
(function() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const url = window.location.href;
    
    // Détection précise
    const isInstagram = ua.indexOf('Instagram') > -1;
    const isFacebook = (ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1);
    const isTwitter = ua.indexOf('Twitter') > -1;
    const isTikTok = ua.indexOf('musical_ly') > -1 || ua.indexOf('BytedanceWebview') > -1;
    
    const isInApp = isInstagram || isFacebook || isTwitter || isTikTok;
    
    if (isInApp) {
        const isIOS = /iPhone|iPad|iPod/.test(ua);
        const isAndroid = /Android/.test(ua);
        
        if (isIOS) {
            // Plusieurs méthodes pour iOS
            if (isInstagram) {
                // Spécifique Instagram iOS
                setTimeout(function() {
                    window.location.href = 'safari-' + url;
                }, 25);
            }
            
            // Méthode universelle iOS
            window.location.href = 'x-safari-' + url;
            
        } else if (isAndroid) {
            // Méthode 1 : Intent Chrome
            const chromeIntent = 'intent://' + 
                url.replace(/^https?:\/\//, '') + 
                '#Intent;scheme=https;package=com.android.chrome;end';
            
            window.location.href = chromeIntent;
            
            // Méthode 2 : Fallback après 300ms
            setTimeout(function() {
                const browserIntent = 'intent://' + 
                    url.replace(/^https?:\/\//, '') + 
                    '#Intent;scheme=https;action=android.intent.action.VIEW;end';
                window.location.href = browserIntent;
            }, 300);
        }
    }
})();
</script>