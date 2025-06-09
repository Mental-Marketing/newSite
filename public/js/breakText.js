const texts = document.getElementsByClassName('breakText')

const arr = [...texts]

arr.forEach(item => {
    console.log('AAA', item );
    text = item.innerHTML
    let textArr = text.split('&lt;br&gt;')
    item.innerHTML = `${textArr[0]} <br> ${textArr[1]}`
})



// console.log('AAAA', document.getElementsByClassName('breakText')[0].innerHTML); 

// const text = document.getElementsByClassName('breakText')[0].innerHTML

// let textArr = text.split('&lt;br&gt;')

// console.log('BBB', textArr);

// document.getElementsByClassName('breakText')[0].innerHTML = `${textArr[0]} <br> ${textArr[1]} `