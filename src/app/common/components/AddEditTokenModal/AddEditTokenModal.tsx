import React, { useState, useEffect, useContext, useRef } from 'react';
import { connect } from 'react-redux';
import { Modal } from '@patternfly/react-core';
import { IAddEditStatus, AddEditMode } from '../../add_edit_state';
import { PollingContext, TokenContext } from '../../../home/duck/';
import AddEditTokenForm from './AddEditTokenForm';
import { ITokenFormValues, IToken } from '../../../token/duck/types';
import { IReduxState } from '../../../../reducers';
import { ICluster } from '../../../cluster/duck/types';
import { TokenActions } from '../../../token/duck/actions';
import { INameNamespaceRef } from '../../duck/types';
import { IMigMeta } from '../../../auth/duck/types';

interface IAddEditTokenModalProps {
  tokenAddEditStatus: IAddEditStatus;
  isPolling: boolean;
  preventPollingWhileOpen?: boolean;
  clusterList: ICluster[];
  tokenList: IToken[];
  updateToken: (tokenValues: ITokenFormValues) => void;
  addToken: (tokenValues: ITokenFormValues) => void;
  cancelAddEditWatch: () => void;
  resetAddEditState: () => void;
  onTokenAdded?: (tokenRef: INameNamespaceRef) => void;
  preSelectedClusterName?: string;
  migMeta: IMigMeta;
}

const AddEditTokenModal: React.FunctionComponent<IAddEditTokenModalProps> = ({
  tokenAddEditStatus,
  addToken,
  updateToken,
  clusterList,
  isPolling,
  preventPollingWhileOpen = true,
  onTokenAdded,
  preSelectedClusterName,
  migMeta,
  tokenList,
}: IAddEditTokenModalProps) => {
  const tokenContext = useContext(TokenContext);

  const [currentTokenName, setCurrentTokenName] = useState(
    tokenContext.initialTokenValues ? tokenContext.initialTokenValues.tokenName : null
  );

  const currentToken = tokenList.find((t: IToken) => {
    return t.MigToken.metadata.name === currentTokenName;
  });

  const containerRef = useRef(document.createElement('div'));
  useEffect(() => {
    // Hack to make it possible to show this modal on top of the wizard...
    containerRef.current.className = 'modal-in-modal-container';
    document.body.appendChild(containerRef.current);
    return () => {
      document.body.removeChild(containerRef.current);
    };
  }, []);

  const pollingContext = useContext(PollingContext);

  useEffect(() => {
    if (isPolling && preventPollingWhileOpen) {
      pollingContext.stopAllPolling();
      return () => pollingContext.startAllDefaultPolling();
    }
  }, []);

  const modalTitle = tokenAddEditStatus.mode === AddEditMode.Edit ? 'Edit token' : 'Add token';

  const handleAddEditSubmit = (tokenValues: ITokenFormValues) => {
    switch (tokenAddEditStatus.mode) {
      case AddEditMode.Edit: {
        updateToken(tokenValues);
        break;
      }
      case AddEditMode.Add: {
        addToken(tokenValues);
        onTokenAdded && onTokenAdded({ name: tokenValues.name, namespace: migMeta.namespace });
        // tokenContext.toggleAddEditModal();
        break;
      }
      default: {
        console.warn(
          `onAddEditSubmit, but unknown mode was found: ${tokenAddEditStatus.mode}. Ignoring.`
        );
      }
    }
  };

  const handleClose = () => {
    // NATODO cancel/reset add/edit watch/state
    tokenContext.resetAddEditState();
    tokenContext.cancelAddEditWatch();
    tokenContext.setInitialTokenValues(null);
    tokenContext.toggleAddEditModal();
    pollingContext.startAllDefaultPolling();
  };

  return (
    <Modal
      appendTo={containerRef.current}
      isSmall
      isOpen
      onClose={handleClose}
      title={modalTitle}
      className="always-scroll"
    >
      <AddEditTokenForm
        tokenAddEditStatus={tokenAddEditStatus}
        clusterList={clusterList}
        onAddEditSubmit={handleAddEditSubmit}
        initialTokenValues={tokenContext.initialTokenValues}
        handleClose={handleClose}
        preSelectedClusterName={preSelectedClusterName}
        currentToken={currentToken}
      />
    </Modal>
  );
};

const mapStateToProps = (state: IReduxState) => ({
  tokenAddEditStatus: state.token.tokenAddEditStatus,
  isPolling: state.token.isPolling,
  clusterList: state.cluster.clusterList,
  tokenList: state.token.tokenList,
  migMeta: state.auth.migMeta,
});

const mapDispatchToProps = (dispatch) => ({
  addToken: (tokenValues: ITokenFormValues) => dispatch(TokenActions.addTokenRequest(tokenValues)),
  updateToken: (tokenValues: ITokenFormValues) =>
    dispatch(TokenActions.updateTokenRequest(tokenValues)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEditTokenModal);
