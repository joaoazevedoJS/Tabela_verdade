// Submit do form de formula
document.querySelector('form.form-exec')
	.addEventListener("submit", newFormula)

// Adicionar símbolo no textarea
for (let btn of document.querySelectorAll('.btn-code')) {
	const textarea = document.getElementById('exec')

	btn.addEventListener('click', () => {
		textarea.value += btn.innerText

		// após adicionar o símbolo, o focus vai para o textarea
		textarea.focus()
	})
}

function newFormula(e) {
	e.preventDefault()

	let textarea = document.getElementById('exec').value

	// Eliminar espaços que tenha 2 ou mais espaços
	textarea = textarea.replace(/\s{2,}/g, " ")

	// caso o numero não seja 0 ou 1 e o textarea estiver vazio, vai gerar um aviso
	if (textarea == '') {
		return alert("Digite antes de começar (Não esqueça de adicionar uma linha na aba ao lado)")
	}

	const rows = document.querySelectorAll('div.row-column')

	// vai receber um array com todos os resultados
	const formulas = loopInRows(rows, textarea)

	const container = document.querySelector('section.allResult')
	container.innerHTML = ''

	for (let i in formulas) {
		// adicionar o resultado
		printResult(result(formulas[i]), i)
	}

	// Adicionar no historico
	newHistory(textarea)

	// Mostrar modal de resultado
	document.querySelector('div.modal-result').classList.remove('hide')
}

// vai fazer um loop em cada linha
function loopInRows(rows, textarea) {
	const formulas = []
	let index = 0;

	for (let row of rows) {
		let formula = textarea;

		const rowP = document.querySelectorAll('input.rowP')[index].value
		const rowQ = document.querySelectorAll('input.rowQ')[index].value
		const rowR = document.querySelectorAll('input.rowR')[index].value

		formula = transformInNumber(rowP, 'P', formula)
		formula = transformInNumber(rowQ, 'Q', formula)
		formula = transformInNumber(rowR, 'R', formula)

		// se o resultado for igual o inicial, ele não vai adicionar no array! (para evitar bug)
		if (formula != textarea) {
			formulas.push(formula)
		}

		index++
	}

	return formulas
}

function transformInNumber(value, word, textarea) {
	// procurar todas as letras que vier como param
	const regex = new RegExp(`\\b${word}\\b`, 'gi')

	// Tirar todos os espaços, isso vai evitar bugs
	value = value.replace(/\s{0,}/g, '')

	// se não tiver um resultado ele vai enviar um resposta igual, não adicionando no array
	let formula = textarea

	if (value == 'V' || value == "v") {
		formula = textarea.replace(regex, '1')
	} else if (value == 'F' || value == "f") {
		formula = textarea.replace(regex, '0')
	}

	return formula
}

function result(formula) {
	// Negação
	const denial = formula.match(/~(0|1)/gi)

	if (denial) {
		denial.forEach(not => {
			const bool = Number(not.match(/0|1/)[0])

			// vai negar todos os numeros 0 e 1 com o simbolo de ~, transformando em boolean
			formula = formula.replace(/~(0|1)/, !bool)
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

	return formula
}

function printResult(result, line) {
	line = Number(line) + 1

	const container = document.querySelector('section.allResult')

	const row = document.createElement('div')
	row.classList = 'row-result'

	const p1 = document.createElement('p')
	p1.innerText = `Linha ${line}:`

	const p2 = document.createElement('p')
	p2.innerText = result
	p2.classList = 'result'

	row.appendChild(p1)
	row.appendChild(p2)

	container.appendChild(row)
}

function newHistory(textarea) {
	const history = document.querySelector('section.history')

	const date = new Date()

	const button = document.createElement('button')
	button.classList = 'backHistory btn'
	button.innerHTML = `Feito as ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

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

	} else if (regex.match('∨') || regex.match('ⴸ')) {

		return notLogic(value1, value2)

	} else if (regex.match('→')) {

		return ifThen(value1, value2)

	} else if (regex.match('↔')) {

		return onlyLogic(value1, value2)
	} else {
		return value1
	}
}
