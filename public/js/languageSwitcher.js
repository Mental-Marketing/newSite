document.addEventListener('DOMContentLoaded', function() {

    const languageSelector = document.getElementById('languageSelector');

    if (languageSelector) {
        languageSelector.value = "pt-BR";
    }
    
    if (!languageSelector) {
        console.error('Elemento languageSelector não encontrado no DOM');
        return;
    }

    function reiniciarAnimacoes() {
        const motionElement = document.querySelector('.numbah_motion');
        const emailElement = document.querySelector('.numbah_email');
        const lpElement = document.querySelector('.numbah_lp');

        function getValue(element) {
            const value = element.textContent.trim();
            return parseInt(value.replace(/[^\d]/g, ''));
        }

        function startAnimation(element, endValue) {
            try {
                const options = {
                    useEasing: true,
                    useGrouping: true,
                    separator: '.',
                    decimal: ',',
                    duration: 2.5
                };
                
                if (!element || !(element instanceof HTMLElement) || isNaN(endValue) || endValue < 0) {
                    return;
                }
                
                const countUp = new CountUp(element, 0, endValue, 0, 2.5, options);
                if (!countUp.error) {
                    countUp.start();
                }
            } catch (error) {
            }
        }

        if (motionElement) {
            const motionValue = getValue(motionElement);
            if (motionValue > 0) {
                startAnimation(motionElement, motionValue);
            }
        }
        
        if (emailElement) {
            const emailValue = getValue(emailElement);
            if (emailValue > 0) {
                startAnimation(emailElement, emailValue);
            }
        }
        
        if (lpElement) {
            const lpValue = getValue(lpElement);
            if (lpValue > 0) {
                startAnimation(lpElement, lpValue);
            }
        }
    }

    if (languageSelector && Array.isArray(localizations)) {
        languageSelector.addEventListener('change', function() {
            const selectedLocale = this.value;
            if (selectedLocale === "pt-BR") {
                document.title = homeData.data.tagLine;
                document.querySelector('.logo').alt = homeData.data.tagLine;
                document.querySelector('.description').textContent = homeData.data.catchFrase;
                document.querySelector('.faleCom').textContent = homeData.data.faleCom;

                document.querySelector('.numbah_geral_txt').textContent = homeData.data.geralNumbahs;

                document.querySelector('.numbah_motion').textContent = homeData.data.totalHTML;
                document.querySelector('.numbah_motion_txt').textContent = homeData.data.totalHTML_txt;

                document.querySelector('.numbah_email').textContent = homeData.data.totalEmails;
                document.querySelector('.numbah_email_txt').textContent = homeData.data.totalEmails_txt;

                document.querySelector('.numbah_lp').textContent = homeData.data.totalLanding;
                document.querySelector('.numbah_lp_txt').textContent = homeData.data.totalLanding_txt;

                document.querySelector('.closeFrase').textContent = homeData.data.closeFrase;

            } else {
                const selectedLocalization = localizations.find(
                    loc => loc.locale === selectedLocale
                );
                if (selectedLocalization) {
                    document.title = selectedLocalization.tagLine;
                    document.querySelector('.logo').alt = selectedLocalization.tagLine;
                    document.querySelector('.description').textContent = selectedLocalization.catchFrase;
                    document.querySelector('.faleCom').textContent = selectedLocalization.faleCom;

                    document.querySelector('.numbah_geral_txt').textContent = selectedLocalization.geralNumbahs;

                    document.querySelector('.numbah_motion_txt').textContent = selectedLocalization.totalHTML_txt;

                    document.querySelector('.numbah_email_txt').textContent = selectedLocalization.totalEmails_txt;

                    document.querySelector('.numbah_lp_txt').textContent = selectedLocalization.totalLanding_txt;

                    document.querySelector('.closeFrase').textContent = selectedLocalization.closeFrase;
                }
            }

            setTimeout(reiniciarAnimacoes, 100);
        });
        
    } else {
        console.error('Localizations não definido ou não é um array');
    }
});
