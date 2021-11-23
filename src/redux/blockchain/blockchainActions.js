// constants
import Web3 from "web3";
import nAnimals from "../../contracts/nAnimals.json";
// log
import { fetchData } from "../data/dataActions";

const connectRequest = () => {
  return {
    type: "CONNECTION_REQUEST",
  };
};

const connectSuccess = (payload) => {
  return {
    type: "CONNECTION_SUCCESS",
    payload: payload,
  };
};

const connectFailed = (payload) => {
  return {
    type: "CONNECTION_FAILED",
    payload: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    type: "UPDATE_ACCOUNT",
    payload: payload,
  };
};

export const connect = () => {
  return async (dispatch) => {
    dispatch(connectRequest());
    const {ethereum} = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;
    if (metamaskIsInstalled) {
      let web3 = new Web3(ethereum);
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        // eslint-disable-next-line 
        if (networkId == 137) { //137 for Polygon, 80001 for Mumbai
          const SmartContractObj = new web3.eth.Contract(
            nAnimals,
            "0x78b2Fe2abf89C2E60a95c906A14DEA6dcA0a5370" //0x78b2Fe2abf89C2E60a95c906A14DEA6dcA0a5370 for Polygon, 0x7c5e23adb9c12be3bce9227ce52a42abfeecb3cd for Mumbai
          );
          dispatch(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );
          // Add listeners start
          ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]));
            window.location.reload();
          });
          ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          // Add listeners end
        } else {
          dispatch(connectFailed("Please change your wallet to the Polygon network"));
        }
      } catch (err) {
        console.log(err);
        dispatch(connectFailed("Something went wrong, please try again"));
      }
    } else {
      dispatch(connectFailed("Please install MetaMask"));
    }
  };
};

export const updateAccount = (account) => {
  return async (dispatch) => {
    dispatch(updateAccountRequest({ account: account }));
    dispatch(fetchData(account));
  };
};
