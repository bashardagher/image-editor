const fileInput = document.querySelector(`.file-input`),
rotateOptions = document.querySelectorAll(`.rotate button`),
filterValue = document.querySelector(`.filter-info .value`),
filterSlider = document.querySelector(`.slider input`),
filterName = document.querySelector(`.filter-info .name`),
filterOptions = document.querySelectorAll(`.filter button`),
previewImg = document.querySelector(`.preview-img img`),
chooseImgBtn = document.querySelector(`.choose-img`),
resetImg = document.querySelector(`.reset-filter`),
saveImg = document.querySelector(`.save-img`);

let brightness=100,saturation=100,inversion=0,grayscale=0;
let rotate=0,flipH=1,flipV=1;

const applyFilters = ()=>{
    previewImg.style.transform = `scale(${flipH},${flipV}) rotate(${rotate}deg)`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
}

const loadImage = ()=>{
    let file = fileInput.files[0]
    if(!file) return;
    previewImg.style.backgroundImage = `none`
    previewImg.src = URL.createObjectURL(file);
    previewImg.addEventListener(`load`,()=>{
        resetImg.click();
        document.querySelector(`.container`).classList.remove(`disable`);
    })
}

filterOptions.forEach((op)=>{
    op.addEventListener(`click`,()=>{
        document.querySelector(`.filter .active`).classList.remove(`active`)
        op.classList.add(`active`);
        filterName.textContent = op.innerText
        if(op.id === `Brightness`){
            filterSlider.max = `200`;
            filterSlider.value=brightness
            filterValue.innerText=`${brightness}%`
        }else if(op.id === `Saturation`){
            filterSlider.max = `200`;
            filterSlider.value=saturation
            filterValue.innerText=`${saturation}%`
        }else if(op.id === `Inversion`){
            filterSlider.max = `100`;
            filterSlider.value=inversion
            filterValue.innerText=`${inversion}%`
        }else{
            filterSlider.max = `100`;
            filterSlider.value=grayscale
            filterValue.innerText=`${grayscale}%`
        }
    })
});
const updateFilter = ()=>{
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(`.filter .active`);
    if(selectedFilter.id === `Brightness` ){
        brightness= filterSlider.value
    }else if(selectedFilter.id === `Saturation`){
        saturation= filterSlider.value
    }else if(selectedFilter.id === `Inversion`){
        inversion= filterSlider.value
    }else{
        grayscale= filterSlider.value
    }
    applyFilters();
}

rotateOptions.forEach(op=>{
    op.addEventListener(`click`,()=>{
        if(op.id===`left`){
            rotate-=90;
        }else if(op.id===`right`){
            rotate+=90;
        }else if(op.id===`horizontal`){
            flipH = flipH === 1 ? -1 : 1;
        }else if(op.id===`vertical`){
            flipV = flipV === 1 ? -1 : 1;
        }
        applyFilters()
    })
});

const resetFilter = ()=>{
    rotate=0,flipH=1,flipV=1,brightness=100,saturation=100,inversion=0,grayscale=0;
    filterOptions[0].click();// to goBack to the first btn
    applyFilters()
}
const savePhoto = ()=>{
    const canvas = document.createElement(`canvas`);
    const ctx = canvas.getContext(`2d`);
    canvas.width = previewImg.naturalWidth;
    canvas.height = previewImg.naturalHeight;


    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvas.width/2,canvas.height/2)
    if(rotate!==0){
        ctx.rotate(rotate * Math.PI / 180)
    }
    ctx.scale(flipH,flipV)
    // `scale(${flipH},${flipV}) rotate(${rotate}deg)`;
    ctx.drawImage(previewImg,-canvas.width/2,-canvas.height/2,canvas.width,canvas.height);


    const link = document.createElement(`a`)
    link.download = `image.jpg`;
    link.href = canvas.toDataURL();
    link.click()

}

saveImg.addEventListener(`click`,savePhoto)
resetImg.addEventListener(`click`,resetFilter);
fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener(`input`, updateFilter);
chooseImgBtn.addEventListener('click',()=>fileInput.click());