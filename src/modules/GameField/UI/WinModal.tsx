import { FC } from "react";
import { UiModal } from "./UiModal";
import styled from "styled-components";
import { UiButton } from "./UiButton";

interface IProps {
  winner: string;
}

const StyledWinModal = styled.div`
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
  justify-content: center;
  }
`;

const WinModal: FC<IProps> = ({ winner }) => {
  return (
    <UiModal>
      <StyledWinModal>
        <h1>Победил игрок {winner}!</h1>
        <UiButton>Начать заново</UiButton>
      </StyledWinModal>
    </UiModal>
  );
};

export { WinModal };
