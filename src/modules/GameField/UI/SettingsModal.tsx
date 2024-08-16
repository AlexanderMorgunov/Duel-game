import { FC } from "react";
import { UiModal } from "./UiModal";
import styled from "styled-components";
import { UiButton } from "./UiButton";

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const StyledSettingsModal = styled.div`
  width: 400px;
  //   height: 300px;
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

const SettingsModal: FC<Props> = ({ setIsOpen }) => {
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
              value={2}
              min={1}
              max={50}
              //   onChange={(e) => handleChangePlayerSpeed(+e.target.value)}
            />
            <label htmlFor="shootSpeed">Скорость выстрела: </label>
            <input type="range" id="shootSpeed" />
            <label htmlFor="color">Цвет заклинаний: </label>
            <input
              type="color"
              id="color"
              value={"blue"}
              //   onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
          <div className="player">
            <h3>Красный</h3>
            <label htmlFor="speed">Скорость передвижения: </label>
            <input
              type="range"
              id="speed"
              value={2}
              min={1}
              max={50}
              //   onChange={(e) => handleChangePlayerSpeed(+e.target.value)}
            />
            <label htmlFor="shootSpeed">Скорость выстрела: </label>
            <input type="range" id="shootSpeed" />
            <label htmlFor="color">Цвет заклинаний: </label>
            <input
              type="color"
              id="color"
              value={"blue"}
              //   onChange={(e) => handleColorChange(e.target.value)}
            />
          </div>
        </div>
        <UiButton type="submit" onClick={() => setIsOpen(false)}>
          Ок
        </UiButton>
      </StyledSettingsModal>
    </UiModal>
  );
};

export { SettingsModal };
