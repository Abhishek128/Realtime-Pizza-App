let addToCart = document.querySelectorAll('.add-to-cart')
import axios from 'axios'
import Noty from 'noty'
let cartCounter = document.querySelector('#cartCounter')

function updatecart(pizza){
    axios.post('/update-cart',pizza).then(res => {
        
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar : false , 
            text: "Item Added to Cart "
        }).show();
    }).catch(err => {
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar : false , 
            text: "Something Went Wrong "
        })
    })
}



addToCart.forEach((btn) =>{
    btn.addEventListener('click' , (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updatecart(pizza)
    })
})