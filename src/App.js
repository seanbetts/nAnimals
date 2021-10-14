import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import nEggLogo from "./images/nEggLogoTitle.png";
import discord from "./images/discord.png";
import twitter from "./images/twitter.png";

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [loading, setLoading] = useState (false);
  const [status, setStatus] = useState ("");
  const [NFTS, setNFTs] = useState ([]);
  const ipfsBaseUrl = "https://nanimals.mypinata.cloud/ipfs/QmW7w6sgyYNfxLUKSodbAqEmoaD8LYwdRcw8tmPFh69uTF/";
  // const numberOfTokens = 1;

  function delay() {
    setTimeout(function(){ setStatus("MINT A nEGG"); }, 2000);
  }

  const mint = (_uri) => {
    setLoading(true);

    blockchain.smartContract.methods
      .mint(blockchain.account, _uri)
      .send({from: blockchain.account})
      .once("error", (err) => {
        console.log(err);
        setLoading(false);
        setStatus("ERROR - PLEASE TRY AGAIN!");
      })
      .then((receipt) => {
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        setLoading(false);
        setStatus("nEgg SUCCESSFULLY MINTED!");
        delay();
      });
  };

  const fetchMetaDataForNFTS = useCallback(() => {
    setNFTs([]);
    data.userTokens.forEach((nft) => {
      fetch(nft.uri)
      .then((response) => response.json())
      .then((metaData) => {
        setNFTs((prevState) => [
          ...prevState, 
          {id: nft.id, metaData: metaData },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }, [data.userTokens]);

  useEffect(() => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  }, [blockchain.account, blockchain.smartContract, dispatch]);

  useEffect(() => {
    fetchMetaDataForNFTS();
  }, [fetchMetaDataForNFTS, data.userTokens]);

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
