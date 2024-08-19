import { FC } from "react";
import { UiModal } from "./UiModal";
import styled from "styled-components";
import { UiButton } from "./UiButton";
// import { Player } from "../types/Player";

interface Props {
  // setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  playersSpeed: number[];
  // setPlayersSpeed: React.Dispatch<React.SetStateAction<number[]>>;
  // shootingSpeeds: number[];
  setShootingSpeeds: React.Dispatch<React.SetStateAction<number[]>>;
  // playersRef: React.MutableRefObject<Player[]>;
  handleChangePlayerSpeed: (speed: number, id?: number) => void;
  shootingSpeeds: number[];
  handleChangeShootSpeed: (speed: number, id?: number) => void;
  playersSpellsColor: string[];
  handleColorChange: (color: string, id?: number) => void;
}

const StyledSettingsModal = styled.div`
  width: 400px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .title {
    width: 100%;
    text-align: center;
  }
  .players-settings {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .player {
      display: flex;
      margin-bottom: 10px;
      flex-direction: column;
      .title {
        width: 100%;
        text-align: center;
      }
    }
  }
`;

const SettingsModal: FC<Props> = ({
  playersSpeed,
  // playersRef,
  handleChangePlayerSpeed,
  onClose,
  shootingSpeeds,
  handleChangeShootSpeed,
  playersSpellsColor,
  handleColorChange,
}) => {
  return (
    <UiModal>
      <StyledSettingsModal>
        <div className="title">
          <h2>Настройки</h2>
        </div>
        <div className="players-settings">
          <div className="player">
            <h3>Синий</h3>
            <label htmlFor="speed">Скорость передвижения: </label>
            <input
              type="range"
              id="speed"
              value={playersSpeed[0]}
              min={1}
              max={50}
              onChange={(e) => handleChangePlayerSpeed(+e.target.value, 0)}
            />
            <label htmlFor="shootSpeed">Скорость выстрела: </label>
            <input
              type="range"
              id="shootSpeed"
              value={2050 - shootingSpeeds[0]}
              min={100}
              max={2000}
              step={50}
              onChange={(e) => handleChangeShootSpeed(+e.target.value, 0)}
            />
            <label htmlFor="color">Цвет заклинаний: </label>
            <input
              type="color"
              id="color"
              value={playersSpellsColor[0]}
              onChange={(e) => handleColorChange(e.target.value, 0)}
              //   onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
          <div className="player">
            <h3>Красный</h3>
            <label htmlFor="speed">Скорость передвижения: </label>
            <input
              type="range"
              id="speed"
              value={playersSpeed[1]}
              min={1}
              max={50}
              onChange={(e) => handleChangePlayerSpeed(+e.target.value, 1)}
              //   onChange={(e) => handleChangePlayerSpeed(+e.target.value)}
            />
            <label htmlFor="shootSpeed">Скорость выстрела: </label>
            <input
              type="range"
              id="shootSpeed"
              min={100}
              max={2000}
              step={50}
              value={2050 - shootingSpeeds[1]}
              onChange={(e) => handleChangeShootSpeed(+e.target.value, 1)}
            />
            <label htmlFor="color">Цвет заклинаний: </label>
            <input
              type="color"
              id="color"
              // value={"blue"}
              value={playersSpellsColor[0]}
              onChange={(e) => handleColorChange(e.target.value, 1)}

              //   onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        </div>
        <UiButton type="submit" onClick={() => onClose()}>
          Ок
        </UiButton>
      </StyledSettingsModal>
    </UiModal>
  );
};

export { SettingsModal };
