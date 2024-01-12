"use client";
import { FaRegCircle } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useState } from "react";

// This function was writed by chatgpt
function verificarEstadoJuego(matriz: number[][]): number {
  // Verificar filas y columnas
  for (let i = 0; i < 3; i++) {
    if (
      matriz[i]![0] === matriz[i]![1] &&
      matriz[i]![1] === matriz[i]![2] &&
      matriz[i]![0] !== 0
    ) {
      return matriz[i]![0]!; // Jugador 1 o 2 ganó en una fila
    }
    if (
      matriz[0]![i] === matriz[1]![i] &&
      matriz[1]![i] === matriz[2]![i] &&
      matriz[0]![i] !== 0
    ) {
      return matriz[0]![i]!; // Jugador 1 o 2 ganó en una columna
    }
  }

  // Verificar diagonales
  if (
    (matriz[0]![0] === matriz[1]![1] && matriz[1]![1] === matriz[2]![2]) ||
    (matriz[0]![2] === matriz[1]![1] && matriz[1]![1] === matriz[2]![0])
  ) {
    if (matriz[1]![1] !== 0) {
      return matriz[1]![1]!; // Jugador 1 o 2 ganó en una diagonal
    }
  }

  // Verificar si el juego no ha terminado
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (matriz[i]![j] === 0) {
        return 0; // El juego aún no ha terminado
      }
    }
  }

  // Si llegamos aquí, el juego terminó en empate
  return -1;
}

const Cell = ({
  cell,
  onClick,
}: {
  cell: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  const logos = [
    <FaRegCircle size={16} className="invisible" />,
    <FaRegCircle size={16} />,
    <RxCross1 size={16} />,
  ];

  return (
    <button
      className="flex h-6 w-full items-center justify-center border"
      onClick={onClick}
    >
      {logos[cell]}
    </button>
  );
};

const Game = ({
  turn,
  isActive = false,
  onPlay,
  coords,
}: {
  turn: number;
  isActive?: boolean;
  onPlay: (rowIndex: number, colIndex: number, newGameState: number) => void;
  coords: [number, number];
}) => {
  const emptyGame = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [gameState, setGameState] = useState(emptyGame);

  const onCellClick = (x: number, y: number) => {
    let newGameState = gameState;
    if (gameState[x]![y] == 0) {
      newGameState[x]![y] = turn + 1;
      setGameState(newGameState);
      onPlay(x, y, verificarEstadoJuego(newGameState));
    }
  };

  const estadoJuego = verificarEstadoJuego(gameState);

  if (estadoJuego == 1) return <FaRegCircle className="h-[82px] w-[64px]" />;

  if (estadoJuego == 2) return <RxCross1 className="h-[82px] w-[64px]" />;

  return (
    <table
      className={
        "border-collapse border-spacing-3 border " +
        (estadoJuego == -1 || !isActive
          ? "pointer-events-none opacity-50"
          : "opacity-100")
      }
    >
      <tbody>
        {[...Array(3).keys()].map((rowIndex) => (
          <tr key={`game-${3 * coords[0] + coords[1]}-row-${rowIndex}`}>
            {[...Array(3).keys()].map((colIndex) => (
              <td
                key={`game-${3 * coords[0] + coords[1]}-cell-${colIndex}`}
                className="h-4 w-4 border text-center"
              >
                <Cell
                  cell={gameState[rowIndex]![colIndex]!}
                  onClick={() => onCellClick(rowIndex, colIndex)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const GreatGame = () => {
  const emptyGame = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const [gameState, setGameState] = useState(emptyGame);
  const [turn, setTurn] = useState(0);
  const [activeGame, setActiveGame] = useState([-1, -1]);

  
  const gameOutcome = verificarEstadoJuego(gameState);
  const gameIsActive = (arg0: [number, number]) =>
    gameOutcome == 0 &&
    ((activeGame[0] == arg0[0] && activeGame[1] == arg0[1]) ||
    (activeGame[0] == -1 && activeGame[1] == -1));

  return (
    <div className="flex flex-col gap-y-6">
      <table className="border-separate border-spacing-8 border">
        <tbody>
          {[...Array(3).keys()].map((rowIndex) => (
            <tr key={`greatGame-row-${rowIndex}`}>
              {[...Array(3).keys()].map((colIndex) => (
                <td key={`greatGame-row-${rowIndex}-cell-${colIndex}`}>
                  <Game
                    coords={[rowIndex, colIndex]}
                    turn={turn}
                    onPlay={(x, y, st) => {
                      setTurn((turn + 1) % 2);
                      let newGameState = gameState;
                      if (st != 0) {
                        newGameState[rowIndex]![colIndex] = st;
                        setGameState(newGameState);
                      }
                      if (newGameState[x]![y] != 0) setActiveGame([-1, -1]);
                      else setActiveGame([x, y]);
                    }}
                    isActive={gameIsActive([rowIndex, colIndex])}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {gameOutcome == 0 ? (
        <p className="flex items-center justify-center gap-x-1">
          Juega: {turn == 0 ? <FaRegCircle /> : <RxCross1 />}
        </p>
      ) : gameOutcome == -1 ? (
        <p className="text-center">Empate</p>
      ) : (
        <p className="flex items-center justify-center gap-x-1">
          Gano {gameOutcome == 1 ? <FaRegCircle /> : <RxCross1 />}
        </p>
      )}
    </div>
  );
};

export default GreatGame;
