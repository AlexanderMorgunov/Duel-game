import styled from "styled-components";
import { UiModal } from "./UiModal";
import { UiButton } from "./UiButton";
import { FC } from "react";

const StyledNewGameModal = styled.div`
  width: 400px;
  min-height: 300px;
  background-color: #fff;
  border-radius: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  .title {
    width: 100%;
    text-align: center;
    font-weight: bold;
    font-size: 20px;
    color: #2d77af;
    font-size: 30px;
    margin-bottom: 20px;
  }
`;

interface IProps {
  onClick: () => void;
  title: string;
}

const NewGameModal: FC<IProps> = ({ onClick, title }) => {
  return (
    <UiModal>
      <StyledNewGameModal>
        <div className="title">{title}</div>
        <UiButton onClick={onClick}>Начать новую игру</UiButton>
      </StyledNewGameModal>
    </UiModal>
  );
};

export { NewGameModal };
