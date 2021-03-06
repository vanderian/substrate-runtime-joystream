// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import uiSettings from '@polkadot/joy-settings/';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';
import { KeyedEvent } from './types';

import React, { useContext } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { ApiContext } from '@polkadot/react-api';
import Tabs from '@polkadot/react-components/Tabs';

import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import NodeInfo from './NodeInfo';
import translate from './translate';

interface Props extends AppProps, BareProps, I18nProps {
  newEvents?: KeyedEvent[];
}

function ExplorerApp ({ basePath, className, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const events = useContext(EventsContext);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            uiSettings.uiMode === 'full'
              ? api.query.babe ? [] : ['forks']
              : ['node', 'forks']
          }
          items={[
            {
              isRoot: true,
              name: 'chain',
              text: t('Chain info')
            },
            {
              hasParams: true,
              name: 'query',
              text: t('Block details')
            },
            {
              name: 'forks',
              text: t('Forks')
            },
            {
              name: 'node',
              text: t('Node info')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/forks`} component={Forks} />
        <Route path={`${basePath}/query/:value`} component={BlockInfo} />
        <Route path={`${basePath}/query`} component={BlockInfo} />
        <Route path={`${basePath}/node`} component={NodeInfo} />
        <Route render={(): React.ReactElement<{}> => (
          <Main
            events={events}
            headers={lastHeaders}
          />
        )} />
      </Switch>
    </main>
  );
}

export default translate(
  styled(ExplorerApp)`
    .rx--updated {
      background: transparent !important;
    }
  `
);
