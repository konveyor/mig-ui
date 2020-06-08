import React, { useEffect } from 'react';
import { Button, Pagination, Level, LevelItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody, sortable, classNames } from '@patternfly/react-table';
import spacing from '@patternfly/react-styles/css/utilities/Spacing/spacing';
import tableStyles from '@patternfly/react-styles/css/components/Table/table';
import { usePaginationState, useSortState } from '../../../../common/duck/hooks';
import StatusIcon from '../../../../common/components/StatusIcon';
import IconWithText from '../../../../common/components/IconWithText';
import { IToken } from '../../../../token/duck/types';

interface ITokensTableProps {
  tokenList: IToken[];
  toggleAddEditModal: () => void;
}

const TokensTable: React.FunctionComponent<ITokensTableProps> = ({
  tokenList,
  toggleAddEditModal,
}: ITokensTableProps) => {
  const columns = [
    { title: 'Name', transforms: [sortable] },
    { title: 'Type', transforms: [sortable] },
    { title: 'Associated cluster', transforms: [sortable] },
    { title: 'Expiration', transforms: [sortable] },
    { title: 'Status', transforms: [sortable] },
    { title: '', columnTransforms: [classNames(tableStyles.tableAction)] },
  ];

  const getSortValues = (token: IToken) => {
    // NATODO add a getTokenInfo helper call here
    return ['', '', '', '', '', ''];
  };

  const { sortBy, onSort, sortedItems } = useSortState(tokenList, getSortValues);
  const { currentPageItems, setPageNumber, paginationProps } = usePaginationState(sortedItems, 10);
  useEffect(() => setPageNumber(1), [sortBy]);

  const rows = currentPageItems.map((token: IToken) => {
    // NATODO add a getTokenInfo helper call here
    return {
      cells: [
        '[NAME]',
        '[TYPE]',
        '[ASSOCIATED CLUSTER]',
        '[EXPIRATION]',
        {
          title: (
            <IconWithText
              icon={<StatusIcon isReady={true} /> /* NATODO pass real ready/warning state here */}
              text="[STATUS]" // NATODO real status text here
            />
          ),
        },
        '', // NATODO create a TokenActionsDropdown to render here
      ],
    };
  });

  return (
    <>
      <Level>
        <LevelItem>
          <Button id="add-token-btn" onClick={toggleAddEditModal} variant="secondary">
            Add token
          </Button>
        </LevelItem>
        <LevelItem>
          <Pagination widgetId="tokens-table-pagination-top" {...paginationProps} />
        </LevelItem>
      </Level>
      <Table
        aria-label="Tokens table"
        cells={columns}
        rows={rows}
        sortBy={sortBy}
        onSort={onSort}
        className={`${spacing.mtMd} ${spacing.mbMd}`}
      >
        <TableHeader />
        <TableBody />
      </Table>
      <Pagination
        widgetId="tokens-table-pagination-bottom"
        variant="bottom"
        className={spacing.mtMd}
        {...paginationProps}
      />
    </>
  );
};

export default TokensTable;