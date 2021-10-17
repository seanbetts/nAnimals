import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import Slider from 'rc-slider';
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
  var [mintNumber, setMintNumber] = useState (1);
  const [NFTS, setNFTs] = useState ([]);
  const marks= {
    1: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>1</strong>,
    },
    2: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>2</strong>,
    },
    3: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>3</strong>,
    }, 
    4: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>4</strong>,
    },
    5: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>5</strong>,
    },
    6: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>6</strong>,
    },
    7: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>7</strong>,
    },
    8: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>8</strong>,
    },
    9: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>9</strong>,
    },
    10: {
      style: {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#FF3D94',
      },
      label: <strong>10</strong>,
    }
  }

  function log(value) {
    setMintNumber(value)
  }

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
        setStatus(mintNumber + " nEGGs SUCCESSFULLY MINTED!");
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
        </s.Container>
        {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container>
            <s.TextSubTitle>TO MINT A nEGG</s.TextSubTitle>
            <s.SpacerSmall />
            <s.TextSubTitle>CONNECT TO THE POLYGON NETWORK</s.TextSubTitle>
            <s.SpacerSmall />
            <s.StyledButton
                onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                }}
            >
                CONNECT
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
            <s.TextTitle>ALL nEGGs ARE MINTED!</s.TextTitle>
            <s.SpacerSmall />
            <s.TextDescription><a target={"_blank"} rel="noopener noreferrer" href={"https://opensea.io/"}>VISIT OUR OFFICIAL COLLECTION ON OPENSEA TO BUY A nEGG</a></s.TextDescription>
            </>
          ) : (
            <>
            <s.TextTitle>{data.totalSupply}/{data.maxMintSupply} nEGGs MINTED</s.TextTitle>
          <s.SpacerLarge />
          <s.TextSubTitle>nEGGs ARE {data.mintPrice/1000000000000000000} MATIC EACH TO MINT (ex. gas fees)</s.TextSubTitle>
          <s.SpacerLarge />
          <s.TextSubTitle>YOU CAN MINT UP TO {data.maxMintQuantity} nEGGs PER WALLET</s.TextSubTitle>
          <s.SpacerSmall />
          <s.Slider>
          <Slider dots trackStyle={{backgroundColor:'#FF3D94', height:5}} handleStyle={{backgroundColor: '#FF3D94', borderColor: '#FF3D94'}} activeDotStyle={{backgroundColor: '#FF3D94'}} dotStyle={{borderColor: '#FF3D94'}} min={1} max={10} onChange={log} defaultValue={1} marks={marks} />
          </s.Slider>
          <s.SpacerLarge />
          <s.SpacerSmall />

          {data.mintingPaused === false ? (
          <s.StyledButton
            onClick={(e) => {
              e.preventDefault();
              mint(mintNumber);
            }}
          >          
          {loading ? (
            <>
            <s.TextSubTitle2>minting...</s.TextSubTitle2>
            </>
          ) : (
          status !== "" ? (
                <>
                <s.TextSubTitle2>{status}</s.TextSubTitle2>
                </>
            ) : (<s.TextSubTitle2>MINT {mintNumber} nEGGs</s.TextSubTitle2>)
          )}
          </s.StyledButton>
          ) : (
            <s.StyledButton2
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <s.TextSubTitle2>MINTING PAUSED</s.TextSubTitle2>
          </s.StyledButton2>
          )}

          <s.SpacerSmall />
          <s.TextDescription>Please make sure you are connected to the right network (Polygon Mainnet) and the correct address ({data.contractAddress}).</s.TextDescription>
          <s.SpacerXSmall />
          <s.TextDescription>Please note: Once you make the purchase, you cannot undo this action.</s.TextDescription>
          </>
          )}
          <s.SpacerMedium />
          {NFTS.length>0 &&
            <s.Container>
              <s.NFTContainerBar>
              <s.SpacerLarge />
              <s.TextTitle2>YOUR nEGG COLLECTION</s.TextTitle2>
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
          <s.TextDescription3>nANIMALs is a new generative NFT art project that will be minting exclusively on Polygon.</s.TextDescription3>
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
          <s.TextTitle2>ROADMAP</s.TextTitle2>
          <s.SpacerXSmall />
          <s.TextSubTitle3>STEP 1</s.TextSubTitle3>
          <s.TextDescription3>We will be releasing {data.maxMintSupply} nEGGs to be minted. The minting cost will be {data.mintPrice/1000000000000000000} MATIC per nEGG and there will be a maximum mint of {data.maxMintQuantity} nEGGs per wallet</s.TextDescription3>
          <s.SpacerLarge />
          <s.TextSubTitle3>STEP 2</s.TextSubTitle3>
          <s.TextDescription3>Once all {data.maxMintSupply} nEGGs have been minted the countdown will begin for the hatching of the 1st generation of nANIMALs. All current holders of nEggs will be given the <span role="img" aria-labelledby="egg">🥚</span>│OG nEGGs role and have access to new channels on the Discord server.</s.TextDescription3>
           <s.SpacerLarge />
          <s.TextSubTitle3>STEP 3</s.TextSubTitle3>
          <s.TextDescription3>Once the countdown is over it's Hatching Time! Hatching 1 nEGG will cost {data.mintPrice/1000000000000000000} MATIC and will hatch 1 nANIMAL. The nEGG will be able to be re-hatched for future generations of nANIMALs. However, watch out - 10% of nANIMALs will die on hatching! (but the nEGG will remain intact).</s.TextDescription3>
          <s.SpacerLarge />
          <s.TextSubTitle3>STEP 4</s.TextSubTitle3>
          <s.TextDescription3>When hatching begins for Generation 1, the countdown will begin for the hatching of the 2nd Generation of nANIMALs and the cycle will continue!</s.TextDescription3>
          <s.SpacerLarge />
          <s.TextSubTitle3>STEP 5</s.TextSubTitle3>
          <s.TextDescription3>Rinse and repeat!</s.TextDescription3>
          <s.SpacerLarge />
        </s.NFTContainerBar>
        <s.Container>
          <s.SpacerLarge />
          <s.TextDescription>COPYRIGHT 2021 SEAN BETTS</s.TextDescription>
          <s.SpacerSmall />
          <s.TextDescription>CONTRACT ADDRESS: {data.contractAddress}</s.TextDescription>
          <s.SpacerLarge />
        </s.Container>
    </s.Screen>
  );
}

export default App;