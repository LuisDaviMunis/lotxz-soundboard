import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [MusicaAtual, setMusicaAtual] = useState("Aguaradndo seleção...");
  const [minhasMusicas, setMinhasMusicas] = useState([]);

  // novo  estado para saber se já há um áudio tocando
  const [audioTocando, setAudioTocando] = useState(false);

  const audioPlayer = useRef(null);

  useEffect(() => {
    fetch("/musicas.json")
      .then((resposta) => resposta.json())
      .then((dados) => {
        setMinhasMusicas(dados);
        console.log("Musicas carregadas com sucesso!");
      })
      .catch((erro) => console.error("Erro ao carregar músicas:", erro));
  }, []); // <--- esse array vazio garante que o efeito rode apenas uma vez, ao montar o componente

  const tocar = (musica) => {
    // Se já houver um áudio tocando, parar ele antes de tocar o novo
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.currentTime = 0;
    }

    // criar um novo objeto de áudio e tocar a música selecionada

    audioPlayer.current = new Audio(`/${musica.arquivo}`);

    // Toca o som!
    audioPlayer.current.play().catch((erro) => {
      console.error("Erro ao tocar a música:", erro);
    });

    // atualiza a tela com o nome da música atual
    setMusicaAtual(`Tocando: ${musica.titulo} [${musica.genero}]`);
  };

  // função para pausar o audio ou retomá-lo
  const alternarPause = () => {
    if (!audioPlayer.current) return; // se não houver áudio, não faz nada

    if (audioTocando) {
      audioPlayer.current.pause();
      setAudioTocando(false);
    } else {
      audioPlayer.current.play();
      setAudioTocando(true);
    }
  };

  return (
    <div className="Container">
      {/*Quebra linha forçada com <br/.>*/}
      <h1>
        LoTX'z
        <br />
        SoundBoard
      </h1>

      <div className="player-display">{MusicaAtual}</div>

      {/* Botão para pausar ou retomar a música */}
      <div className="controles">
        <button
          onClick={alternarPause}
          className="btn-controle"
          // Desabilitar o botão quando não há áudio tocando
          disabled={!audioPlayer.current}
        >
          {/* Se estiver tocando mostra PAUSE, se não mostra PLAY */}
          {audioTocando ? "⏸" : "▶"}
        </button>
      </div>

      <div className="grade-botoes">
        {/* Se a Lista estiver vazia, mostra "Carregando..." */}
        {minhasMusicas.length === 0 ? <p>Carregando...</p> : null}

        {minhasMusicas.map((musica) => (
          <button
            key={musica.id}
            onClick={() => tocar(musica)}
            className="btn-musica"
          >
            {musica.titulo}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
