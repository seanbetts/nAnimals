const initialState = {
  loading: false,
  contractAddress: "0x78b2Fe2abf89C2E60a95c906A14DEA6dcA0a5370",
  owner: "",
  mintingPaused: true,
  hatchingActive: false,
  name: "",
  totalSupply: 0,
  mintPrice: 0,
  hatchPrice: 2000000000000000000,
  maxMintSupply: 2000,
  maxMintQuantity: 10,
  userTokens: [],
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...initialState,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...initialState,
        loading: false,
        name: action.payload.name,
        contractAddress: action.payload.contractAddress,
        owner: action.payload.owner,
        mintingPaused: action.payload.mintingPaused,
        hatchingActive: action.payload.hatchingActive,
        totalSupply: action.payload.totalSupply,
        maxMintSupply: action.payload.maxMintSupply,
        maxMintQuantity: action.payload.maxMintQuantity,
        userTokens: action.payload.userTokens,
        mintPrice: action.payload.mintPrice,
        hatchPrice: action.payload.hatchPrice,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
