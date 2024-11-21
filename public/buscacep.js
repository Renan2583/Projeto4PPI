(function(){ 
  const cep = document.querySelector("input[name=cep]");
  const rua = document.querySelector("input[name=rua]");
  const bairro = document.querySelector("input[name=bairro]");
  const cidade = document.querySelector("input[name=cidade]");
  const estado = document.querySelector("input[name=estado]");
  const errorMessage = document.createElement('p'); // Cria um elemento para a mensagem de erro
  errorMessage.style.color = 'red'; // Estilo da mensagem de erro
  cep.parentNode.appendChild(errorMessage); // Adiciona a mensagem de erro logo abaixo do campo CEP

  cep.addEventListener('blur', e => {
      const value = cep.value.replace(/[^0-9]+/, ''); // Remove caracteres não numéricos
      if (value.length !== 8) { // Verifica se o CEP tem o tamanho correto (8 caracteres)
          errorMessage.textContent = 'CEP inválido. Por favor, insira um CEP válido.';
          rua.value = '';
          bairro.value = '';
          cidade.value = '';
          estado.value = '';
          return; // Sai da função se o CEP for inválido
      }

      const url = `https://viacep.com.br/ws/${value}/json/`;

      fetch(url)
          .then(response => response.json())
          .then(json => {
              if (json.erro) { // Se a API retornar um erro, exibe a mensagem
                  errorMessage.textContent = 'CEP não encontrado. Verifique o número do CEP.';
                  rua.value = '';
                  bairro.value = '';
                  cidade.value = '';
                  estado.value = '';
              } else {
                  // Preenche os campos com as informações do CEP
                  errorMessage.textContent = ''; // Limpa a mensagem de erro
                  rua.value = json.logradouro;
                  bairro.value = json.bairro;
                  cidade.value = json.localidade;
                  estado.value = json.uf;
              }
          })
  });
})();

