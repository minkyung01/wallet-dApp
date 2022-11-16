import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import { injected } from "../util/connectors";
import constants from "../util/constants";

import LatsoTokenAbi from "../contracts/LatsoTokenAbi";

const Home = () => {
    const {
        // connector, dApp에 연결된 wallet의 connector ex. metamask-injectedConnector
        library, // web3provier가 제공하는 라이브러리
        chainId, // dApp에 연결된 account의 chainId
        account, // dApp에 연결된 account의 address
        active, // dApp과의 연결 여부
        // error,
        activate, // dApp과 연결하는 함수
        deactivate, // dApp과 연결을 해제하는 함수
    } = useWeb3React();

    const [balance, setBalance] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        library?.getBalance(account).then(r => {
            setBalance(r / 1e18);
        })
    });

    const handleConnect = () => {
        if (active && account) {
            // 이미 연결된 상태라면 연결 해제하기
            deactivate();
        } else if (window.ethereum === undefined) {
            // 메타마스크가 설치되어있지 않다면
            alert('please install metamask extension :)');
            window.open('https://metamask.io/download.html');
            return;
        } else {
            activate(injected).then();
        }
    }

    const handleTransfer = async (address) => {
        const abi = LatsoTokenAbi;
        const IContract = new ethers.Contract(address, abi);
        const data = await IContract.populateTransaction.buyLT(1);

        setIsRunning(true);
        const signer = library.getSigner();
        const signedTransaction = await signer.sendTransaction(data);

        let receipt = await signedTransaction.wait();
        console.log("receipt", receipt);
        setIsRunning(false);
    }

    const Networks = {1112: 'Wemix Testnet', 1: 'Ethereum Mainnet', 5: 'Goerli Testnet', 80001 : 'Mumbai Testnet'};
    const IdToNetworks = (key) => {
        if (Networks[key] != null) {
            return Networks[key];
        } else {
            return 'unknown';
        }
    };

    return (
        <div>
            <div style={{ display: active ? '' : 'none'}}>
                <div>
                    <p>Account: {account}</p>
                    <p>ChainId: {chainId}</p>
                    <p>Network: {IdToNetworks(chainId)}</p>
                    <p>Balance: {balance}</p>
                </div>

                <div style={{ display: chainId === 5 ? '' : 'none'}}>
                    <button
                        type={"button"}
                        onClick={() => handleTransfer(constants.CONTRACT_ADDRESS)}
                        disabled={isRunning === true}
                    >
                        buy Latso token
                    </button>
                </div>
            </div>

            <div>
                <button type={"button"} onClick={handleConnect}>{active ? 'disconnect' : 'connect'}</button>
            </div>
        </div>
    );
};

export default Home;