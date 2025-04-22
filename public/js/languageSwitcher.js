document.addEventListener('DOMContentLoaded', function() {
    // console.log('DOMContentLoaded event fired'); 
    console.log('localizations:', localizations);

    const languageSelector = document.getElementById('languageSelector');
    if (languageSelector) {
        languageSelector.value = "pt-BR";
    }
    
    if (!languageSelector) {
        console.error('Elemento languageSelector não encontrado no DOM');
        return;
    }

    // homeData e localizations já estão disponíveis no escopo global

    if (languageSelector && Array.isArray(localizations)) {
        languageSelector.addEventListener('change', function() {
            const selectedLocale = this.value;
            if (selectedLocale === "pt-BR") {
                // Usar textos originais do homeData
                document.querySelector('.logo').alt = homeData.tagLine;
                document.querySelector('.description').textContent = homeData.catchFrase;
                document.querySelector('.email').textContent = homeData.faleCom;
            } else {
                const selectedLocalization = localizations.find(
                    loc => loc.attributes && loc.attributes.locale === selectedLocale
                );
                if (selectedLocalization && selectedLocalization.attributes) {
                    document.querySelector('.logo').alt = selectedLocalization.attributes.tagLine;
                    document.querySelector('.description').textContent = selectedLocalization.attributes.catchFrase;
                    document.querySelector('.email').textContent = selectedLocalization.attributes.faleCom;
                }
            }
        });
    } else {
        console.error('Localizations não definido ou não é um array');
    }
});