// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (account) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let name = await store
        .getState()
        .blockchain.smartContract.methods.name()
        .call();
      let contractAddress = await store
        .getState()
        .blockchain.smartContract.methods.contractAddress()
        .call();
      let owner = await store
        .getState()
        .blockchain.smartContract.methods.owner()
        .call();
      let mintingPaused = await store
        .getState()
        .blockchain.smartContract.methods.paused()
        .call();
      let hatchingActive = await store
        .getState()
        .blockchain.smartContract.methods.hatchingActive()
        .call();
      let userTokens = await store
        .getState()
        .blockchain.smartContract.methods.getUserTokens(account)
        .call();
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let maxMintSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxMintSupply()
        .call();
      let maxMintQuantity = await store
        .getState()
        .blockchain.smartContract.methods.maxMintQuantity()
        .call();
      let mintPrice = await store
        .getState()
        .blockchain.smartContract.methods.mintPrice()
        .call();
      let hatchPrice = await store
        .getState()
        .blockchain.smartContract.methods.hatchPrice()
        .call();

      dispatch(
        fetchDataSuccess({
          name,
          contractAddress,
          owner,
          mintingPaused,
          hatchingActive,
          userTokens,
          totalSupply,
          maxMintSupply,
          maxMintQuantity,
          mintPrice,
          hatchPrice,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
