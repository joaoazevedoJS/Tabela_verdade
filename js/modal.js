// Abir e fechar modal
for (let modal of document.querySelectorAll('.modal')) {
	// Modal.classList[1] está pegando a classe unica de cada modal!

	const openModal = `button.open-${modal.classList[1]}`

	const closeModal = `div.${modal.classList[1]} span.close`

	// Abir modal
	document.querySelector(openModal)
		.addEventListener("click", () => modal.classList.toggle('hide'))

	// fechar modal
	document.querySelector(closeModal)
		.addEventListener('click', () => modal.classList.toggle('hide'))
}
