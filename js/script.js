// Submit do form
document.querySelector('form.form-exec')
	.addEventListener("submit", result)

// Fechar container de resultado
document.querySelector('main span.btn.close')
	.addEventListener("click", () =>
		document.querySelector('main')
			.classList.toggle('hide')
	)

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

// Adicionar símbolo no textarea
for (let btn of document.querySelectorAll('.btn-code')) {
	const textarea = document.getElementById('exec')

	btn.addEventListener('click', () => {
		textarea.value += btn.innerText

		// após adicionar o símbolo, o focus vai para o textarea
		textarea.focus()
	})
}

function result(e) {
	e.preventDefault()

	let textarea = document.getElementById('exec').value

	// Eliminar espaços que tenha 2 ou mais espaços
	textarea = textarea.replace(/\s{2,}/g, " ")

	// caso o numero não seja 0 ou 1 e o textarea estiver vazio, vai gerar um aviso
	if (textarea.match(/[2-9]/gi)) {
		return alert('Somente o número 0 ou 1')
	} else if (textarea == '') {
		return alert("Digite antes de começar")
	}

	// Copiar o conteudo para gerar a formula
	let formula = textarea

	// Negação
	const denial = textarea.match(/~[0-1]/gi)

	if (denial) {
		denial.forEach(not => {
			const bool = Number(not.match(/0|1/)[0])

			// vai negar todos os numeros 0 e 1 com o simbolo de ~, transformando em boolean
			formula = formula.replace(/~[0-1]/, !bool)
		})
	}

	// Transforma os número 0 e 1 em boolean
	const nums = formula.match(/0|1/g)

	if (nums) {
		nums.forEach(num => {
			const bool = Number(num)

			formula = formula.replace(num, !!bool)
		})
	}

	// ~? que dizer que o ~ não é obrigatorio
	const parentheses = formula.match(/~?\(.+?\)/gi)

	if (parentheses) {
		parentheses.forEach(paren => {
			const bool = paren.match(/true|false/g)

			// quem estiver em parêntese vai ter executar primeiro
			let res = select(bool[0], bool[1], paren)

			// Se tiver um ~ do lado do parêntese ele vai negar o resultado
			if (paren.match('~')) {
				res = !res
			}

			formula = formula.replace(paren, res)
		})
	}

	let operation = formula.match(/(true|false).+?(true|false)/gi)

	// Vai executar as operação de dois em dois boolean
	while (operation) {
		operation.forEach(opera => {
			const bool = opera.match(/true|false/g)

			const res = select(bool[0], bool[1], opera)

			formula = formula.replace(opera, res)
		})

		// Se não teminar o resultado vai executar de novo
		operation = formula.match(/(true|false).+?(true|false)/gi)
	}

	return printResult(formula, textarea)
}

function printResult(formula, textarea) {
	// Mostrar resultado
	document.querySelector('main').classList.remove('hide')

	// Adicionar no historico
	newHistory(textarea)

	const div = document.querySelector('div.result-container')
	div.innerHTML = ''

	const h2 = document.createElement('h2')
	h2.innerText = `Resultado de '${textarea}':`

	const p = document.createElement('p')
	p.innerText = formula
	p.classList = 'result'

	div.appendChild(h2)
	div.appendChild(p)
}

function newHistory(textarea) {
	const history = document.querySelector('section.history')

	const date = new Date()

	const button = document.createElement('button')
	button.classList = 'backHistory btn'
	button.innerHTML = `Feito as ${date.getHours()}:${date.getMinutes()}`

	button.onclick = () => {
		let formula = document.getElementById('exec')
		formula.value = textarea

		// Fechar modal
		document.querySelector('div.modal-history')
			.classList.toggle('hide')
	}

	history.appendChild(button)
}

// para o símbolo →, se então
function ifThen(value1, value2) {
	if (value1 == 'false' && value2 == 'true') {
		return true
	} else if (value1 == 'true' && value2 == 'false') {
		return false
	} else {
		return true
	}
}

// Para o símbolo ∧, and
function andLogic(value1, value2) {
	return value1 == 'true' && value2 == 'true' ? true : false
}

// Para o símbolo v, no
function notLogic(value1, value2) {
	return value1 == 'true' || value2 == 'true' ? true : false
}

// Para o símbolo ↔, se somente se
function onlyLogic(value1, value2) {
	return value1 == value2 ? true : false
}

// vai selecionar de acordo com o símbolo da operação!
function select(value1, value2, regex) {
	if (regex.match('∧')) {

		return andLogic(value1, value2)

	} else if (regex.match('∨')) {

		return notLogic(value1, value2)

	} else if (regex.match('→')) {

		return ifThen(value1, value2)

	} else if (regex.match('↔')) {

		return onlyLogic(value1, value2)
	} else {
		return value1
	}
}
