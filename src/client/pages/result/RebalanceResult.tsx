import * as YAML from 'json-to-pretty-yaml';

import React, { useEffect, useState } from 'react';

import { CssBaseline } from '@mui/material';
import Head from 'next/head';
import StartFlexBoxBlack from '~client/standard_components/StartFlexBoxBlack';
import { axiosGetWebSocket } from '~client/utils/axios';
import { io } from 'socket.io-client';
import stripAnsi from 'strip-ansi';
import { useRouter } from 'next/router';

const socket = io();
const stringify = (n: object) => JSON.stringify(n);

/*
  Renders the output of the rebalance command
  Listens to the websocket events for logging rebalance output to the browser
*/

const parseAnsi = (n: string) => {
  try {
    const parsed = JSON.parse(n);
    if (!!parsed.options && !!parsed.options.evaluating && !!parsed.options.evaluating.length) {
      parsed.options.evaluating = parsed.options.evaluating.map((n: string) => stripAnsi(n));
    }

    return parsed;
  } catch (e) {
    return n;
  }
};

const styles = {
  pre: {
    fontweight: 'bold',
    color: 'white',
  },
  div: {
    color: 'white',
    marginLeft: '20px',
  },
};

const RebalanceResult = () => {
  const router = useRouter();

  const [data, setData] = useState(undefined);
  const output = [];

  useEffect(() => {
    if (!!data) {
      window.scroll({
        top: document.body.offsetHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [data]);

  useEffect(() => {
    const dateString = Date.now().toString();

    const query = {
      avoid: router.query.avoid,
      in_filters: router.query.in_filters,
      in_outbound: router.query.in_outbound,
      in_through: router.query.in_through,
      max_fee: router.query.max_fee,
      max_fee_rate: router.query.max_fee_rate,
      max_rebalance: router.query.max_rebalance,
      out_filters: router.query.out_filters,
      out_inbound: router.query.out_inbound,
      out_through: router.query.out_through,
      timeout_minutes: router.query.timeout_minutes,
      node: router.query.node,
      message_id: dateString,
    };

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on(`${dateString}`, data => {
      const message = parseAnsi(stringify(data.message));

      output.push(YAML.stringify(message));

      setData(output.toString());
    });

    socket.on('error', err => {
      throw err;
    });

    const fetchData = async () => {
      const result = await axiosGetWebSocket({ path: 'rebalance', query });

      if (!!result) {
        output.push(YAML.stringify(result));
        setData(output.toString());
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Rebalance Result</title>
      </Head>
      <StartFlexBoxBlack>
        <div style={styles.div}>
          <h1>Rebalancing...</h1>
          {!!data && (
            <div id={'rebalanceResult'}>
              <pre style={styles.pre}>{data}</pre>
            </div>
          )}
        </div>
      </StartFlexBoxBlack>
    </CssBaseline>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default RebalanceResult;
