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
  const [NFTS, setNFTs] = useState ([]);
  const ipfsBaseUrl = "https://nanimals.mypinata.cloud/ipfs/QmW7w6sgyYNfxLUKSodbAqEmoaD8LYwdRcw8tmPFh69uTF/";
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
  var numberOfTokens = 1;

  function log(value) {
    numberOfTokens = value;
  }

  useEffect(() => {
    document.title = "nAnimals 🐻🐱🐶🐰"
  }, []);

  function delay() {
    setTimeout(function(){ setStatus("MINT YOUR nEGGs"); }, 2000);
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
        </s.Container>
        {blockchain.account === "" || blockchain.smartContract === null ? (
        <s.Container>
          <s.TextSubTitle>PLEASE CONNECT YOUR METAMASK WALLET</s.TextSubTitle>
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
          <s.TextSubTitle>nEggs ARE 1 MATIC EACH TO MINT</s.TextSubTitle>
          <s.SpacerSmall />
          <s.TextSubTitle>YOU CAN MINT UP TO 10 nEggs PER WALLET</s.TextSubTitle>
          <s.SpacerSmall />
          <s.Slider>
          <Slider dots trackStyle={{backgroundColor:'#FF3D94', height:5}} handleStyle={{backgroundColor: '#FF3D94', borderColor: '#FF3D94'}} activeDotStyle={{backgroundColor: '#FF3D94'}} dotStyle={{borderColor: '#FF3D94'}} min={1} max={10} onChange={log} defaultValue={1} marks={marks} />
          </s.Slider>
          <s.SpacerLarge />
          <s.SpacerSmall />
          <s.StyledButton
            onClick={(e) => {
              e.preventDefault();
              mint(ipfsBaseUrl);
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
          ) : <s.TextSubTitle2>MINT YOUR nEGGs</s.TextSubTitle2>)}
          </s.StyledButton>
          <s.SpacerLarge />
          {NFTS.length>0 &&
            <s.Container>
              <s.TextTitle>YOUR nEggs COLLECTION</s.TextTitle>
              <s.SpacerSmall />
              <s.NFTContainerBar>
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
              </s.NFTContainerBar>
            </s.Container>
          }
        </s.Container>
        )}
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
