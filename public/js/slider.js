
let arrLogos = {...homeData.data.sliderLogos}
const BASE_URL = 'https://mentalmarketing.com.br/strapi';
const sliderDiv = document.getElementsByClassName('multiple-items')[0]

        
Object.values(arrLogos).map((item, i)=>{

    const itemDiv = document.createElement('div')
    itemDiv.setAttribute("class","brand")
    //itemDiv.setAttribute("id",item.name)
    //itemDiv.setAttribute("key", item.name)

    const itemImg = document.createElement('img')
    itemImg.setAttribute("class","brand_img")
    itemImg.setAttribute("src",BASE_URL+item.url)
    itemDiv.appendChild(itemImg)

    sliderDiv.appendChild(itemDiv)
})

$('.multiple-items').slick({
    centerMode: false,
    centerPadding: '60px',
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    infinite: true,
    loop: true,
    arrows: false,
    slidesToShow: 3,
    responsive: [
        {
        breakpoint: 768,
        settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '20px',
            slidesToShow: 3
        }
        },
        {
        breakpoint: 480,
        settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '10px',
            slidesToShow: 3
        }
        }
    ]
});