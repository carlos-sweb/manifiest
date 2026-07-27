const links = document.querySelectorAll(".container-item a");
links.forEach((link)=>{
    
    link.addEventListener("click",()=>{
        const hash = window.location.hash
        const active = document.querySelector(".container-item a.active")
        if(active){
            active.style.fontWeight = ""
            active.classList.remove('active')
        }
        link.style.fontWeight = 'bold';
        link.classList.add('active')
    })
})

links.forEach((link)=>{
    const hash = window.location.hash
    if( link.getAttribute("href") == hash ){
        link.style.fontWeight = 'bold';
        link.classList.add('active')
        return;
    }
});