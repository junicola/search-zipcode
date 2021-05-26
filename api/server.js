//requisitando dados da API ViaCEP
function getCEP(){
    var cep = document.getElementById('cep').value;
    let cacheName = 'cacheCPF'; 
    let url = `https://viacep.com.br/ws/${cep}/json/`;


    caches.open(cacheName).then( cache => {
        cache.add(url).then( () => {
            fetch(url)
            .then((response) => {
                response.json()
                .then(data => fillData(data))
            })
            .catch(error => {
                console.log('Erro: '+error.message);
            })
            console.log("Data cached ")
        });
    });
    
}

//preenchendo os campos do Resultado
function fillData(data){
    console.log(data);
    const municipio = document.getElementById('municipio');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    municipio.value = data.localidade;
    logradouro.value = data.logradouro;
    bairro.value = data.bairro;
}

//adicionando no banco de dados
