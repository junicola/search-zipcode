// configuração do firebase
var firebaseConfig = {
    //adicione aqui informações da sua conta firebase
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };


// inicializar firebase
firebase.initializeApp(firebaseConfig);
var cepRef = firebase.database().ref('cep');


//requisitando CEP
function getCEP() {
    var cep = document.getElementById('cep').value;
    let cacheName = 'cacheCPF';
    let url = `https://viacep.com.br/ws/${cep}/json/`;
    const validarCep = /^[0-9]{8}$/;
    var flag = false;
    
    if(!validarCep.test(cep)) {
        document.getElementById('error-message').classList.remove("hide");
        document.getElementById('error-message').classList.add("show");
        fillData("");
    } else {
        caches.open(cacheName).then(cache => {
            
            //verifica se já existe no BD o cep procurado
            cepRef.on("value", function(snapshot){
                snapshot.forEach(function(element){
                    if(cep == element.val().cep){
                        document.getElementById('error-message').classList.remove("show");
                        document.getElementById('error-message').classList.add("hide");
                        flag = true;
                        fillData(element.val());
                    } 
                })
                if(!flag) {
                    cache.add(url).then(() => {
                        fetch(url)
                        .then((response) => {
                            response.json()
                                .then(data => {
                                    if(data.erro){
                                        document.getElementById('error-message').classList.remove("hide");
                                        document.getElementById('error-message').classList.add("show");
                                        fillData("");
                                    } else {
                                        document.getElementById('error-message').classList.remove("show");
                                        document.getElementById('error-message').classList.add("hide");
                                        fillData(data);
                                        saveCep((data.cep).replace("-",""), data.logradouro, data.localidade, data.bairro);
                                    }
                                })
                        }).catch(function(error) {
                            return error;
                        })
                    });
                }
            })
    
            
        });
    }

}

//salvar cep no firebase
function saveCep(cep, logradouro, localidade, bairro){
    var newCepRef = cepRef.push();
    newCepRef.set({
        cep: cep,
        logradouro: logradouro,
        localidade: localidade,
        bairro: bairro
    })
}

//preenchendo os campos do Resultado
function fillData(data) {
    const municipio = document.getElementById('municipio');
    const logradouro = document.getElementById('logradouro');
    const bairro = document.getElementById('bairro');
    if(data==""){
        municipio.value = " ";
        logradouro.value = " ";
        bairro.value = " ";
    } else {
        municipio.value = data.localidade;
        logradouro.value = data.logradouro;
        bairro.value = data.bairro;
    }
}