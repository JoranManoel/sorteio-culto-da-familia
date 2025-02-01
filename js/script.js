async function carregarPresencas() {
    try {
        let response = await fetch("127.0.0.1:80/a33/listar.php");
        let data = await response.json();
        
        if (data.success) {
            let nomes = data.presencas.map(p => `${p.id_casal};${p.nome};${p.nome_conjuge};${p.congregacao}`);
            
            // Verifica se há casais para o sorteio
            if (nomes.length === 0) {
                alert("Nenhuma presença registrada hoje! Cadastre as presenças antes do sorteio.");
            } else {
                console.log("Casais para o sorteio:", nomes);
                // Aqui você pode adicionar o código para iniciar o sorteio
            }
        } else {
            console.error("Erro ao carregar presenças:", data.message);
        }
    } catch (error) {
        console.error("Erro ao buscar presenças:", error);
    }
}

// Chama a função para carregar os nomes antes do sorteio
carregarPresencas();

//CÓDIGO DE SORTEIO
var esperar = false; //Aguarda o sorteio para quando apertar TAB ele não fique chamando a função

document.addEventListener("keydown", function(event) {
    if (event.key === "Tab") {
        if(esperar == false){
            sortear();
        }
    }
  });

function sortear() {
    var nome = document.getElementById("nome");
    var congregacao = document.getElementById("congregacao");
    var loader = document.getElementById("loader");
    var nomesChamadosList = document.getElementById("nomesChamados");

    esperar = true;

    if (nomes.length === 0) {
        esperar = false;
        nome.textContent = "FIM! 😢";
        congregacao.innerHTML = '';
        return;
    }

    //Faz o sorteio pelo indice da lista
    var indice = Math.floor(Math.random() * nomes.length);
    var nomeSorteado = nomes[indice];
    nomes.splice(indice, 1); // Remove o elemento sorteado do array

    //Implementar o tratamento de String da variável nomeSorteado para pegar o nome, nome do conjuge e congregação
    var splitNome = nomeSorteado.split(';');
    var congregacaoDoNomeSorteado = splitNome[3];
    if(splitNome[2]!=""){
        nomeApresentado = splitNome[1]+'<br><b style="color:var(--cor-primaria);">&</b><br>'+splitNome[2];
    }else{
        nomeApresentado = splitNome[1];
    }

    // Cria o loader----------------------------|
    var loading = document.createElement('div');
    loading.classList.add('custom-loader');
    nome.innerHTML = '';// Limpa a tela
    congregacao.innerHTML = 'Sorteando...';
    loader.append(loading);

    // Código que será executado após 3 segundos
    setTimeout(function() {
        loader.innerHTML = ''; // Limpa a tela do sorteio
        nome.innerHTML = nomeApresentado; // Adiciona o nome sortiado para ser mostrado na tela
        congregacao.innerHTML = "<b style='color:var(--cor-secundaria);'>" + congregacaoDoNomeSorteado + "</b>"; // Adiciona a congregação do nome sortiado para ser mostrado na tela

        // Adiciona o nome na lista de nomes chamados
        var novoLi = document.createElement("li");
        novoLi.className = "pessoa";
        function removeBRFromString(inputString) {
            // Verifica se a string contém o elemento '<br>'
            if (inputString.includes('<br>')) {
              // Utiliza o método 'replace' para remover o elemento '<br>'
              // O primeiro argumento é o padrão a ser substituído (no caso, '<br>')
              // O segundo argumento é o valor de substituição, neste caso, uma string vazia para removê-lo
              inputString = inputString.replace(/<br>/gi, ' ');
            }
          
            return inputString;
          }
        var nomeFormatado = removeBRFromString(nomeApresentado);

        // Adiciona classe para os itens existentes e define atraso de animação
        var items = document.querySelectorAll(".pessoa");
        items.forEach(function(item, index) {
            item.style.transitionDelay = (0.9) + "s";
            item.classList.add("shift-down");
            nomesChamadosList.classList.add("shift-down");
        });
        novoLi.classList.add("fade-in");//adiciona classe de animação 

        //Adiciona na ordem do ultimo nome sorteado no topo da lista 
        nomesChamadosList.insertBefore(novoLi, nomesChamadosList.firstChild); 

        novoLi.innerHTML = "<h3>" + nomeFormatado + "</h3><b style='color:white;'>" + congregacaoDoNomeSorteado + "</b>";

        esperar = false;
        
    },1000);
}

