// "isFirstLoad" item  in sessionStorage ?
if (!sessionStorage.getItem("isFirstLoad")) {
    //  !"isFirstLoad" item in sessionStorage
    sessionStorage.setItem("isFirstLoad", "true");

    const textElement = document.getElementById("text");
    const slotElement = document.getElementById("slot");
    const texts = [
        "workshops",
        "bootcamps",
        "contests","webinars"
    ];

    let textIndex = 0;

    function typeText(text, index = 0) {
        if (index < text.length) {
            textElement.innerHTML += text.charAt(index);
            setTimeout(() => typeText(text, index + 1), 25); //  typing speed 
        } else {
            // clear the text anim
            setTimeout(clearText, 400); //  delay before clearing 
        }
        
    }

    function clearText(index = textElement.innerHTML.length - 1) {
        if (index >= 0) {
            textElement.innerHTML = textElement.innerHTML.slice(0, -1);
            setTimeout(() => clearText(index - 1), 25); // clearing speed 
        } else {
            //move to the next text
            setTimeout(() => {
                textIndex = (textIndex + 1) % texts.length;
                typeText(texts[textIndex]);
            }, 400); // delay before typing the new text 
        }
    }

    // Start the anim with the first text
    typeText(texts[textIndex]);

   

    window.addEventListener('load', () => {
        setTimeout(() => {
            const loader = document.querySelector('.loader');
            loader.classList.add('hidden');
        }, 4000); // Delay 
    });
} else {
    // "isFirstLoad"  in sessionStorage, hide the preloader 
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
}