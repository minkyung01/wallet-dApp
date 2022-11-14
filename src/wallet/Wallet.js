import { useWeb3React } from "@web3-react/core";
import { injected } from "../lib/connectors";
import {useEffect, useState} from "react";

const Wallet = () => {
    const { chainId, account, library, active, activate, deactivate} = useWeb3React();
    const [balance, setBalance] = useState('');

    const handleConnect = () => {
        if (active) {
            deactivate(injected);
        } else {
            activate(injected, (error) => {
                if ('/No Ethereum provider was found on window.ethereum/') {
                    alert('please install metamask extension :)');
                    window.open('https://metamask.io/download.html');
                }
            }).then();
        }
    }

    useEffect(() => {
        library?.getBalance(account).then((result) => {
            setBalance(result/1e18)
        })
    });

    const Networks = {'1112': 'Wemix Testnet', '1': 'Ethereum Mainnet', '80001' : 'Mumbai Testnet'};
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
            </div>

            <div>
                <button type={"button"} onClick={handleConnect}>{active ? 'disconnect' : 'connect'}</button>
            </div>
        </div>
    );
}

export default Wallet;