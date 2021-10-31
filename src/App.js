import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import 'rc-slider/assets/index.css';
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

  useEffect(() => {
    document.title = "nAnimals 🐻🐱🐶🐰"
  }, []);

  function delay() {
    setTimeout(function(){ setStatus(""); }, 2000);
  }

  const mint = (tokenNumber) => {
    setLoading(true);

    blockchain.smartContract.methods
      .mint(tokenNumber)
      .send({
        gasLimit: (285000 * tokenNumber).toString(),
        to: data.owner,
        from: blockchain.account,
        value: blockchain.web3.utils.toWei((data.mintPrice/1000000000000000000 * tokenNumber).toString(), "ether"),
      })
      .once("error", (err) => {
        console.log(err);
        setLoading(false);
        setStatus("ERROR - TRY MINTING AGAIN!");
        delay();
      })
      .then((receipt) => {
        console.log(receipt);
        dispatch(fetchData(blockchain.account));
        setLoading(false);
        setStatus("nEGG SUCCESSFULLY HATCHED!");
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
          <s.ImageContainer>
          <img src={nEggLogo} width={400} alt="nEgg Logo"/>
          </s.ImageContainer>
          <s.SpacerLarge />
        </s.Container>
        {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container>
            <s.TextSubTitle>TO HATCH A nEGG</s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle>CONNECT TO THE POLYGON NETWORK</s.TextSubTitle>
            <s.SpacerSmall />
            <s.StyledButton
                onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                }}
            >
                <s.ButtonName>CONNECT</s.ButtonName>
          </s.StyledButton>
          <s.SpacerSmall />
          {blockchain.errorMsg !== "" ? (
            <s.TextDescription>{blockchain.errorMsg}</s.TextDescription>
          ) : null}
        </s.Container>
      ) : (
        <s.Container>
          {Number(data.totalSupply) === Number(data.maxMintSupply) ? (
            <>
            <s.TextTitle>ALL nEGGs ARE HATCHED!</s.TextTitle>
            <s.SpacerSmall />
            <s.TextDescription><a target={"_blank"} rel="noopener noreferrer" href={"https://opensea.io/"}>VISIT OUR OFFICIAL COLLECTION ON OPENSEA TO BUY A nEGG</a></s.TextDescription>
            </>
          ) : (
            <>
            <s.TextTitle>{data.totalSupply}/{data.maxMintSupply} nEGGs HATCHED</s.TextTitle>
          <s.SpacerSmall />
          <s.TextSubTitle>nEGGs ARE {data.mintPrice/1000000000000000000} MATIC EACH TO HATCH (ex. gas fees)</s.TextSubTitle>
          <s.SpacerLarge />
          <s.TextSubTitle>YOU CAN HATCH 1 nEGG AT A TIME</s.TextSubTitle>
          <s.SpacerLarge />

          {/* eslint-disable-next-line  */}
          {data.mintingPaused == false ? 
          (
          <s.StyledButton
            onClick={(e) => {
              e.preventDefault();
              mint(1);
            }}
          >          
          {loading ? (
            <>
            <s.ButtonName>hatching...</s.ButtonName>
            </>
          ) : (
          status !== "" ? (
                <>
                <s.ButtonName>{status}</s.ButtonName>
                </>
            ) : (<s.ButtonName>HATCH nEGG</s.ButtonName>)
          )}
          </s.StyledButton>
          ) : 
          (
            <s.StyledButton2
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <s.ButtonName>HATCHING PAUSED</s.ButtonName>
          </s.StyledButton2>
          )}

          <s.SpacerSmall />
          <s.TextDescription>Please make sure you are connected to the right network (Polygon Mainnet) and the correct address (0x0342a2d0Ed0Fb827B155404d2D1cF0aDb66F4c13).</s.TextDescription>
          <s.SpacerXSmall />
          <s.TextDescription>Please note: Once you make the purchase, you cannot undo this action.</s.TextDescription>
          </>
          )}
          <s.SpacerMedium />
          {NFTS.length>0 &&
            <s.Container>
              <s.NFTContainerBar>
              <s.SpacerLarge />
              <s.TextTitle2>YOUR nEGG & nANIMAL COLLECTION</s.TextTitle2>
              <s.SpacerSmall />
              <s.TextSubTitle>PLEASE SELECT ONE OF YOUR nEGGs TO HATCH!</s.TextSubTitle>
              <s.SpacerSmall />
                <s.NFTContainer>
                  {data.loading ? (
                  <>
                    <s.TextDescription2>loading...</s.TextDescription2>
                  </>
                  ) : (
                    NFTS.map((nft, index) => {
                      return(
                          <s.NFTSContainer key={index}>
                            <img 
                              alt={nft.metaData.name}
                              src={nft.metaData.image.replace('ipfs://', 'https://nanimals.mypinata.cloud/ipfs/')} 
                              width={200}
                            />
                            <s.SpacerSmall />
                            <s.TextSubTitle>{nft.metaData.name}</s.TextSubTitle>
                          </s.NFTSContainer>
                      );
                    })
                  )}
                </s.NFTContainer>
                <s.SpacerLarge />
              </s.NFTContainerBar>
            </s.Container>
          }
        </s.Container>
        )}
        <s.SpacerLarge />
        <s.NFTContainerBar>
        <s.SpacerLarge />
        <s.TextTitle2>ABOUT</s.TextTitle2>
          <s.SpacerXSmall />
          <s.TextDescription3>nANIMALs is a new generative NFT art project living on the Ethereum-compatible Polygon Proof of Stake (POS) Network.</s.TextDescription3>
          <s.SpacerSmall />
          <s.TextDescription3>Our ambition for this project is not to take ourselves too seriously and to just enjoy the space. We're looking to build a relaxed community on Discord to hang out and there will be lots of fun to be had along the way!</s.TextDescription3>
          <s.SpacerSmall />
          <s.TextDescription3>Love & hugs,</s.TextDescription3>
          <s.SpacerSmall />
          <s.TextDescription3><span role="img" aria-labelledby="panda">🐼</span>│ MOTHER</s.TextDescription3>
          <s.SpacerLarge />
        </s.NFTContainerBar>
        <s.SpacerLarge />
        <s.NFTContainerBar>
        <s.SpacerLarge />
        <s.TextTitle2>WHAT IS IT?</s.TextTitle2>
          <s.SpacerXSmall />
          <s.TextDescription3>Every nANIMAL starts off as a nEGG. On hatching from it's nEGG, each nANIMAL is autogenerated from over 50+ intial features and is completely unique.</s.TextDescription3>
          <s.SpacerXSmall />
          <s.TextDescription3>Each nEGG and nANIMAL exists as an ERC-721 token on polygon, is hosted on IPFS, with an initial mint cost of 2 MATIC for each nEGG and an initial hatching cost of 2 MATIC for each nANIMAL.</s.TextDescription3>
          <s.SpacerXSmall />
          <s.TextDescription3>Holding a nEGG/nANIMAL grants you copyright and commercial usage, as well as access to future airdrops.</s.TextDescription3>
          <s.SpacerLarge />
        </s.NFTContainerBar>
        <s.SpacerLarge />
        <s.NFTContainerBar>
        <s.SpacerLarge />
          <s.TextTitle2>ROADMAP</s.TextTitle2>
          <s.SpacerXSmall />
          <s.TextSubTitle3>STEP 1</s.TextSubTitle3>
          <s.TextDescription3>We will be releasing {data.maxMintSupply} nEGGs to be minted. The minting cost will be {data.mintPrice/1000000000000000000} MATIC per nEGG and there will be a maximum mint of {data.maxMintQuantity} nEGGs per wallet</s.TextDescription3>
          <s.SpacerLarge />
          <s.TextSubTitle3>STEP 2</s.TextSubTitle3>
          <s.TextDescription3>Once all {data.maxMintSupply} nEGGs have been minted, the countdown will begin for the hatching of the 1st generation of nANIMALs. All original minters of nEggs will be given the "<span role="img" aria-labelledby="egg">🥚</span>│OG nEGG" role and have exclusive access to new channels on the Discord server.</s.TextDescription3>
           <s.SpacerLarge />
          <s.TextSubTitle3>STEP 3</s.TextSubTitle3>
          <s.TextDescription3>Once the countdown is over it's Hatching Time! Hatching 1 nEGG will cost {data.mintPrice/1000000000000000000} MATIC and will hatch 1 nANIMAL.</s.TextDescription3>
          <s.SpacerXSmall />
          <s.TextDescription3>Every nANIMAL holder will be given the "<span role="img" aria-labelledby="berar">🐻</span>│nANIMAL" role and have access to new channels on the Discord server. Every generation of nANIMALs will have their own exclusive role and collection of channels on Discord that only owners of that generation will have access to.</s.TextDescription3>
          <s.SpacerXSmall />
          <s.TextDescription3>Each nEGG will be able to be re-hatched for future generations of nANIMALs. However, watch out - 5% of nANIMALs will die on hatching! (but the original nEGG will remain intact).</s.TextDescription3>
          <s.SpacerLarge />
          <s.TextSubTitle3>STEP 4</s.TextSubTitle3>
          <s.TextDescription3>When hatching ends for Generation 1, the countdown will begin for the hatching of the 2nd Generation of nANIMALs and the cycle will continue!</s.TextDescription3>
          <s.SpacerLarge />
        </s.NFTContainerBar>
        <s.Container>
          <s.SpacerLarge />
          <s.TextDescription>COPYRIGHT 2021 SEAN BETTS</s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription>CONTRACT ADDRESS: 0x0342a2d0Ed0Fb827B155404d2D1cF0aDb66F4c13</s.TextDescription>
          <s.SpacerLarge />
        </s.Container>
    </s.Screen>
  );
}

export default App;
