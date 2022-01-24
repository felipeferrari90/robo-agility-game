
function jogo(){
    
				//VARIAVEIS DO JOGO
				var canvas, ctx, ALTURA, LARGURA, frames = 0, img, estadoAtual, segundos = 0,
				img, maior, power = 120, fantasma = false, morrendo = 0;

				//variaveis dos audios do jogo 
				var som = document.getElementById("som");
				var som2 = document.getElementById("som2");
				var som3 = document.getElementById("som3");
				var som4 = document.getElementById("som4");
				var som5 = document.getElementById("som5");
				var som6 = document.getElementById("som6");  
				var som7 = document.getElementById("som7");
				var som8 = document.getElementById("som8");


                //function que cria sprites de um arquivo img que esta localizada na pasta
                function Sprite(x, y, largura, altura) {
                    this.x = x;
                    this.y = y;
                    this.largura = largura;
                    this.altura = altura;
                
                    this.desenha = function(xCanvas, yCanvas) {
                        ctx.drawImage(img, this.x, this.y, this.largura, this.altura, xCanvas , yCanvas, this.largura, this.altura);
                    }
                }				
				
				
                var bg = new Sprite(150,0,600,600),    // background do jogo
                bg2 = new Sprite(150,600,600,600),     // background de tela de game over
                bg3 = new Sprite(150,1200,600,600),    // background de tela de inicio
				roboCima = new Sprite(75,0,75,75),     // sprite do personagem principal que mexemos
                pedra = new Sprite(0,150,100,100),     // sprite do vilão
                roboMorto = new Sprite(75,75,75,75),   // sprite do robo quando é atingido pelo vilão
                roboFantasma = new Sprite(0,75,75,75); // robo no modo SPECIAL 
                
	            // INSTANCIA DE ESTADOS DO JOGO
				estado = {
					jogar : 0,
					jogando : 1, 
					perdeu : 2,
				},
				
				//
				robo = {
					y: 250,
					x: 250, 
					altura: roboCima.altura,
					largura: roboCima.largura,
					velocidade: 45,
					colisao : false, //variavel pra verificar se houve colisao
			
				    // function que atualiza as variaveis do robo antes de ele ser redesenhado no proximo frame
					atualiza: function(){
					   if(fantasma == false && this.colisao == false){
						  roboCima.desenha(this.x,this.y);
					   }
					   if(power == 0) {
						  power = power + 2;
						  fantasma = false;
					   }
					   
					   if(power > 0 && power < 120 && fantasma == false) {
						  power++ ;
					   }
	
					   if(fantasma == true && this.colisao == false) {
						   roboFantasma.desenha(this.x,this.y);
						   power--;
					   } 
	
					   // quando ocorre a colisão começa-se a contar a variavel morrendo que é o modo do robo em chamas
					   // que se persiste por 2 segundos antes de acionar a tela de game over
					   if(this.colisao == true){
						   morrendo++;
						   if(morrendo < 120){
						   roboMorto.desenha(this.x,this.y);
						   } else {
							   som3.play();
							   estadoAtual = estado.perdeu;
						   }
						  
					   }
						 
					   if(this.x >= LARGURA - this.largura){
						  this.x = LARGURA - this.largura
					   }    
	
					   if(this.y >= ALTURA - this.altura){
						  this.y = LARGURA - this.altura 
					   }
					   if(this.x <= 0){
						  this.x = 0;
					   }    
	
					   if(this.y <= 0 ){
						  this.y = 0; 
					   }
	
					},


	                //FUNÇÃO PRA RESETAR AS VARIAVEIS DO JOGO PRA ELE PODER SER INICIADO DENOVO
					reset: function() {

						// o localstorage é onde ficara armazenado a varial da maior pontuação do jogo
						if(segundos > maior){
							localStorage.setItem("maior", segundos);
							maior = segundos;
						}
						
						
						power = 120; // VARIAVEL DE INDICAÇÃO DO SPECIAL
						fantasma = false; 
						this.colisao = false;
						morrendo = 0;
					    segundos = 0;
					},
	
				    // METODO QUE DESENHA O SPRITE APÓS A ATUALIZAÇÃO
					desenha: function(){
						if(fantasma == false && this.colisao == false){
						  roboCima.desenha(this.x,this.y);
						}
						if(fantasma == true && this.colisao == false) {
						  roboFantasma.desenha(this.x,this.y);
						} 
						if(this.colisao == true){
						  roboMorto.desenha(this.x,this.y);  
						   
						  
						}
					}
	
				
	
				},
	            //INSTANCIA DOS OBSTACULOS(VILOES) DO JOGO
				obstaculos = {
					_obs: [],
					velocidade: 5,
					tempoInserir: 0, 
				
					
	
					insere: function(){
						this._obs.push({
							x: 5 * (Math.floor(78 * Math.random())),
							y: -50,
							largura: pedra.largura,
							altura: pedra.altura,
							cor: "#0000FF",
							caminho: 1,
							contracaminho: 1,
							contravelocidade: 0,
							
						})
	                    // METODO QUE INDICA O TEMPO A SE ADICIONAR UM NOVO OBSTACULO NO CAMPO
						this.tempoInserir = 480;
						
					},
	
					atualiza: function (){
						if(this.tempoInserir == 0){
							this.insere(); // function que insere um obstaculo no campo
						} else {
						this.tempoInserir-- ;
						}
	
						tam = this._obs.length;
						for(var i = 0; i < tam ; i++){
	
						   
						   var obs = this._obs[i];
							
	                        // FORMULA DE COLISÃO
							if (((robo.x + robo.largura ) > obs.x && robo.x < (obs.x + obs.largura) &&
							  (robo.y + robo.altura) > obs.y && robo.y < (obs.y + obs.altura)) && fantasma == false ) {
								
							  som5.play();
							  robo.colisao = true;
							   
							  // o especial do jogo é o modo fantasma no qual ao valer por true, ele pode atravessar os obstaculos
			
							}
						   
						  
						   else if (obs.x < LARGURA - obs.largura && obs.caminho == 1) {   
						   obs.x = obs.x + this.velocidade ;
						   obs.y = obs.y + this.velocidade ;
						   obs.caminho = 1;
						   } 
	
						   else if (obs.x == LARGURA - obs.largura && obs.caminho == 1 ){
						   obs.x = obs.x - this.velocidade;
						   obs.y = obs.y + this.velocidade;    
						   obs.caminho = 2;
						   som.play();
						   } 
						   
						   else if (obs.y < ALTURA - obs.altura && obs.caminho == 2) {   
						   obs.x = obs.x - this.velocidade ;
						   obs.y = obs.y + this.velocidade ;
						   obs.caminho = 2;
						   } 
	
						   else if (obs.y == ALTURA - obs.altura ){
						   obs.x = obs.x - this.velocidade  ;
						   obs.y = obs.y - this.velocidade  ;    
						   obs.caminho = 3;
						   som.play();
						   } 
	
						   else if (obs.x > 0   && obs.caminho == 3) {   
						   obs.x = obs.x - this.velocidade ;
						   obs.y = obs.y - this.velocidade ;
						   obs.caminho = 3;
						   } 
	
						   else if (obs.x == 0  && obs.caminho == 3){
						   obs.x = obs.x + this.velocidade ;
						   obs.y = obs.y - this.velocidade ;    
						   obs.caminho = 4;
						   som.play();
	
						   } 
	
						   else if (obs.y > 0  && obs.caminho == 4) {   
						   obs.x = obs.x + this.velocidade ;
						   obs.y = obs.y - this.velocidade ;
						   obs.caminho = 4;
						   } 
	
						   else if (obs.y == 0 && obs.caminho == 4 ){
						   obs.x = obs.x - this.velocidade ;
						   obs.y = obs.y + this.velocidade ;    
						   obs.caminho = 1;
						   som.play();
						   } 
	
						   
						   
	
						}
					},
	
					limpa: function(){
					   this._obs = [];  // metodo que limpa o array de obstaculos
					},
	
					desenha: function(){
						tam = this._obs.length;
						for(var i = 0; i < tam ; i++){
						   var obs = this._obs[i];
	
	
						   pedra.desenha(obs.x,obs.y);
						}
					}
	
				}
	
			  
	
				
			   
	
				function main() {
	
					ALTURA = window.innerHeight;
					LARGURA = window.innerWidth;
	
					if(LARGURA >= 500){
						LARGURA = 600;
						ALTURA = 600;
					}
	
				canvas = document.createElement("canvas");
				canvas.width = LARGURA;
				canvas.height = ALTURA;   
				canvas.style.border = "5px solid #ED145B";
	
				ctx = canvas.getContext("2d");
				document.body.appendChild(canvas);
	
				document.addEventListener("mousedown", clique)
				document.addEventListener("keydown", apertou)
				document.addEventListener("keyup",soltou)
	
				img = new Image();
				img.src ='img.png';
	
				estadoAtual = estado.jogar;
	
				maior = localStorage.getItem("maior");
				if (maior == null)
					maior = 0;
	
				roda(); 
	
				}
	
				//o metodo roda chama a si mesmo gerando um loop causado pelo requestanimation frame, 
				// que chama o metodo de atualizar primeiro (atualizando todas as variaveis x e y de cada sprite do jogo)
				// e depois chamando o metodo desenhar de todos eles
				function roda() {
	
					atualiza();
					desenha();
					window.requestAnimationFrame(roda);
				}

				// eventos de movimento do robo
				function apertou(evt){
				   var tecla = evt.keyCode
					

				   //apos a colisao nao se pode mexer o robo 
				   if (tecla == 65 && robo.x > 0 && robo.colisao == false){
					  robo.x = robo.x - robo.velocidade;
					  
					  
				   } else if (tecla == 87 && robo.y > 0  && robo.colisao == false){   
					  robo.y = robo.y - robo.velocidade;
					 
				   } else if (tecla == 68 && robo.x < LARGURA - robo.largura  && robo.colisao == false){
					  robo.x = robo.x + robo.velocidade;
					 
					  
	
				   } else if (tecla == 83 && robo.y < ALTURA - robo.altura  && robo.colisao == false){
					  robo.y = robo.y + robo.velocidade;  
					  
				   }          
				}
				//eventos gerados apos soltura de teclas
				function soltou(evt){
					var tecla = evt.keyCode
				   if (tecla == 65){
					  robo.x = robo.x - 0;
				   } else if (tecla == 87){   
					  robo.y = robo.y - 0;
				   } else if (tecla == 68){
					  robo.x = robo.x + 0;
				   } else if (tecla == 83){
					  robo.y = robo.y - 0; 
				   } else if (tecla == 13){
					   if (fantasma == false && power == 120){
						som6.play();  
						fantasma = true;
					   }
	
				   }             
						  
				}
				function clique(event) {
					if(estadoAtual == estado.jogando){
					
					} else if (estadoAtual == estado.perdeu) {
				   	
					estadoAtual = estado.jogar;
					obstaculos.limpa();
					obstaculos.tempoInserir = 0;


					} else if (estadoAtual == estado.jogar) {
					estadoAtual = estado.jogando;
					som4.pause();
					robo.y = 250;
					robo.x = 250;
					som7.play();
					
					
					}
				}   
	
				function atualiza() {
					if(estadoAtual == estado.jogando){
					frames++;
	
					if (frames == 60){
						segundos++;
						frames = 0;
					}
					robo.atualiza();
					obstaculos.atualiza();
					}
	
				   
				}
	
				function desenha() {
	
				   
	
	
				   if(estadoAtual == estado.jogar) {
					  

					   robo.reset();
					   som4.play();
					   bg2.desenha(0,0);
					   ctx.fillStyle = "white";
					   ctx.font = "20px Bungee Inline";
					   ctx.fillText("BEST:  " + maior,461,58);
	
					
				   } 
				   else if(estadoAtual == estado.perdeu) {
					   
					  
					   som2.pause();
				       bg3.desenha(0,0);
					   ctx.font = "30px Bungee Inline"; 
					   ctx.fillStyle = "#FFFFFF";
					  
					   ctx.fillText("TEMPO: " + segundos,235,550); 
					   
					   
					   if (segundos > maior){
						   ctx.fillStyle = "#FFFF00";
						   ctx.font = "30px Bungee Inline";
						   ctx.fillText("NEW BEST",240,510);
					   }
					   
	
				   } else if (estadoAtual == estado.jogando) {
								 
	
				   bg.desenha(0,0);
				   
				   
				   som2.play();
	
				   ctx.fillStyle = "#ED145B";
	
				   ctx.font = "10px Arial";
				   ctx.fillStyle = "black";
				   ctx.fillText("SECONDS:",41,67);
					
				   ctx.font = "25px Bungee Inline";
				   ctx.fillStyle = "#ED145B";
				   ctx.fillText(segundos,100,68);
				   
				   ctx.font = "10px Arial";
				   ctx.fillStyle = "black";
				   ctx.fillText("SPECIAL:",48,80);
				   
				   ctx.fillStyle = "#AAAAAA";
				   ctx.fillRect(97,75,40,5);
				   if(power == 120){
				   ctx.fillStyle = "#00FFFF";
				   } else {
					   ctx.fillStyle = "#FFFF00";
				   }
				   
				   ctx.fillRect(97,75,power/3,5);
	
				   obstaculos.desenha(); 
				   robo.desenha(); 
	
				   }
	
				  
				
				
				}
				main(); //metodo que roda o jogo
 	
				
			
}