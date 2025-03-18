$(document).ready(function(){



    var eligibilidadealertada = false;

    // console.log("eligibilidadealertada: "+eligibilidadealertada);



    // Verifica se a pÃ¡gina foi carregada com a hashtag #simulador

    if (window.location.hash === '#simulador') {

        $(".plano_familia-simutalion-modal").css("display", "flex");

    }



    // MÃ¡scaras

    $("#birthday").mask('00/00/0000');

    $("#phone").mask('(00) 00000-0000');

    $('#valor').mask("#.##0,00", {reverse: true});

    //$('#idadeaposentadoria').mask('00');

    $('#tempoinvestimento').mask('00');

    $('#valoraporte').mask("#.##0,00", {reverse: true});

    $('#prazorecebimento').mask('00');

    $("#cpftitular").mask('000.000.000-00');

    // valida etapa 1

    $("#comecar").click(function(){



        if($("#nometitular").val().trim() === ''){ alert('O nome do titular precisa ser preenchido'); return false; };

        if($("#birthday").val().trim() === ''){ alert('A data de nascimento precisa ser preenchida'); return false; };

        if(!checkBRDate($("#birthday").val() )){ alert('Você precisa digitar uma data vÃ¡lida para prosseguir'); return false; };

        if($("#nomecontato").val().trim() === ''){ alert('O nome do contato precisa ser preenchido'); return false; };

        if($("#phone").val().trim() === '' && $("#email").val().trim() === '' ){ alert('Você precisa fornecer telefone ou email para prosseguir'); return false; };

        if($("#phone").val().trim() != '' && !checkTelefone($("#phone").val() )){ alert('Você precisa digitar um telefone vÃ¡lido'); return false; };

        if($("#email").val().trim() != '' && !checkEmail($("#email").val() )){ alert('Você precisa digitar um email vÃ¡lido'); return false; };

        if ($("#cpftitular").val().trim() === '') {
            alert('O CPF do titular precisa ser preenchido');
            return false;
        };

        if ($("#cpftitular").val().trim() !== '' && !checkCPF($("#cpftitular").val())) {
            alert('Você precisa digitar um CPF válido');
            return false;
        };

        //console.log('valid');

        $(".modal-slide-04").css("display", "none");

        $(".modal-slide-05").css("display", "flex");



    });

    function checkCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Verifica se tem 11 dígitos e não é uma sequência repetida

        let soma = 0, resto;
        for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[9])) return false;

        soma = 0;
        for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf[10])) return false;

        return true;
    }


    // etapa 2

    $("#calcular").click(function(){



        // setup

        var taxacdi = 0.000987;

        var taxapoupanca = 0.00059;

        var taxadejurosbruta = 0.0575;

        var taxaadmplanofamilia = 0.0075;

        var taxaadmmensalmercado = 0.01;

        var limite = 1376;



        // validaÃ§Ã£o

        if($("#opcao").val().trim() === ''){ alert('Você precisa escolher uma opção'); return false; };

        if($("#valor").val().trim() === ''){ alert('Você precisa escolher um valor'); return false; };

        if( parsePotentiallyGroupedFloat($("#valor").val()) < 100 ){ alert('O valor de contribuição mínimo é R$ 100,00'); return false; };

        // if($("#idadeaposentadoria").val().trim() === ''){ alert('Você precisa escolher uma idade para aposentadoria'); return false; };

        // if($("#idadeaposentadoria").val()< 50 ){ alert('A idade mÃ­nima para aposentadoria Ã© de 50 anos'); return false; };

        if($("#tempoinvestimento").val().trim() === ''){ alert('Você precisa escolher um tempo de investimento'); return false; };

        if($("#tempoinvestimento").val()< 1 ){ alert('O tempo de investimento mínimo Ã© de um ano'); return false; };

        if($("#prazorecebimento").val().trim() === ''){ alert('Você precisa escolher um prazo para recebimento'); return false; };

        if($("#prazorecebimento").val()< 5 ){ alert('O prazo mínimo para recebimento Ã© de 5 anos'); return false; };

        if($("#prazorecebimento").val()> 50 ){ alert('O prazo mÃ¡ximo para recebimento Ã© de 50 anos'); return false; };

        if($("#desejaaumentar").val().trim() === ''){ alert('Você precisa escolher uma opção em relação a aportes'); return false; };

        if($("#desejaaumentar").val() != '0' && $("#valoraporte").val().trim() === ''){ alert('Você Não declarou um valor de aporte'); return false; };

       

        if(!verificaElegibilidade($("#birthday").val(),$("#tempoinvestimento").val())) { return false; }





        var somabeneficiotemporario = parseInt($("#prazobeneficiotemporario").val()) + parseInt($("#tempoderecebimento").val());

        //console.log("tempoinvestimento:"+$("#tempoinvestimento").val());

        //console.log("prazobeneficiotemporario:"+parseInt($("#prazobeneficiotemporario").val()));

        //console.log("tempoderecebimento:"+parseInt($("#tempoderecebimento").val()));

        //console.log("somabeneficiotemporario:"+somabeneficiotemporario);

        if($("#tempoinvestimento").val() < somabeneficiotemporario ){

            alert('O tempo de investimento precisa necessariamente ser maior do que a soma de prazo para benefÃ­cio temporário + tempo de recebimento do benefÃ­cio temporário.');

            $("#prazobeneficiotemporario").val($("#prazobeneficiotemporario option:first").val());

            $("#tempoderecebimento").val($("#tempoderecebimento option:first").val());

            return false;

        }



        verificaPrazoBeneficioTemporario();



        // regra de beneficio temporario pra quem tem 50+

        if(idadeatual> 50){

            $("#containerbeneficiotemporario").hide();

        } else{

            $("#containerbeneficiotemporario").show();

        }



        //setup dos dados de input

        var nometitular = $("#nometitular").val();

        //console.log("nometitular:"+nometitular);



        var nomecontato = $("#nomecontato").val();

        //console.log("nomecontato:"+nomecontato);



        var datanascimento = $("#birthday").val();

        //console.log("birthday:"+datanascimento);



        var telefone = $("#phone").val().replace(/[^0-9]/gi, '');

        //console.log("phone:"+telefone);



        var email = $("#email").val();

        //console.log("email:"+email);



        var opcao = $("#opcao").val();

        //console.log("opcao:"+opcao);



        var valormeta = parsePotentiallyGroupedFloat($("#valor").val());  

       //console.log("valor:"+valormeta);



        // var idadeaposentadoria = $("#idadeaposentadoria").val();

        // console.log("idadeaposentadoria:"+idadeaposentadoria);



        var tempoinvestimento = $("#tempoinvestimento").val();

        //console.log("tempoinvestimento:"+tempoinvestimento);



        var desejaaumentar = $("#desejaaumentar").val();

        //console.log("desejaaumentar:"+desejaaumentar);



        var prazorecebimento = $("#prazorecebimento").val();

        //console.log("prazorecebimento:"+prazorecebimento);



        var valoraporteform = parsePotentiallyGroupedFloat($("#valoraporte").val());

        //console.log("valoraporte:"+valoraporteform);







        var prazoresgate = $("#prazoresgate").val();

        //console.log("prazoresgate:"+prazoresgate);



        var prazobeneficiotemporario = $("#prazobeneficiotemporario").val();

        //console.log("prazobeneficiotemporario:"+prazobeneficiotemporario);



        var percentualdesaque = $("#percentualdesaque").val()/100;

        //console.log("percentualdesaque:"+percentualdesaque);

       

        var tempoderecebimento = $("#tempoderecebimento").val();

        //console.log("tempoderecebimento:"+tempoderecebimento);

       

        var mesesparafim = (parseInt(tempoinvestimento) + parseInt(prazorecebimento))*12;

        //console.log("mesesparafim:"+mesesparafim);



        var resgatou = false;







   

        var resgateglobal;

        var saldobeneficiotemporarioglobal;

        var saldoacumuladocalculadoglobal;



        //calculos primÃ¡rios

        var iniciobeneficiotemporario = prazobeneficiotemporario*12;

        if(prazobeneficiotemporario>0 && percentualdesaque >0 && tempoderecebimento > 0){

            iniciobeneficiotemporario = prazobeneficiotemporario*12;

        } else {

            iniciobeneficiotemporario = 0;

        }

        //console.log("iniciobeneficiotemporario:"+iniciobeneficiotemporario);



        var prazobeneficiotemporariomeses = tempoderecebimento*12;

        //console.log("prazobeneficiotemporariomeses:"+prazobeneficiotemporariomeses);









        var taxajurosliquidamercado = taxadejurosbruta-taxaadmmensalmercado;

        //console.log("taxajurosliquidamercado:"+taxajurosliquidamercado);

       

        var taxajurosmensalmercado =(1+taxajurosliquidamercado)**(1/12)-1;

        //console.log("taxajurosmensalmercado:"+taxajurosmensalmercado);



        var frequenciaaporte = desejaaumentar;

        //console.log("frequenciaaporte:"+frequenciaaporte);



        var valoraporte;

        if(frequenciaaporte>=0){

            valoraporte = valoraporteform;

        }else{

            valoraporte = 0;

        }

       // console.log("valoraporte:"+valoraporte);  



        var idadeatual = calcularNumeroDeMesesAteAtual(datanascimento);

        //console.log("idadeatual:"+idadeatual);



        // var prazocontribuicao = (idadeaposentadoria*12)-idadeatual;

        // console.log("prazocontribuicao:"+prazocontribuicao);



        var prazoacumulacao = tempoinvestimento*12;

        //console.log("prazoacumulacao:"+prazoacumulacao);









        var tipocalculo = opcao;

        //console.log("opcao:"+opcao);



        var taxajurosplanofamilia = taxadejurosbruta-taxaadmplanofamilia;

        //console.log("taxajurosplanofamilia:"+taxajurosplanofamilia);



        var taxadejurosmensalplanofamilia =(1+taxajurosplanofamilia)**(1/12)-1;

        //console.log("taxadejurosmensalplanofamilia:"+taxadejurosmensalplanofamilia);



        var vpunitariobeneficiotemporario = PV(taxadejurosmensalplanofamilia,prazobeneficiotemporariomeses,-1,0);



        var valorbeneficiotemporario = 0;

        // if(prazobeneficiotemporario>0) {    

        //     var valorbeneficiotemporario = saldobeneficiotemporario/vpunitariobeneficiotemporario;

        // }

        // console.log("valorbeneficiotemporario:"+valorbeneficiotemporario);

       







        var vpubeneficio = PV(taxadejurosmensalplanofamilia,(prazorecebimento*12),-1,0);

        console.log("vpubeneficio:"+vpubeneficio);



        var aportes =[];

        for (let i = 1; i <= limite; i++) {



            var fase;

            if(i <= prazoacumulacao){ //checar

                fase = 'C';

            } else{

                if(i<=(prazoacumulacao+prazorecebimento*12)){ //checar

                    fase = 'B';

                } else{

                    fase = '-';

                }

            }



            var aporte;

            if(desejaaumentar=="unico"){

                if(i==1){

                    aporte = valoraporteform;

                } else {

                    aporte = 0;

                }

            aportes.push(aporte);

            }else if(desejaaumentar=="0"){

                aporte = 0;

                aportes.push(aporte);

            }else {

                if(fase == 'C'){

                    if(i==1){

                        aporte = valoraporte;

                    } else{

                        if ((i-1) % frequenciaaporte === 0) {

                            aporte = valoraporte;

                        }else {

                            aporte = 0;

                        }

                    }

                    aportes.push(aporte);

                }

            }

        }          

//        console.log(aportes);



        var vfaporte;

        var vfaporte = calcularNPV(taxadejurosmensalplanofamilia,aportes)*(1+taxadejurosmensalplanofamilia)**prazoacumulacao; //checar

        //console.log("vfaporte:"+vfaporte);



        var vpucontribuicao;

        vpucontribuicao = FV(taxadejurosmensalplanofamilia,prazoacumulacao,-1,0);

        vpucontribuicao = vpucontribuicao.toFixed(2);

        console.log("vpucontribuicao:"+vpucontribuicao);

       

        var valorbeneficiocalculado;

        var valorcontribuicaocalculada;

        var valorcontribuicaocalculadainicial;



        if(tipocalculo=="B"){

            valorbeneficiocalculado = valormeta;

            valorcontribuicaocalculada = (valorbeneficiocalculado*vpubeneficio-vfaporte)/vpucontribuicao;



            valorcontribuicaocalculadainicial =  (valorbeneficiocalculado*vpubeneficio-vfaporte)/vpucontribuicao;;

        }else{ // tipo C

            valorcontribuicaocalculada = valormeta;

            valorbeneficiocalculado = (vpucontribuicao*valorcontribuicaocalculada+vfaporte)/vpubeneficio;

            //valorbeneficiocalculado = saldoacumuladocalculado/vpubeneficio;



            valorcontribuicaocalculadainicial = valormeta;

        }

       



        var valorbeneficio;

        if(tipocalculo=="B"){

            valorbeneficio=valormeta;

        } else {

            valorbeneficio=(vpucontribuicao*valorcontribuicaocalculada+vfaporte)/vpubeneficio;

        }





        // memÃ³ria de cÃ¡lculo

        var meses =[];

        for (let i = 1; i <= limite; i++) {





            var fase;

            if(i <= prazoacumulacao){ //checar

                fase = 'C';

            } else{

                if(i<=(prazoacumulacao+prazorecebimento*12)){ //checar

                    fase = 'B';

                } else{

                    fase = '-';

                }

            }





            var contribuicao;

            if(fase=="C"){

                contribuicao = valorcontribuicaocalculada;

            } else {

                contribuicao =0;

            }



            var aporte;

            if(desejaaumentar=="unico"){

                if(i==1){

                    aporte = valoraporteform;

                } else {

                    aporte = 0;

                }

            }else if(desejaaumentar=="0"){

                aporte = 0;

            }else {

                if(fase == 'C'){

                    if(i==1){

                        aporte = valoraporte;

                    } else{

                        if ((i-1) % frequenciaaporte === 0) {

                            aporte = valoraporte;

                        }else {

                            aporte = 0;

                        }

                    }

                } else{

                    aporte = 0;

                }

            }





            var beneficio;

            if(fase=="B") {

                beneficio = valorbeneficiorecalculado;

            }else {

                beneficio=0;

            }







            var saldoplanofamiliatemp;

            var lastsaldoplanofamilia = obterSaldoplanofamiliaUltimaLinha(meses);

            var lastsaldoplanofamiliatemp = obterSaldoplanofamiliaTempUltimaLinha(meses);

            saldoplanofamiliatemp =lastsaldoplanofamilia*(1+taxadejurosmensalplanofamilia)+contribuicao-beneficio+aporte;



            saldoplanofamiliatemp = (!isNaN(saldoplanofamiliatemp))?(saldoplanofamiliatemp):(0);



            // console.log("lastsaldoplanofamilia:"+lastsaldoplanofamilia);

            // console.log("taxadejurosmensalplanofamilia:"+taxadejurosmensalplanofamilia);

            // console.log("contribuicao:"+contribuicao);

            // console.log("beneficio:"+beneficio);

            // console.log("aporte:"+aporte);



            var resgate;

            var saldoacumuladocalculado2;

            var valorbeneficiorecalculado2;

            if(i==(prazoresgate*12)){

                //console.log('vou fazer o resgate! mÃªs'+i);

                resgate=saldoplanofamiliatemp;

                valorqueresgatou = resgate;

                 if(fase=="C"){

                    saldoacumuladocalculado2 = saldoplanofamiliatemp;

                    valorbeneficiorecalculado2 = saldoplanofamiliatemp/vpubeneficio;

                 }

                //resgatou = true;

            } else{

                resgate = 0;

            }

            resgateglobal = resgate;

         //   console.log("resgateglobal:"+resgateglobal);



            var beneficiotemporario;

            if(i>=iniciobeneficiotemporario && i<(iniciobeneficiotemporario+prazobeneficiotemporariomeses)){

                if(!valorbeneficiotemporario){

                    saldobeneficiotemporarioglobal = saldoplanofamiliatemp*percentualdesaque;

                    if(prazobeneficiotemporario>0) {  

                        //   console.log("saldobeneficiotemporarioglobal:"+saldobeneficiotemporarioglobal);

                        //   console.log("vpunitariobeneficiotemporario:"+vpunitariobeneficiotemporario);

                        var valorbeneficiotemporario = (saldobeneficiotemporarioglobal)/vpunitariobeneficiotemporario;

                    } else {

                        var valorbeneficiotemporario = 0;

                    }

                }

                beneficiotemporario = valorbeneficiotemporario;

            } else {

                beneficiotemporario=0;

            }



           



            var saldoplanofamilia;

            saldoplanofamilia =lastsaldoplanofamiliatemp*(1+taxadejurosmensalplanofamilia)+contribuicao-beneficio+aporte;

            saldoplanofamiliatemp = saldoplanofamilia-beneficiotemporario;

            saldoplanofamilia = (!isNaN(saldoplanofamilia))?(saldoplanofamilia):(0);

            saldoplanofamilia = (saldoplanofamilia>0)?(saldoplanofamilia):(0);

            saldoplanofamilia = saldoplanofamilia.toFixed(2);

            if(resgatou) { saldoplanofamilia = 0; }



            var saldoplanomercado;

            var lastsaldoplanomercado = obterSaldoplanomercadoUltimaLinha(meses);

            saldoplanomercado = lastsaldoplanomercado*(1+taxajurosmensalmercado)+contribuicao-beneficio+aporte-beneficiotemporario;

            saldoplanomercado = (!isNaN(saldoplanomercado))?(saldoplanomercado):(0);

            saldoplanomercado = (saldoplanomercado>0)?(saldoplanomercado):(0);

            if(resgatou) { saldoplanomercado = 0; }

           



            var saldocdi;

            var lastsaldocdi = obterSaldocdiUltimaLinha(meses);

            saldocdi = lastsaldocdi*(1+taxacdi)+contribuicao-beneficio+aporte-beneficiotemporario;

            saldocdi = (!isNaN(saldocdi))?(saldocdi):(0);

            saldocdi = (saldocdi>0)?(saldocdi):(0);

            if(resgatou) { saldocdi = 0; }



            var saldopoupanca;

            var lastsaldopoupanca = obterSaldopoupancaUltimaLinha(meses);

            saldopoupanca = lastsaldopoupanca*(1+taxapoupanca)+contribuicao-beneficio+aporte-beneficiotemporario;

            saldopoupanca = (!isNaN(saldopoupanca))?(saldopoupanca):(0);

            saldopoupanca = (saldopoupanca>0)?(saldopoupanca):(0);

            if(resgatou) { saldopoupanca = 0; }



            if(i==prazoacumulacao){

                saldoacumuladocalculadoglobal = (vfaporte+vpucontribuicao*valorcontribuicaocalculada)*0 + saldoplanofamilia;

                var valorbeneficiorecalculado = saldoacumuladocalculadoglobal/vpubeneficio;

                console.log('vou recalcular o beneficio');

                console.log("saldoacumuladocalculadoglobal:"+saldoacumuladocalculadoglobal);

                console.log("vpubeneficio:"+vpubeneficio);

                console.log("valorbeneficiorecalculado:"+valorbeneficiorecalculado);



                saldoplanofamiliamaximo = saldoplanofamilia;

            }



            meses.push({

                "mes":i,

                "fase":fase,

                "contribuicao":contribuicao,

                "aporte":aporte,

                "beneficio":beneficio,

                "saldoplanofamiliatemp":saldoplanofamiliatemp,

                "resgate":resgate,

                "beneficiotemporario":beneficiotemporario,

                "saldoplanofamilia":saldoplanofamilia,

                "saldoplanomercado":saldoplanomercado,

                "saldocdi":saldocdi,

                "saldopoupanca":saldopoupanca

            });

        }  

        var saldobeneficiotemporario = saldobeneficiotemporarioglobal;

        //console.log("saldobeneficiotemporario:"+saldobeneficiotemporario);





        // redefine

        var temp =(vfaporte+vpucontribuicao*valorcontribuicaocalculada)*0+saldoplanofamiliamaximo;



        if(tipocalculo=="B"){

            valorbeneficiocalculado = valormeta;

            valorcontribuicaocalculada = temp/vpucontribuicao;

        }else{ // tipo C

            valorcontribuicaocalculada = valormeta;

            valorbeneficiocalculado = temp/vpubeneficio;

            //valorbeneficiocalculado = saldoacumuladocalculado/vpubeneficio;

        }

        // console.log("vpubeneficio:"+vpubeneficio);

        // console.log("vpucontribuicao:"+vpucontribuicao);

        // console.log("valorcontribuicaocalculada:"+valorcontribuicaocalculada);

        // console.log("saldoacumuladocalculado:"+temp);

        // console.log("vfaporte:"+vfaporte);



        // console.log("valorbeneficiocalculado:"+valorbeneficiocalculado);





        console.log("meses:");

        console.log(meses);



        var valorresgate;

        if(prazoresgate>0){

            valorresgate = resgateglobal;

        } else{

            valorresgate = 0;

        }

//        console.log("valorresgate:"+valorresgate);



        var saldoacumuladocalculado;

        saldoacumuladocalculado = (vfaporte+vpucontribuicao*valorcontribuicaocalculada)*0 + saldoacumuladocalculadoglobal;

        //console.log("saldoacumuladocalculado:"+saldoacumuladocalculado);

       

        // verirfica se Ã© um resultado vÃ¡lido



        // if(!isNaN(valorcontribuicaocalculada)

        //     && !isNaN(saldoacumuladocalculado)

        //     && !isNaN(valorbeneficiocalculado)

        //     && valorcontribuicaocalculada > 0

        //     && saldoacumuladocalculado > 0

        //     && valorbeneficiocalculado > 0

        //     ){

               

            //output

            $("#result-investimentomensal").html(formatarMoedaBRL(valorcontribuicaocalculadainicial));

            $("#result-tempoinvestimento").html(tempoinvestimento+" anos");

            $("#result-aporteextra").html(formatarMoedaBRL(valoraporteform?valoraporteform:0));

            $("#result-saldoacumulado").html(formatarMoedaBRL(saldoacumuladocalculado>0?saldoacumuladocalculado:saldoacumuladocalculado2));

            $("#result-rendamensal").html(formatarMoedaBRL(valorbeneficiorecalculado>0?valorbeneficiorecalculado:valorbeneficiorecalculado2));

            // console.log("saldoacumuladocalculado2: "+saldoacumuladocalculado2);

            // console.log("valorbeneficiorecalculado2: "+valorbeneficiorecalculado2);

           

            $("#result-temporecebimento").html(prazorecebimento+" anos");



            if(prazoresgate>0){

                $("#prazoresgatevalor").html(formatarMoedaBRL((!isNaN(valorqueresgatou))?(valorqueresgatou):(0)));

            } else {

                $("#prazoresgatevalor").html("R$ -");

            }

            $("#prazobeneficiovalor").html(formatarMoedaBRL((!isNaN(valorbeneficiotemporario))?(valorbeneficiotemporario):(0)));



            //plota o grafico

            gerarGrafico(meses,mesesparafim);



            printaMeses(meses);



            // salva no CRM

            salvarContato();



            // esconde o botÃ£o

            //$(this).hide();

            $(".modal-slide-05-teste").css("display", "none");

            $(".modal-slide-06-teste").css("display", "flex");

        // } else{

        //     alert('Os parÃ¢metros fornecidos sÃ£o invÃ¡lidos. Por favor confira e refaÃ§a sua simulaÃ§Ã£o');

        // }



        // flw vlw

        return false;



    });



































    function checkEmail(email) {

        // ExpressÃ£o regular para validar o formato do e-mail

        var regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;



        // Verificar se o e-mail corresponde ao formato esperado

        if (regexEmail.test(email)) {

            return true;

        } else {

            return false;

        }

    }

   

    function checkTelefone(fone) {

        // Obter o valor do campo "telefone"

        var telefone = fone;



        // Remover caracteres Não numÃ©ricos

        var numeroLimpo = telefone.replace(/\D/g, '');



        // Verificar se o nÃºmero possui 11 dÃ­gitos (celular) ou 10 dÃ­gitos (fixo)

        if (numeroLimpo.length === 11 && numeroLimpo.charAt(2) === '9') {

            return true;

        } else if (numeroLimpo.length === 10) {

            return true;

        } else {

            return false;

        }

    }



    function checkBRDate(databr) {

        // Obter o valor do campo "birthday"

        var dataAniversario = databr;



        // Definir uma expressÃ£o regular para validar o formato dd/mm/yyyy

        var regexData = /^(\d{2})\/(\d{2})\/(\d{4})$/;



        // Verificar se a data corresponde ao formato esperado

        if (!regexData.test(dataAniversario)) {

            return false;

        }



        const zeroPad = (num, places) => String(num).padStart(places, '0');

       



        // Dividir a data em dia, mÃªs e ano

        var partesData = dataAniversario.split('/');

        var dia = parseInt(partesData[0], 10);

        var mes = parseInt(partesData[1], 10);

        var ano = parseInt(partesData[2], 10);

        var novadata = ano+"-"+zeroPad(mes,2)+"-"+zeroPad(dia,2)+" 00:00:00";

        //console.log(novadata);

       



        function dateIsValid(date) {

            //console.log(date);

            return date instanceof Date && !isNaN(date);

        }



        // Criar um objeto de data e verificar se Ã© vÃ¡lido

       

        if (!dateIsValid(new Date(novadata)) ) {

            return false;

        } else {

            return true;

        }

    }



    function formatarMoedaBRL(valor) {

    // Formata o nÃºmero para o formato de moeda BRL

    const formatoMoeda = new Intl.NumberFormat('pt-BR', {

        style: 'currency',

        currency: 'BRL'

    });



    // Retorna o valor formatado

    return formatoMoeda.format(valor);

    }





    function calcularNumeroDeMesesAteAtual(data) {

        // Converte a data do formato brasileiro para o formato internacional (yyyy-mm-dd)

        const partesData = data.split('/');

        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;



        // Cria objetos de data a partir da data formatada e da data atual

        const dataFornecida = new Date(dataFormatada);

        const dataAtual = new Date();



        // Calcula a diferenÃ§a em milissegundos entre as duas datas

        const diferencaEmMilissegundos = dataAtual - dataFornecida;



        // Converte a diferenÃ§a para meses

        const meses = diferencaEmMilissegundos / (1000 * 60 * 60 * 24 * 30.44);



        // Arredonda o resultado para o nÃºmero inteiro mais prÃ³ximo

        return Math.round(meses);

    }





    function print_r(obj, depth = 0) {

        const indent = '  '.repeat(depth);



        for (let key in obj) {

            if (obj.hasOwnProperty(key)) {

                const value = obj[key];



                if (typeof value === 'object') {

                    //console.log(`${indent}${key}:`);

                    print_r(value, depth + 1);

                } else {

                    //console.log(`${indent}${key}: ${value}`);

                }

            }

        }

    }

   

    // This function is from David Goodman's Javascript Bible.

    function conv_number(expr, decplaces) {

        var str = "" + Math.round(eval(expr) * Math.pow(10,decplaces));

        while (str.length <= decplaces) {

            str = "0" + str;

        }



        var decpoint = str.length - decplaces;

        return (str.substring(0,decpoint) + "." + str.substring(decpoint,str.length));

    }



    // Parameters are rate, total number of periods, payment made each period and future value

    function PV(rate, nper, pmt, fv) {

        rate = parseFloat(rate);

        nper = parseFloat(nper);

        pmt = parseFloat(pmt);

        fv = parseFloat(fv);

        if ( nper == 0 ) {

//            alert("Why do you want to test me with zeros?");

            return(0);      

        }

        if ( rate == 0 ) { // Interest rate is 0

            pv_value = -(fv + (pmt * nper));

        } else {

            x = Math.pow(1 + rate, -nper);

            y = Math.pow(1 + rate, nper);

            pv_value = - ( x * ( fv * rate - pmt + y * pmt )) / rate;

        }

        pv_value = conv_number(pv_value,2);

        return (pv_value);

    }



    function NPV(rate, cashFlows) {

        var npv = 0;



        for (var i = 0; i < cashFlows.length; i++) {

            npv += cashFlows[i] / Math.pow(rate / 100 + 1, i + 1);

        }



        return npv;

    }



   

    function FV(rate, nper, pmt, pv, type) {

        var pow = Math.pow(1 + rate, nper),

            fv;



        pv = pv || 0;

        type = type || 0;



        if (rate) {

            fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;

        } else {

            fv = -1 * (pv + pmt * nper);

        }

        return fv;

    }



    function parsePotentiallyGroupedFloat(stringValue) {

        stringValue = stringValue.trim();

        var result = stringValue.replace(/[^0-9]/g, '');

        if (/[,\.]\d{2}$/.test(stringValue)) {

            result = result.replace(/(\d{2})$/, '.$1');

        }

        return parseFloat(result);

    }



    function calcularNPV(taxaDesconto, fluxoDeCaixa) {

        if (!Array.isArray(fluxoDeCaixa) || fluxoDeCaixa.length === 0) {

            return "O fluxo de caixa deve ser uma matriz Não vazia.";

        }



        let npv = 0;

        for (let i = 0; i < fluxoDeCaixa.length; i++) {

            npv += fluxoDeCaixa[i] / Math.pow(1 + taxaDesconto, i);

            //console.log(npv)

        }



        return npv;

    }





    function obterSaldoplanofamiliaUltimaLinha(meses) {

        // Verifica se o array Não estÃ¡ vazio

        if (meses.length > 0) {

            // ObtÃ©m a Ãºltima linha do array

            const ultimaLinha = meses[meses.length - 1];



            // Verifica se a Ãºltima linha tem a propriedade "saldoplanofamilia"

            if (ultimaLinha.hasOwnProperty("saldoplanofamilia")) {

                // Retorna o valor da coluna "saldoplanofamilia"

                return ultimaLinha.saldoplanofamilia;

            } else {

                return 0;

            }

        } else {

            return 0;

        }



        // Retorna null em caso de erro

        return 0;

    }

   

    function obterSaldoplanofamiliaTempUltimaLinha(meses) {

        // Verifica se o array Não estÃ¡ vazio

        if (meses.length > 0) {

            // ObtÃ©m a Ãºltima linha do array

            const ultimaLinha = meses[meses.length - 1];



            // Verifica se a Ãºltima linha tem a propriedade "saldoplanofamilia"

            if (ultimaLinha.hasOwnProperty("saldoplanofamiliatemp")) {

                // Retorna o valor da coluna "saldoplanofamilia"

                return ultimaLinha.saldoplanofamiliatemp;

            } else {

                return 0;

            }

        } else {

            return 0;

        }



        // Retorna null em caso de erro

        return 0;

    }



    function obterSaldoplanomercadoUltimaLinha(meses) {

        // Verifica se o array Não estÃ¡ vazio

        if (meses.length > 0) {

            // ObtÃ©m a Ãºltima linha do array

            const ultimaLinha = meses[meses.length - 1];



            // Verifica se a Ãºltima linha tem a propriedade "saldoplanomercado"

            if (ultimaLinha.hasOwnProperty("saldoplanomercado")) {

                // Retorna o valor da coluna "saldoplanomercado"

                return ultimaLinha.saldoplanomercado;

            } else {

                return 0;

            }

        } else {

            return 0;

        }



        // Retorna null em caso de erro

        return 0;

    }



    function obterSaldocdiUltimaLinha(meses) {

        // Verifica se o array Não estÃ¡ vazio

        if (meses.length > 0) {

            // ObtÃ©m a Ãºltima linha do array

            const ultimaLinha = meses[meses.length - 1];



            // Verifica se a Ãºltima linha tem a propriedade "saldoplanomercado"

            if (ultimaLinha.hasOwnProperty("saldocdi")) {

                // Retorna o valor da coluna "saldoplanomercado"

                return ultimaLinha.saldocdi;

            } else {

                return 0;

            }

        } else {

            return 0;

        }



        // Retorna null em caso de erro

        return 0;

    }



    function obterSaldopoupancaUltimaLinha(meses) {

        // Verifica se o array Não estÃ¡ vazio

        if (meses.length > 0) {

            // ObtÃ©m a Ãºltima linha do array

            const ultimaLinha = meses[meses.length - 1];



            // Verifica se a Ãºltima linha tem a propriedade "saldoplanomercado"

            if (ultimaLinha.hasOwnProperty("saldopoupanca")) {

                // Retorna o valor da coluna "saldoplanomercado"

                return ultimaLinha.saldopoupanca;

            } else {

                return 0;

            }

        } else {

            return 0;

        }



        // Retorna null em caso de erro

        return 0;

    }



    function vpl(taxa, montantes){

        var ret = parseFloat(montantes[0]);



        for (var i=1; i<montantes.length; i++)

            ret += montantes[i] / Math.pow( (1.0 + taxa), i);

        return ret;

    }      



    function gerarGrafico(meses,limite){

        //console.log('grafico');



        let chartStatus = Chart.getChart("grafico"); // <canvas> id

        if (chartStatus != undefined) {

        chartStatus.destroy();

        }

     

        const ctx = document.getElementById('grafico');

       



        const labels = [];

        const dataset1 = [];

        const dataset2 = [];

        const dataset3 = [];

        const dataset4 = [];



        for (let i = 0; (i < meses.length && i <limite); i++) {

            labels.push(meses[i].mes);

            dataset1.push(Math.round(meses[i].saldoplanofamilia));

            dataset2.push(Math.round(meses[i].saldoplanomercado));

            dataset3.push(Math.round(meses[i].saldocdi));

            dataset4.push(Math.round(meses[i].saldopoupanca));



        }





        new Chart(ctx, {

        type: 'line',

        data: {

        labels: labels,

        datasets: [

            {label: 'Plano Família',

            data: dataset1,

            borderWidth: 1},

            {label: 'Mercado',

            data: dataset2,

            borderWidth: 1},

            {label: 'CDI',

            data: dataset3,

            borderWidth: 1},

            {label: 'Poupança',

            data: dataset4,

            borderWidth: 1},

        ]

        },

        options: {

            display:false,

            scales: {

               y: {

                    title: {

                        display: true,

                        text: 'Saldo acumulado (R$)'

                    }

                },

                x: {

                    title: {

                        display: true,

                        text: 'Meses'

                    }

                }

            }

        }

    });



    }



    function convertDate(dataBrasileira) {

    // Divide a string de data nas barras

    const partes = dataBrasileira.split('/');



    // Verifica se hÃ¡ trÃªs partes (dia, mÃªs, ano)

    if (partes.length === 3) {

        // Reorganiza as partes para o formato americano (ano-mÃªs-dia)

        const dataAmericana = `${partes[2]}-${partes[1]}-${partes[0]}`;

        return dataAmericana;

    } else {

        // Retorna null se a string de data Não estiver no formato esperado

        return null;

    }

    }



    function salvarContato(){

        //var url = "https://ici002.capef.com.br/apiplanof-dmz/"; //dev
        //var url = "https://localhost:7190/"; //local

        var url = "https://apiplanofamilia.capef.com.br/"; // prod

        // pegar o token

        const requestData = {

            username: "Hero99",

            password: "d7OwsEqTXc"

        };



        // ConfiguraÃ§Ã£o da solicitaÃ§Ã£o AJAX

        $.ajax({

            url: url+"auth/access-token",

            type: "POST",

            contentType: "application/json",

            data: JSON.stringify(requestData),

            success: function(response) {

                // Sucesso na solicitaÃ§Ã£o

                const token = response.access_Token;

                //console.log("Token recebido");



                // vamos salvar o dado...

                // pego os dados

                var datanascimento = convertDate($("#birthday").val());

                var nometitular = $("#nometitular").val();

                var nomecontato = $("#nomecontato").val();

                var telefone = $("#phone").val().replace(/[^0-9]/gi, '');

                var email = $("#email").val();

                var cpftitular = $("#cpftitular").val().replace(/[^0-9]/g, '');

                // monto o dataset

                const requestData = {

                    "nomeTitular": nometitular,

                    "nomeContato": nomecontato,

                    "dataNascimento": datanascimento,

                    "telefone": telefone,

                    "email": email,

                    "cpfTitular": cpftitular

                };



                // incluo

                $.ajax({

                    url: url+"acesso-simulador/capef",

                    type: "POST",

                    contentType: "application/json",

                    headers: {

                        "Authorization": "Bearer " + token

                    },

                    data: JSON.stringify(requestData),

                        success: function(response) {

                        // Sucesso na solicitaÃ§Ã£o

                        const id = response.id; // Extrai o ID do JSON de resposta

                        //console.log("ID recebido:", id);

                    },

                        error: function(jqXHR, textStatus, errorThrown) {

                        // Erro na solicitaÃ§Ã£o

                        //console.error("Erro na solicitaÃ§Ã£o:", textStatus, errorThrown);

                    }

                });







            },

            error: function(jqXHR, textStatus, errorThrown) {

                // Erro na solicitaÃ§Ã£o

                //console.error("Erro na solicitaÃ§Ã£o:", textStatus, errorThrown);

            }

        });



    }







    function verificarCampoDesejado(valor) {

        if (valor === "unico" || valor === "1" || valor === "3" || valor === "6") {

          $("#valoraporte").show();

        } else {

          $("#valoraporte").hide();

        }

      }



      // Evento de mudanÃ§a no campo desejaaumentar

      $("#desejaaumentar").on("change", function() {

        var valorSelecionado = $(this).val();

        verificarCampoDesejado(valorSelecionado);

      });



      // Verificar o estado inicial ao carregar a pÃ¡gina

      verificarCampoDesejado($("#desejaaumentar").val());



    $(".familia-pular").click(function(){

        $(".modal-slide-01-teste").hide();

        $(".modal-slide-02-teste").hide();

        $(".modal-slide-03-teste").hide();

        $(".modal-slide-04-teste").css('display', 'flex');

    });



    function vlookup(needle, haystack, keyIndex) {

       return haystack.find(row => row[keyIndex] === needle);

    }



    $("#prazoresgate").change(function(){

        $("#calcular").click();

    });

    $("#prazobeneficiotemporario").change(function(){

        $("#calcular").click();

    });

    $("#percentualdesaque").change(function(){

        $("#calcular").click();

    });

    $("#tempoderecebimento").change(function(){

        $("#calcular").click();

    });



    $("#prazobeneficiotemporario").change(function(){

        trataPercentualdeSaque();

    });



    function verificaElegibilidade(dataNascimento,tempoInvestimento) {

       

        if(!eligibilidadealertada){



            var dateParts = dataNascimento.split("/");

            var dataNasc = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

            const dataAtual = new Date();

           



           

            const diferencaTempo = Math.abs(dataAtual - dataNasc);

           

            const anos = Math.floor(diferencaTempo / (31557600000));

           

            var soma = parseInt(anos) + parseInt(tempoInvestimento);



            if(soma < 50){

                eligibilidadealertada = true;

                return confirm('A regra de elegibilidade para recebimento de renda mensal de aposentadoria  de no mínimo 50 anos de idade e 12 meses de contribuição ao Plano. Deseja prosseguir mesmo assim?');

            } else {

                return true;

            }

        } else {

            return true;



        }



        //console.log('--fim elegibilidade --');



    }



    $("#birthday").change(function(){

        eligibilidadealertada = false;

    });

    $("#tempoinvestimento").change(function(){

        eligibilidadealertada = false;

    });



    $("#voltarfinal").click(function(){

        $("#prazoresgate").val('');

        $("#prazobeneficiotemporario").val('');

        $("#percentualdesaque").val('');

        $("#tempoderecebimento").val('');

    });



    $("#tempoinvestimento").change(function(){

        remontaPrazoResgate();

        remontaPrazoBeneficioTemporario();

    });



    var avisouresgate = false;

    $("#prazoresgate").on('change', function() {

        if (!avisouresgate) {

            alert('A opção pelo Resgate Total implica na cessação dos demais benefícios do Plano, bem como no seu desligamento.');

            avisouresgate = true;

        }

    });

   






    $("#opcao").on('change', function() {

   

        if($(this).val() == 'C'){

            $("#labelvalor").html('Qual o valor da contribuição mensal?');

        } else {

            $("#labelvalor").html('Qual valor de renda desejada?');

        }

   

    });









});



    function trataPercentualdeSaque(){

        $("#percentualdesaque").empty();

        $("#percentualdesaque").prepend("<option value='' selected>Escolha uma das opções</option>");  

        $("#percentualdesaque").prepend("<option value='0'>0%</option>");  

        $("#percentualdesaque").prepend("<option value='05'>5%</option>");  

        $("#percentualdesaque").prepend("<option value='10'>10%</option>");  

        $("#percentualdesaque").prepend("<option value='15'>15%</option>");  

        $("#percentualdesaque").prepend("<option value='20'>20%</option>");  

        $("#percentualdesaque").prepend("<option value='25'>25%</option>");  

        $("#percentualdesaque").prepend("<option value='30'>30%</option>");  

        $("#percentualdesaque").prepend("<option value='35'>35%</option>");  

        $("#percentualdesaque").prepend("<option value='40'>40%</option>");  

        $("#percentualdesaque").prepend("<option value='45'>45%</option>");  

        $("#percentualdesaque").prepend("<option value='50'>50%</option>");  



        var tempo = $("#prazobeneficiotemporario").val();

        if(tempo>=10){

            $("#percentualdesaque").prepend("<option value='55'>55%</option>");  

            $("#percentualdesaque").prepend("<option value='60'>60%</option>");  

            $("#percentualdesaque").prepend("<option value='65'>65%</option>");  

            $("#percentualdesaque").prepend("<option value='70'>70%</option>");  

        }

    }



    function verificaPrazoBeneficioTemporario(){

        var prazototal = parseInt($("#prazobeneficiotemporario").val()) + parseInt($("#tempoderecebimento").val());



        if(prazototal > parseInt($("#tempoinvestimento").val())){

            $("#prazobeneficiotemporario").val($("#prazobeneficiotemporario option:first").val());

            $("#tempoderecebimento").val($("#tempoderecebimento option:first").val());

            alert('A soma de de Prazo para Benefício temporário + Tempo de Recebimento para o Benefí­cio temporário Não pode ser superior ao Tempo de Investimento');

            return false;

        } else {

            return true;

        }



    }





    function remontaPrazoResgate(){

        $("#prazoresgate").empty();

        $("#prazoresgate").prepend("<option value='' selected>Escolha uma das opções</option>");  

        $("#prazoresgate").prepend("<option value='0'>Não</option>");  



        var maximo = parseInt($("#tempoinvestimento").val());

        var minimo = 3;

        for (let i = minimo; (i <= maximo); i++) {

            $("#prazoresgate").prepend("<option value='"+i+"'>"+i+" Anos</option>");  

        }



    }



    function remontaPrazoBeneficioTemporario(){

        $("#prazobeneficiotemporario").empty();

        $("#prazobeneficiotemporario").prepend("<option value='' selected>Escolha uma das opções</option>");  

        $("#prazobeneficiotemporario").prepend("<option value='0'>Não</option>");  



        var maximo = parseInt($("#tempoinvestimento").val()) -2;

        var minimo = 5;

        for (let i = minimo; (i <= maximo); i++) {

            $("#prazobeneficiotemporario").prepend("<option value='"+i+"'>"+i+" Anos</option>");  

        }



    }



    function printaMeses(meses){

        // Criar elemento da tabela

        const tabela = document.createElement("table");



        // Criar cabeÃ§alho da tabela

        const cabecalho = tabela.createTHead();

        const linhaCabecalho = cabecalho.insertRow();

        const celulaMes = linhaCabecalho.insertCell();

        const celulaFase = linhaCabecalho.insertCell();

        const celulaContribuicao = linhaCabecalho.insertCell();

        const celulaAporte = linhaCabecalho.insertCell();

        const celulaBeneficio = linhaCabecalho.insertCell();

        const celulaSaldoPlanoFamilia = linhaCabecalho.insertCell();

        const celulaResgate = linhaCabecalho.insertCell();

        const celulaBeneficioTemporario = linhaCabecalho.insertCell();

        const celulaSaldoPlanoFamilia2 = linhaCabecalho.insertCell();

        celulaMes.textContent = "MÃªs";

        celulaFase.textContent = "Fase";

        celulaContribuicao.textContent = "contribuição";

        celulaAporte.textContent = "Aporte";

        celulaBeneficio.textContent = "Beneficio";

        celulaSaldoPlanoFamilia.textContent = "Saldo Plano Família";

        celulaResgate.textContent = "Resgate";

        celulaBeneficioTemporario.textContent = "Benefício Temporário";

        celulaSaldoPlanoFamilia2.textContent = "Saldo Plano Família";



        // Criar corpo da tabela

        const corpo = tabela.createTBody();

        for (let i = 0; i < meses.length; i++) {

            const linha = corpo.insertRow();

            const celulaMes = linha.insertCell();

            const celulaFase = linha.insertCell();

            const celulaContribuicao = linha.insertCell();

            const celulaAporte = linha.insertCell();

            const celulaBeneficio = linha.insertCell();

            const celulaSaldoPlanoFamilia = linha.insertCell();

            const celulaResgate = linha.insertCell();

            const celulaBeneficioTemporario = linha.insertCell();

            const celulaSaldoPlanoFamilia2 = linha.insertCell();



            celulaMes.textContent = meses[i].mes;

            celulaFase.textContent = meses[i].fase;

        celulaContribuicao.textContent = meses[i].contribuicao;

        celulaAporte.textContent = meses[i].aporte;

        celulaBeneficio.textContent = meses[i].beneficio;

        celulaSaldoPlanoFamilia.textContent = meses[i].saldoplanofamilia;

        celulaResgate.textContent = meses[i].resgate;

        celulaBeneficioTemporario.textContent = meses[i].beneficiotemporario;

        celulaSaldoPlanoFamilia2.textContent = meses[i].saldoplanofamiliatemp;

        }



        // Inserir a tabela no HTML

        $("body table:last-child").remove();



        document.body.appendChild(tabela);

    }