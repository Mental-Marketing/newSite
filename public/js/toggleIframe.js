function toggleIframe() {
        var iframe = document.querySelector('.iframe-flutuante');

        if (iframe.style.display === 'none' || iframe.style.display === '') {
            iframe.style.display = 'block';
        } else {
            iframe.style.display = 'none';
        }
    }
