const A='assets/audio/', I='assets/images/', V='assets/video/';
const levels=[
{img:'coco.jpg',start:'01_inicio_cocos.mp3',h1:'01_pista1_cocos.mp3',h2:'01_pista2_cocos.mp3',ok:'01_acerto_cocos.mp3',box:[42,40,26,33]},
{img:'melancia.jpg',start:'02_inicio_melancias.mp3',h1:'02_pista1_melancias.mp3',h2:'02_pista2_melancias.mp3',ok:'02_acerto_melancias.mp3',box:[20,38,26,26]},
{img:'paes.jpg',start:'03_inicio_paes.mp3',h1:'03_pista1_paes.mp3',h2:'03_pista2_paes.mp3',ok:'03_acerto_paes.mp3',box:[41,47,18,18]},
{img:'alface.jpg',start:'04_inicio_verdes.mp3',h1:'04_pista1_verdes.mp3',h2:'04_pista2_verdes.mp3',ok:'04_acerto_verdes.mp3',box:[38,46,16,11]},
{img:'flores.jpg',start:'05_inicio_flores.mp3',h1:'05_pista1_flores.mp3',h2:'05_pista2_flores.mp3',ok:'05_acerto_flores.mp3',box:[34,39,15,11]},
{img:'sorvetes.jpg',start:'06_inicio_sorvetes.mp3',h1:'06_pista1_sorvetes.mp3',h2:'06_pista2_sorvetes.mp3',ok:'06_acerto_sorvetes.mp3',box:[41,38,17,22]},
{img:'bolos.jpg',start:'07_inicio_bolos.mp3',h1:'07_pista1_bolos.mp3',h2:'07_pista2_bolos.mp3',ok:'07_acerto_bolos.mp3',box:[22,25,21,15]},
{img:'prateleira.jpg',start:'08_inicio_potinhos.mp3',h1:'08_pista1_potinhos.mp3',h2:'08_pista2_potinhos.mp3',ok:'08_acerto_potinhos.mp3',box:[27,28,28,14]},
{img:'doces.jpg',start:'09_inicio_doces.mp3',h1:'09_pista1_doces.mp3',h2:'09_pista2_doces.mp3',ok:'09_acerto_doces.mp3',box:[43,3,25,15]},
{img:'plantas.jpg',start:'10_inicio_plantas.mp3',h1:'10_pista1_plantas.mp3',h2:'10_pista2_plantas.mp3',ok:'10_acerto_plantas.mp3',box:[8,18,14,15]}
];
const $=s=>document.querySelector(s), screens=['#startScreen','#videoScreen','#gameScreen','#celebrateScreen','#finalScreen'];
const voice=$('#voice'), video=$('#storyVideo'); let level=0,wrong=0,hints=0,solved=false,muted=false,lastAudio=null,videoNext=null;
function show(id){screens.forEach(s=>$(s).classList.add('hidden'));$(id).classList.remove('hidden');window.scrollTo({top:0,behavior:'smooth'})}
function playAudio(file){if(!file||muted)return;lastAudio=file;voice.src=A+file;voice.currentTime=0;voice.play().catch(()=>{})}
function setMuted(v){muted=v;voice.muted=v;video.muted=v;$('#muteBtn').textContent=v?'🔇':'🔊'}
function dots(){const d=$('#dots');d.innerHTML='';levels.forEach((_,i)=>{const e=document.createElement('span');e.className='dot '+(i<level?'done':i===level?'current':'');d.append(e)})}
function loadLevel(){show('#gameScreen');wrong=0;hints=0;solved=false;const l=levels[level];$('#levelLabel').textContent=`ESCONDERIJO ${level+1}`;dots();$('#gamePhoto').src=I+l.img;$('#message').textContent='Encontre o Sr. Alfabeto!';$('#hintBtn').disabled=true;$('#loupeBtn').disabled=true;$('#nextBtn').classList.add('hidden');$('#hintSpot').classList.add('hidden');$('#successSpot').classList.add('hidden');$('#gamePhoto').onload=()=>playAudio(l.start)}
function story(src,next){show('#videoScreen');videoNext=next;video.src=V+src;video.currentTime=0;$('#videoPlay').classList.add('hidden');video.play().catch(()=>$('#videoPlay').classList.remove('hidden'))}
function finishVideo(){video.pause();video.removeAttribute('src');video.load();const n=videoNext;videoNext=null;n&&n()}
$('#startBtn').addEventListener('click',()=>story('abertura.mp4',loadLevel));
$('#videoPlay').addEventListener('click',()=>{video.play();$('#videoPlay').classList.add('hidden')});video.addEventListener('ended',finishVideo);$('#skipVideo').addEventListener('click',finishVideo);
$('#muteBtn').addEventListener('click',()=>setMuted(!muted));$('#replayBtn').addEventListener('click',()=>playAudio(lastAudio||levels[level].start));
$('#photoFrame').addEventListener('click',e=>{if(solved)return;const r=$('#gamePhoto').getBoundingClientRect();if(!r.width)return;const x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100,[bx,by,bw,bh]=levels[level].box;if(x>=bx&&x<=bx+bw&&y>=by&&y<=by+bh){solved=true;const s=$('#successSpot');s.style.left=(bx+bw/2)+'%';s.style.top=(by+bh/2)+'%';s.classList.remove('hidden');$('#hintSpot').classList.add('hidden');$('#message').textContent='Você me achou! Muito bem!';playAudio(levels[level].ok);$('#nextBtn').classList.remove('hidden');$('#hintBtn').disabled=true;$('#loupeBtn').disabled=true}else{wrong++;const rip=$('#tapRipple');rip.style.left=x+'%';rip.style.top=y+'%';rip.classList.remove('hidden');setTimeout(()=>rip.classList.add('hidden'),450);$('#message').textContent=['Quase! Olhe mais um pouquinho.','Ainda não! Procure com bastante atenção.','Hummm... eu estou muito bem escondido!'][(wrong-1)%3];playAudio(['erro_01.mp3','erro_02.mp3','erro_03.mp3'][(wrong-1)%3]);if(wrong>=1&&hints===0){$('#hintBtn').disabled=false;setTimeout(()=>playAudio('oferecer_pista.mp3'),900)}}});
$('#hintBtn').addEventListener('click',()=>{if(solved)return;hints++;if(hints===1){playAudio(levels[level].h1);$('#message').textContent='Pista 1 — escute com atenção!';$('#hintBtn').textContent='💡 OUTRA PISTA'}else{playAudio(levels[level].h2);$('#message').textContent='Pista 2 — agora ficou mais fácil!';$('#hintBtn').disabled=true;$('#loupeBtn').disabled=false;setTimeout(()=>playAudio('oferecer_lupa.mp3'),1300)}});
$('#loupeBtn').addEventListener('click',()=>{const [x,y,w,h]=levels[level].box,s=$('#hintSpot'),pad=5;s.style.left=Math.max(0,x-pad)+'%';s.style.top=Math.max(0,y-pad)+'%';s.style.width=Math.min(100-x+pad,w+pad*2)+'%';s.style.height=Math.min(100-y+pad,h+pad*2)+'%';s.classList.remove('hidden');$('#message').textContent='A lupa mostrou a região. Agora encontre o Sr. Alfabeto!'});
$('#nextBtn').addEventListener('click',()=>{if(level===4){level++;story('meio.mp4',loadLevel)}else if(level===9){celebrate()}else{level++;loadLevel()}});

function playCheckout(){
  show('#videoScreen');
  videoNext=null;
  video.src=V+'esteira.mp4';
  video.currentTime=0;
  $('#videoPlay').classList.add('hidden');

  let jokePlayed=false;
  const startJoke=()=>{
    if(jokePlayed)return;
    jokePlayed=true;
    playAudio('esteira_final.mp3');
  };
  const onTime=()=>{
    if(video.duration && video.duration-video.currentTime<=3.2) startJoke();
  };
  const finish=()=>{
    video.removeEventListener('timeupdate',onTime);
    video.removeEventListener('ended',finish);
    video.pause();
    video.removeAttribute('src');
    video.load();
    if(!jokePlayed) startJoke();

    const openFinal=()=>story('final.mp4',()=>show('#finalScreen'));
    if(muted || voice.ended || voice.paused) openFinal();
    else voice.addEventListener('ended',openFinal,{once:true});
  };

  video.addEventListener('timeupdate',onTime);
  video.addEventListener('ended',finish);
  video.play().catch(()=>$('#videoPlay').classList.remove('hidden'));
}

function celebrate(){
  show('#celebrateScreen');
  setTimeout(()=>{
    playAudio('transicao_esteira.mp3');
    setTimeout(playCheckout,1300);
  },1700);
}

$('#restartBtn').addEventListener('click',()=>{level=0;wrong=0;hints=0;solved=false;lastAudio=null;show('#startScreen')});
