const iframeContainer = document.getElementById('iframeContainer');
const iframeFlutuante = document.getElementById('iframeFlutuante');

function toggleIframe() {

    if(iframeContainer.className === 'iframe-container-hidden' || iframeContainer.className === 'iframe-container-hide') {
        
        iframeFlutuante.style.display = 'block';
        iframeContainer.className =  'iframe-container-show'

    } else {

        iframeContainer.className =  'iframe-container-hide'

        const animation = setTimeout(() => {
            iframeFlutuante.style.display = 'none';
            iframeContainer.className =  'iframe-container-hidden'
        }, 1400);

        clearTimeout = animation
    }



}