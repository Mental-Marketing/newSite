const texts = document.getElementsByClassName('breakText')

const arr = [...texts]

arr.forEach(item => {
    text = item.innerHTML
    let textArr = text.split('&lt;br&gt;')
    item.innerHTML = `${textArr[0]} <br> ${textArr[1]}`
})
