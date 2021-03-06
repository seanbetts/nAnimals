import styled from "styled-components";

// Used for wrapping a page component
export const Screen = styled.div`
  background-color: var(--blue);
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-position: center;
  min-width: 100%;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
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

export const ImageContainer = styled.div`
  display: flex;
  flex: ${({ flex }) => (flex ? flex : 0)};
  flex-direction: ${({ fd }) => (fd ? fd : "column")};
  justify-content: ${({ jc }) => (jc ? jc : "flex-start")};
  align-items: ${({ ai }) => (ai ? ai : "center")};
  background-color: ${({ test }) => (test ? "pink" : "none")};
  background-image: ${({ image }) => (image ? `url(${image})` : "none")};
  background-size: cover;
  background-position: center;
`;

export const TextTitle = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;
  color: var(--pink);
  font-size: 28px;
  width: 90%;
  max-width: 750px;
  font-weight: 1000;
  text-align: center;
`;

export const TextTitle2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;
  color: var(--black);
  font-size: 28px;
  width: 90%;
  max-width: 750px;
  font-weight: 1000;
  text-align: center;
`;

export const TextSubTitle = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  color: var(--pink);
  font-size: 18px;
  width: 90%;
  max-width: 750px;
  font-weight: 500;
  text-align: center;
`;

export const TextSubTitle2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  color: var(--black);
  font-size: 18px;
  width: 90%;
  max-width: 750px;
  font-weight: 1000;
  text-align: center;
`;

export const TextSubTitle3 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  color: var(--black);
  font-size: 18px;
  font-weight: 1000;
  width: 90%;
  max-width: 750px;
  text-align: left;
`;

export const TextDescription = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--pink);
  font-size: 14px;
  font-weight: 400;
  width: 90%;
  max-width: 750px;
  text-align: center;
  line-height: 1.15;
`;

export const TextDescription2 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--yellow);
  font-size: 18px;
  width: 90%;
  max-width: 750px;
  font-weight: 1000;
`;
export const TextDescription3 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--black);
  font-size: 14px;
  font-weight: 500;
  width: 90%;
  max-width: 750px;
  line-height: 1.15;
`;

export const TextDescription4 = styled.p`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif; 
  color: var(--black);
  font-size: 14px;
  font-weight: 500;
  width: 90%;
  max-width: 750px;
  text-align: center;
  line-height: 1.15;
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
  width: 350px;
  font-size: 18px;
  font-weight: 1000;
  text-align: center;
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

export const StyledButton2 = styled.button`
  background-color: var(--pink);
  color: black;
  border: none;
  width: 400px;
  font-size: 18px;
  font-weight: 1000;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0px;
`;

export const StyledButton3 = styled.button`
  background-color: var(--blue);
  color: black;
  border: none;
  width: 350px;
  font-size: 18px;
  font-weight: 1000;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0px;
  cursor: pointer;
  :hover {
    background-color: var(--blue);
    box-shadow: 0 9px var(--purple);
  }
  :active {
    background-color: var(--blue);
    box-shadow: 0 5px var(--purple);
    transform: translateY(4px);
  }
`;

export const ButtonName = styled.div`
  font-family: Monaco, Tahoma, Arial, Helvetica, sans-serif;  
  font-size: 18px;
  font-weight: 1000;
  text-align: center;
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
  height: 260px;
  align-items: ${({ ai }) => (ai ? ai : "center")};
  background-color: var(--dirtywhite);
  margin: 10px;
  padding: 10px;
  cursor: pointer;
  :hover {
    background-color: var(--teal);
    padding: 6px;
    border: 4px solid var(--purple);
  }
`;

export const NFTSContainer2 = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 220px;
  height: 260px;
  align-items: ${({ ai }) => (ai ? ai : "center")};
  background-color: var(--dirtywhite);
  margin: 10px;
  padding: 10px;
`;

export const Slider = styled.div`
  width: 400px;
`;
