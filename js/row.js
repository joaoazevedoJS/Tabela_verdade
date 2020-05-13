// Submit do form de newRows

document.querySelector('form.form-rows')
	.addEventListener("submit", newRow)

function newRow(e) {
	e.preventDefault()

	let rows = document.getElementById("newRow").value

	if(rows > 10) {
		alert('Você passou o limite, só 10 linhas Geradas!')
		rows = 10
	}
	const rowContainer = document.querySelector("section.rows-container")
	rowContainer.innerHTML = ''

	for (let i = 1; i <= rows; i++) {
		rowContainer.appendChild(createRow(i))
	}
}

function createRow(line) {
	const row = document.createElement('div')
	row.classList = "row-column"

	const id = document.createElement('p')
	id.innerText = `Linha ${line}`

	const rowP = document.createElement('input')
	rowP.classList = 'rowP'
	rowP.placeholder = "Valor de P"

	const rowQ = document.createElement('input')
	rowQ.classList = 'rowQ'
	rowQ.placeholder = "Valor de Q"

	const rowR = document.createElement('input')
	rowR.classList = 'rowR'
	rowR.placeholder = "Valor de R"

	row.appendChild(id)
	row.appendChild(rowP)
	row.appendChild(rowQ)
	row.appendChild(rowR)

	return row
}
