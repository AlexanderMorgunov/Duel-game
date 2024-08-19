import styled from "styled-components";
import image from "../assets/fone.png";
import { SettingsModal } from "./SettingsModal";
import { IoSettingsOutline } from "react-icons/io5";
import { UiButton } from "./UiButton";
import { NewGameModal } from "./NewGameModal";
import { useGameField } from "../helpers/useGameField";

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
`;

// Стили для канваса
const StyledCanvas = styled.canvas`
  background-image: url(${image});
  width: 100%;
  height: 100vh;
  background-size: contain;
`;

const StyledPlayerSettings = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
`;

const StyledScoreboard = styled.div`
  position: absolute;
  top: 30px;
  right: 50%;
  background-color: white;
  padding: 10px;
  border-radius: 5px;
  transform: translate(50%, -50%);
  font-weight: bold;
  font-size: 20px;
`;

const StyledMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 50px;
  border-radius: 5px;
  transform: translate(-50%, -50%);
  font-weight: bold;
  font-size: 20px;
`;

const GameField = () => {
  const {
    handleColorChange,
    handleStartNewGame,
    winnerText,
    handleChangeShootSpeed,
    handleChangePlayerSpeed,
    isOpenSettingsModal,
    setIsOpenSettingsModal,
    canvasRef,
    selectedPlayer,
    scores,
    playersSpellsColor,
    playersSpeed,
    shootingSpeeds,
    setGameStatus,
    setShootingSpeeds,
    gameStatus,
  } = useGameField();
  return (
    <>
      <StyledWrapper>
        <StyledCanvas ref={canvasRef}></StyledCanvas>
        <StyledScoreboard>
          {scores.player1} | {scores.player2}
        </StyledScoreboard>
        {selectedPlayer && (
          <StyledPlayerSettings>
            <h3>Настройки игрока {selectedPlayer.name}</h3>
            <div>
              <div>
                <label htmlFor="color">Цвет заклинаний: </label>
                <input
                  type="color"
                  id="color"
                  value={playersSpellsColor[selectedPlayer.id]}
                  onChange={(e) => handleColorChange(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="speed">Скорость передвижения: </label>
                <input
                  type="range"
                  id="speed"
                  value={playersSpeed[selectedPlayer.id]}
                  min={1}
                  max={50}
                  onChange={(e) => handleChangePlayerSpeed(+e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="shootSpeed">Скорость выстрела: </label>
                <input
                  type="range"
                  id="shootSpeed"
                  min={100}
                  max={2000}
                  step={50}
                  value={2050 - shootingSpeeds[selectedPlayer.id]}
                  onChange={(e) => handleChangeShootSpeed(+e.target.value)}
                />
              </div>
            </div>
          </StyledPlayerSettings>
        )}
      </StyledWrapper>
      <StyledMenu>
        <UiButton
          variant="outlined"
          onClick={() => {
            setGameStatus("pause");
            setIsOpenSettingsModal(true);
          }}
        >
          <IoSettingsOutline />
        </UiButton>
      </StyledMenu>
      {isOpenSettingsModal && (
        <SettingsModal
          onClose={() => {
            setIsOpenSettingsModal(false);
            setGameStatus("play");
          }}
          setShootingSpeeds={setShootingSpeeds}
          handleChangePlayerSpeed={handleChangePlayerSpeed}
          playersSpeed={playersSpeed}
          shootingSpeeds={shootingSpeeds}
          handleChangeShootSpeed={handleChangeShootSpeed}
          playersSpellsColor={playersSpellsColor}
          handleColorChange={handleColorChange}
        />
      )}
      {(gameStatus === "idle" || gameStatus === "win") && (
        <NewGameModal
          title={winnerText ? winnerText : "Новая игра"}
          onClick={handleStartNewGame}
        />
      )}
    </>
  );
};

export { GameField };
