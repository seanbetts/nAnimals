import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--blue);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

// Used for providing space between components
export const SpacerXSmall = styled.div`
  height: 8px;
  width: 8px;
`;

// Used for providing space between components
export const SpacerSmall = styled.div`
  height: 16px;
  width: 16px;
`;

// Used for providing space between components
export const SpacerMedium = styled.div`
  height: 24px;
  width: 24px;
`;

// Used for providing space between components
export const SpacerLarge = styled.div`
  height: 32px;
  width: 32px;
`;

// Used for providing a wrapper around a component
export const Container = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "center")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  width: 100%;
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;
  color: var(--pink);
  font-size: 30px;
  font-weight: 1000;
`;

export const TextTitle2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;
  color: var(--black);
  font-size: 30px;
  font-weight: 1000;
`;

export const TextSubTitle = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  color: var(--pink);
  font-size: 20px;
  font-weight: 500;
`;

export const TextSubTitle2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  color: var(--black);
  font-size: 20px;
  font-weight: 1000;
`;

export const TextDescription = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--pink);
  font-size: 14px;
  font-weight: 400;
  width: 650px;
  text-align: center;
`;

export const TextDescription2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--yellow);
  font-size: 20px;
  font-weight: 1000;
`;

export const StyledClickable = styled.div`
  :active {
    opacity: 0.6;
  }
`;

export const StyledButton = styled.button`
  background-color: var(--pink);
  color: black;
  border: none;
  width: 400px;
  font-size: 20px;
  font-weight: 1000;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0px;
  cursor: pointer;

  :hover {
    background-color: var(--pink);
    box-shadow: 0 9px var(--purple);
  }

  :active {
    background-color: var(--pink);
    box-shadow: 0 5px var(--purple);
    transform: translateY(4px);
  }
`;

export const Row = styled.div`
  display: flex;
`;

export const Column = styled.div`
  flex: 50%;
  padding: 10px;
`;

export const NFTContainerBar = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: var(--pink);
`;

export const NFTContainer = styled.div`
  display: flex;
  max-width: 1220px;
  min-height: 306px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background-color: var(--pink);
  padding: 10px;
`;

export const NFTSContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 220px;
  height: 266px;
  align-items: ${({ ai }) => (ai ? ai : "center")};
  background-color: var(--dirtywhite);
  margin: 10px;
  padding: 10px;
`;

export const Slider = styled.div`
  width: 400px;
`;