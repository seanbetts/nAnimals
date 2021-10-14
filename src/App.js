import React, {useEffect} from "react";
import "./App.css";
import * as s from "./styles/globalStyles";
import nEggLogo from "./images/nEggLogoTitle.png";
import discord from "./images/discord.png";
import twitter from "./images/twitter.png";

function App() {
  useEffect(() => {
    document.title = "nAnimals"
  }, []);

  return (
    <s.Screen>
      <s.Container>
        <s.SpacerLarge />
          <s.Row>
            <s.Column>
              <a href="https://discord.gg/CaC2wAxtyh" target="_blank" rel="noopener noreferrer">
              <img src={discord} height={50} width={50} alt="discord"/>
              </a>
            </s.Column>
            <s.SpacerSmall />
            <s.Column>
              <a href="https://www.twitter.com/nanimalsfun" target="_blank" rel="noopener noreferrer">
              <img src={twitter} height={50} width={50} alt="twitter"/>
              </a>
            </s.Column>
          </s.Row>
          <img src={nEggLogo} height={600} width={600} alt="nEgg Logo"/>
          <s.SpacerLarge />
          <s.TextTitle>COMING SOON!</s.TextTitle>
        </s.Container>
        <s.Container>
          <s.SpacerLarge />
          <s.TextDescription>COPYRIGHT 2021 SEAN BETTS</s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription>CONTRACT: xxxxxxxxxxxxxxx</s.TextDescription>
          <s.SpacerLarge />
        </s.Container>
    </s.Screen>
  );
}

export default App;
