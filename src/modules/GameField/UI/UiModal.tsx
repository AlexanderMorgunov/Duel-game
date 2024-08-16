import { FC } from "react";
import styled from "styled-components";

const StyledUiModal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
`;

interface Props {
  children?: React.ReactNode;
  //   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const UiModal: FC<Props> = ({
  children,
  // , setIsOpen
}) => {
  //   useEffect(() => {
  //     window.addEventListener("keydown", (e) => {
  //       if (e.key === "Escape") {
  //         setIsOpen(false);
  //       }
  //     });
  //     return () => {
  //       window.removeEventListener("keydown", (e) => {
  //         if (e.key === "Escape") {
  //           setIsOpen(false);
  //         }
  //       });
  //     };
  //   });
  //   const handleClose = (e: React.MouseEvent) => {
  //     if (e.target === e.currentTarget) {
  //       setIsOpen(false);
  //     }
  //   };

  return (
    <StyledUiModal
    //   onClick={handleClose}
    >
      {children}
    </StyledUiModal>
  );
};

export { UiModal };
