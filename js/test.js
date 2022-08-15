function modeTheme(){
    console.log("тема");
    const toggleButton = document.querySelector('.dark-light');
    const colors = document.querySelectorAll('.color');

    colors.forEach(color => {
    color.addEventListener('click', (e) => {
        colors.forEach(c => c.classList.remove('selected'));
        const theme = color.getAttribute('data-color');
        document.body.setAttribute('data-theme', theme);
        color.classList.add('selected');
    });
    });

    toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    });


    // меню мобайл
    const menu = document.querySelector('.menu');
    menu.addEventListener('click', () => {
    
        var dialogs_list = document.querySelector('.conversation-area');
        if (dialogs_list.style.display==="none")
        {
            dialogs_list.style.display="block";
            dialogs_list.style.width="inherit";
        }
        else
        {
            dialogs_list.style.display="none";
        }
        
        
    
    });
}

