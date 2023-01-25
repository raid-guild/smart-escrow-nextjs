import React, { Component, createContext } from 'react';

import { SafeAppWeb3Modal as Web3Modal } from '@gnosis.pm/safe-apps-web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers } from 'ethers';
import Web3 from 'web3';

import { rpcUrls } from '../utils/constants';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      rpc: {
        4: rpcUrls[4],
        100: rpcUrls[100]
      }
    }
  }
};

let web3Modal;

export const AppContext = createContext();

class AppContextProvider extends Component {
  state = {
    //web3 needs
    account: '',
    provider: '',
    web3: '',
    chainID: '',

    //dungeon master info
    v1_id: '',
    invoice_id: null,
    raid_id: '',
    project_name: '',
    client_name: '',
    link_to_details: '',
    brief_description: '',

    //math needs
    spoils_percent: 0.1,

    //checks
    isLoading: false
  };

  setDungeonMasterContext = (data) => {
    this.setState({ ...data });
  };

  setWeb3Provider = async (prov, initialCall = false) => {
    if (prov) {
      const web3Provider = new Web3(prov);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      );
      const gotChainId = Number(prov.chainId);

      if (initialCall) {
        const signer = gotProvider.getSigner();
        const gotAccount = await signer.getAddress();
        this.setState({
          account: gotAccount,
          chainID: gotChainId,
          provider: gotProvider,
          web3: web3Provider
        });
      } else {
        this.setState({
          chainID: gotChainId,
          provider: gotProvider,
          web3: web3Provider
        });
      }
    }
  };

  connectAccount = async () => {
    try {
      this.updateLoadingState();

      web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions
      });

      const modalProvider = await web3Modal.requestProvider();

      await this.setWeb3Provider(modalProvider, true);

      const isGnosisSafe = !!modalProvider.safe;

      if (!isGnosisSafe) {
        modalProvider.on('accountsChanged', (accounts) => {
          this.setState({ account: accounts[0] });
        });
        modalProvider.on('chainChanged', async (chainID) => {
          const modalProvider = await web3Modal.requestProvider();
          await this.setWeb3Provider(modalProvider, true);
          this.setState({ chainID });
        });
      }
    } catch (web3ModalError) {
      console.log(web3ModalError);
    } finally {
      this.updateLoadingState();
    }
  };

  updateLoadingState = () => {
    this.setState({ isLoading: !this.state.isLoading });
  };

  disconnect = async () => {
    web3Modal.clearCachedProvider();
    this.setState({
      account: '',
      provider: '',
      web3: '',
      chainID: '',
      invoice_id: null,
      raid_id: '',
      project_name: '',
      client_name: '',
      link_to_details: '',
      brief_description: '',
      isLoading: false
    });
  };

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setDungeonMasterContext: this.setDungeonMasterContext,
          connectAccount: this.connectAccount,
          updateLoadingState: this.updateLoadingState,
          disconnect: this.disconnect
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContextProvider;
