const createTypewriter = (textElement, cursorElement, phrases) => {
	let phraseIndex = 0;
	let charIndex = 0;
	let isDeleting = false;

	const type = () => {
		const currentPhrase = phrases[phraseIndex];

		textElement.textContent = currentPhrase.substring(0, charIndex);

		let timeoutSpeed = isDeleting ? 40 : 80 + Math.random() * 40;

		if (!isDeleting && charIndex === currentPhrase.length) {
			cursorElement.classList.add("blinking");
			timeoutSpeed = 2000;
			isDeleting = true;
		} else if (isDeleting && charIndex === 0) {
			cursorElement.classList.remove("blinking");
			isDeleting = false;
			phraseIndex = (phraseIndex + 1) % phrases.length;
			timeoutSpeed = 500;
		} else {
			cursorElement.classList.remove("blinking");
		}

		isDeleting ? charIndex-- : charIndex++;

		setTimeout(type, timeoutSpeed);
	};

	type();
};

document.addEventListener("DOMContentLoaded", () => {
	const textElement = document.getElementById("typewriter-text");
	const cursorElement = document.getElementById("typewriter-cursor");
	const phrases = [
		"Programação de Baixo Nível",
		"Alta Performance em C/C++ e Rust",
		"Computação Gráfica e GPGPU",
		"Engenharia de Sistemas",
	];

	if (textElement && cursorElement) {
		createTypewriter(textElement, cursorElement, phrases);
	}
});
