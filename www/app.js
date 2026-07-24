
const links = document.querySelectorAll(".toc-item a");
links.forEach((link)=>{
    
    link.addEventListener("click",()=>{
        const hash = window.location.hash
        const active = document.querySelector(".toc-item a[href=\""+hash+"\"]")
        if(active) active.style.fontWeight = ""
        link.style.fontWeight = 'bold';
    })
})

links.forEach((link)=>{
    const hash = window.location.hash
    if( link.getAttribute("href") == hash ){
        link.style.fontWeight = 'bold';
        return;
    }
});


