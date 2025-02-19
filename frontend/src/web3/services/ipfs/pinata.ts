import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT as string,
  pinataGateway: process.env.NEXT_PUBLIC_PINATA_GATEWAY as string,
});

export default pinata;