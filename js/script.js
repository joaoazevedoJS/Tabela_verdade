document.querySelector('.btn-res')
  .addEventListener('click', result)

function result() {
  const select1 = document.getElementById('select1').value
  const select2 = document.getElementById('select2').value
  const select3 = document.getElementById('select3').value
  
  const tipo = document.getElementById('tipo').value

  let num1 = document.getElementById('num1').value.toLowerCase()
  let num2 = document.getElementById('num2').value.toLowerCase()
  
  let res;

  if(num1 != 'v' && num1 != 'f' || num2 != 'v' && num2 != 'f') {
    return alert("Digite somente 'V' ou 'F'")
  }


  if(select2 != 'Vazio') {
    num1 = negacao(num1)
  }
  
  if(select3 != 'Vazio') {
    num2 = negacao(num2)
  }

  if(tipo == "and") {
    num1 == 'v' && num2 == 'v' ? res = 'v' : res = 'f'
  } else if(tipo == 'or') {
    num1 == 'v' || num2 == 'v' ? res = 'v' : res = 'f'
  } else if(tipo == 'if') {
    if(num1 == 'v' && num2 == 'v') {
      res = 'v'
    } else if(num1 == 'v' && num2 == "f") {
      res = 'f'
    } else {
      res = 'v'
    }
  } else {
    num1 == num2 ? res = 'v' : res = 'f'
  }

  if(select1 != 'Vazio') {
    res = negacao(res)
  }

  imprimir(res)
}

function imprimir(res) {
  const result = document.querySelector('.result')
  result.innerHTML = ''
  result.style.background = "#ddd"
  
  const h2 = document.createElement('h2')
  h2.innerHTML = res.toUpperCase()

  result.appendChild(h2)
}

function negacao(num) {
  return num == 'v' ? num = 'f' : num = "v"
}