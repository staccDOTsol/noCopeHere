import {FanoutClient} from "@glasseaters/hydra-sdk";
import * as anchor from '@project-serum/anchor';
import { Connection } from '@solana/web3.js'
import {NATIVE_MINT} from "@solana/spl-token";
import { FAIR_LAUNCH_PROGRAM } from "./fair-launch";
import {
  Box,
  BoxProps,
  Button,
  Center,
  Collapse,
  Icon,
  LightMode,
  Link,
  Input,
  Progress,
  Spinner,
  Stack,
  Text,
  TextProps,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useInterval,
  VStack,
  HStack
} from "@chakra-ui/react";
import { PublicKey } from "@solana/web3.js";
import {
  useCurve,
  useTokenBonding,
  useTokenMetadata,
  useCapInfo,
  usePublicKey,
} from "@strata-foundation/react";
import { getAssociatedAccountBalance } from "@strata-foundation/spl-utils";

import moment from "moment";
import React, { useState } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { BsChevronDown, BsChevronUp } from "react-icons/bs";
import { useLivePrice } from "../hooks/useLivePrice";
import { numberWithCommas } from "../utils/numberWithCommas";
import { BondingPlot } from "./BondingPlot";
import { Anchor } from "antd";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
const WRAPPED_SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112")
let first = true;
const BlackBox = ({ children, ...other }: BoxProps) => {
  return (
    <Center
      p="26px"
      rounded="lg"
      backgroundColor={useColorModeValue("gray.200", "black.500")}
      {...other}
    >
      {children}
    </Center>
  );
};

const BigText = ({ children, ...other }: TextProps) => {
  return (
    <Text fontWeight={700} fontSize="24px" {...other}>
      {children}
    </Text>
  );
};
export const LbcInfo = ({
  members, 
  staked,
  total,
  tokenBondingKey,
  useTokenOfferingCurve = false,
  price: inputPrice,
  wallet,
  onDeposit,
  min,
  fairLaunch,
  mintPublicKey,
  fanout
}: {members: number, 
  staked: number,
  total: number ,
  tokenBondingKey: PublicKey;
  useTokenOfferingCurve?: boolean;
  price?: number;
  wallet: any;
  onDeposit: any;
  min: number;
  fairLaunch: any;
  mintPublicKey: any;
  fanout: any;
}) => {
    var [shares, setShares] = useState("1.38");
    var [Pot, setPot] = useState(0);

    async function onChange(e: any){
        e.preventDefault()
        console.log(e.target.value)
        setShares(e.target.value)
        }
   
  var connection2 = new Connection('https://ssc-dao.genesysgo.net/', "confirmed");

  const { isOpen, onToggle } = useDisclosure({
    defaultIsOpen: false,
  });
  const { info: tokenBonding, loading: loadingBonding } =
    useTokenBonding(tokenBondingKey);
  const { price, loading: loadingPricing } = useLivePrice(tokenBondingKey);
  const { numRemaining, mintCap } = useCapInfo(
    tokenBondingKey,
    useTokenOfferingCurve
  );

  const priceToUse = inputPrice;

  const { info: curve } = useCurve(tokenBonding?.curve);
  

  const { metadata } = useTokenMetadata(tokenBonding?.targetMint);

  async function all(){
    if (wallet){    var fanoutSdk: FanoutClient;
      fanoutSdk = new FanoutClient(
        connection2  ,
        // @ts-ignore
        wallet
    );
  var ix3= await fanoutSdk.distributeAllInstructions(//{fanout,mint:WRAPPED_SOL_MINT,payer:wallet.publicKey})// .distributeTokenMember(
  {
  
       
    mint: new PublicKey("So11111111111111111111111111111111111111112"),
    fanout: fanout,
    payer: wallet.publicKey
  
  }
  );
  var ix4= await fanoutSdk.distributeAllInstructions(//{fanout,mint:WRAPPED_SOL_MINT,payer:wallet.publicKey})// .distributeTokenMember(
    {
    
         
      mint: mintPublicKey,
      fanout: fanout,
      payer: wallet.publicKey
    
    }
    );
    let mm = [] 
    for (var a of ix3.instructions){
      for (var b of a){
      mm.push(b)
      }
    }
    for (var a of ix4.instructions){
      for (var b of a){
        mm.push(b)
        }
          }
  await fanoutSdk.sendInstructions([...mm], [], wallet.publicKey)

}
  }
  
  async function claim(){
    if (wallet){    var fanoutSdk: FanoutClient;
      fanoutSdk = new FanoutClient(
        connection2  ,
        // @ts-ignore
        wallet
    );
  var ix3= await fanoutSdk.distributeTokenMemberInstructions(//{fanout,mint:WRAPPED_SOL_MINT,payer:wallet.publicKey})// .distributeTokenMember(
  {
  
       
    distributeForMint: false,
    fanout: fanout,
    membershipMint:mintPublicKey,
    member: wallet.publicKey,
    payer: wallet.publicKey
  
  }
  );
  
  var ix4= await fanoutSdk.distributeTokenMemberInstructions(//{fanout,mint:WRAPPED_SOL_MINT,payer:wallet.publicKey})// .distributeTokenMember(
    {
    
         
      distributeForMint: true,
      fanoutMint: mintPublicKey,
      fanout: fanout,
      membershipMint:mintPublicKey,
      member: wallet.publicKey,
      payer: wallet.publicKey
    
    }
    ); 
  await fanoutSdk.sendInstructions([...ix3.instructions, ...ix4.instructions], [], wallet.publicKey)
  }
  }
  async function doit(){
  
  if (wallet){
  
    var fanoutSdk: FanoutClient;
    fanoutSdk = new FanoutClient(
      connection2,
      // @ts-ignore
      wallet
  );

  console.log( (parseFloat(shares) * 10 ** 6))
  var  ixs = await fanoutSdk.stakeTokenMemberInstructions(
        {
            
            shares:  (parseFloat(shares) * 10 ** 6),
            // @ts-ignore
            fanout: fanout,
            membershipMint: mintPublicKey,
           // @ts-ignore
            member: wallet.publicKey,
            // @ts-ignore
            payer: wallet.publicKey
        }
    );var tx = await fanoutSdk.sendInstructions(
      ixs.instructions,
      [],
      // @ts-ignore
      wallet.publicKey
  );
  
  }
  }
  
  /*
  console.log(321)
  const { info: tokenBonding2 } = useTokenBondingFromMint(mintPublicKey);
  const { price: price2, loading: l2 } = useLivePrice(tokenBonding2?.publicKey);
  if (price2){
    if (!l2 && !isNaN(price2)){
   // console.log(price2)
    }
  }
  */
  async function us(){
  
    if (wallet){
      var fanoutSdk: FanoutClient;
      fanoutSdk = new FanoutClient(
        connection2,
        // @ts-ignore
        wallet
    );

    
    await fanoutSdk.unstakeTokenMember({
        // @ts-ignore
      fanout: fanout,
      // @ts-ignore
      member: wallet.publicKey,
      // @ts-ignore
      payer: wallet.publicKey
  }
  );
    }
  
  }
  const copeKey = usePublicKey("8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh")
  const theThing = usePublicKey("FVi71Qm78F9cjk7HBQcWPKVdje126TUPcqWUh1xP3MSF")
  const mintKey = usePublicKey("8HGyAAB1yoM1ttS7pXjHMa3dukTFGQggnFFH3hJZgzQh")
  const [balance, setBalance] = useState(0)
  if (first){
    first = false
    setTimeout(async () => {
      try {
      // @ts-ignore
  var tokenAmount = await getAssociatedAccountBalance(connection2, wallet.publicKey, mintKey)
  // @ts-ignore
  setBalance( tokenAmount.uiAmount)
  }
  catch (err){
  
  }
    setInterval(async () => {
      try {
      // @ts-ignore
  var tokenAmount = await getAssociatedAccountBalance(connection2, wallet.publicKey, mintKey)
  // @ts-ignore
  setBalance( tokenAmount.uiAmount)
  }
  catch (err){
  
  }
  try {

    const provider = new anchor.Provider(connection2, wallet, {
      preflightCommitment: 'recent',
    });
    const tokenAccountInfo = await provider.connection.getTokenAccountBalance(theThing as PublicKey)
    
  
    
    console.log(tokenAccountInfo);
    if (tokenAccountInfo){
setPot( (tokenAccountInfo).value.uiAmount as number)
    }
}
catch (err){
  console.log(err)
  console.log(err)
  console.log(err)
  console.log(err)
  console.log(err)

}
    },  2500)    },  3500)


}
  return (
    <VStack spacing={6} align="stretch">
{true &&// members && staked && total && 
<Stack>
// @ts-ignore
<Stack direction={["column", "row"]}>
      <HStack flexGrow={4}>
      <VStack flexGrow={4}>

<BigText>
 
          <BlackBox w="full" position="relative">{numberWithCommas(members, 0)} </BlackBox> Members
 </BigText>
 
</VStack>
</HStack>
</Stack> 
  <Stack direction={["column", "row"]}>
      <HStack flexGrow={4}>



<BigText>
 
 <BlackBox w="full" position="relative">{numberWithCommas(staked, 4)} Staked </BlackBox> 
 
</BigText>


<BigText>
 
 <BlackBox w="full" position="relative">{numberWithCommas(balance, 4)} </BlackBox> Your COPE
</BigText>

</HStack>
</Stack> </Stack>}
<Stack direction={["column", "row"]}>
      <VStack>
        <Button onClick={claim} >meCLAIM</Button>

        <Input  style={{color:"black", fontSize: "30px;", backgroundColor: "grey"}} type="text" onInput={onChange} value={shares} />

        <Button  onClick={doit} >STAKEme</Button>

<Button  onClick={us} >UNSTAKEALLme</Button>
<Button  onClick={all} >distributeAll</Button>
</VStack>
        </Stack>

    </VStack>
  );
};