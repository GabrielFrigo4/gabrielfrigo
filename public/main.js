const phrases = [
    "Programação de Baixo Nível",
    "Alta Performance em C/C++ e Rust",
    "Computação Gráfica e GPGPU",
    "Engenharia de Sistemas"
];

let i = 0;
let j = 0;
let isDeleting = false;

function loop() {
    const typewriter = document.getElementById('typewriter');
    const currentText = phrases[i].substring(0, j);
    
    typewriter.innerHTML = currentText + '<span style="border-right: 2px solid var(--accent); animation: blink 1s infinite;">&nbsp;</span>';

    let timeoutSpeed = 50 + Math.random() * 50; 

    if (isDeleting) {
        timeoutSpeed /= 2;
    }

    if (!isDeleting && j === phrases[i].length) {
        timeoutSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && j === 0) {
        isDeleting = false;
        i++;
        if (i === phrases.length) {
            i = 0;
        }
        timeoutSpeed = 500;
    }

    if (isDeleting && j > 0) {
        j--;
    } else if (!isDeleting && j < phrases[i].length) {
        j++;
    }

    setTimeout(loop, timeoutSpeed);
}

document.addEventListener('DOMContentLoaded', loop);
