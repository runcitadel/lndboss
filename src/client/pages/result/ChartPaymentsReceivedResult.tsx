import { CssBaseline, Stack } from '@mui/material';

import { ChartPaymentsReceivedOutput } from '../../output';
import Head from 'next/head';
import React from 'react';
import { StartFlexBox } from '../../standard_components';
import { axiosGet } from '~client/utils/axios';
import { useRouter } from 'next/router';

/*
  Renders the bos chart-payments-received command output in chart format.
  GET call to the  NestJs process to get Chart Payments Received data.
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginRight: '50px',
    marginTop: '50px',
    width: '700px',
  },
};

const ChartPaymentsReceivedResult = () => {
  const router = useRouter();

  const query = {
    days: router.query.days,
    nodes: router.query.nodes,
  };

  const [data, setData] = React.useState({ data: [], title: '', description: '' });

  React.useEffect(() => {
    const fetchData = async () => {
      const result = await axiosGet({ path: 'chart-payments-received', query });

      if (!!result) {
        setData(result);
      }
    };

    fetchData();
  }, []);

  return (
    <CssBaseline>
      <Head>
        <title>Chart Payments Received Result</title>
      </Head>
      <StartFlexBox>
        <Stack spacing={3} style={styles.form}>
          {!!data.data.length ? <ChartPaymentsReceivedOutput data={data} /> : null}
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ChartPaymentsReceivedResult;
