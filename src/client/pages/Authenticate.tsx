import { Alert, CssBaseline, Dialog, FormControlLabel, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardButtonLink, StandardSwitch, StartFlexBox, SubmitButton } from '../standard_components';

import Head from 'next/head';
import axios from 'axios';
import { createUseStyles } from 'react-jss';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { apiUrl } = publicRuntimeConfig;

/*
  Renders the login page that takes in the macaroon, cert, and socket.
  Sends IPC to the main process to create the credentials.
  Sends IPC to the main process to check the connection to LND.
*/

const styles = createUseStyles({
  form: {
    marginLeft: '20px',
    marginTop: '50px',
    width: '300px',
  },
  input: {
    width: '700px',
    height: '110px',
    marginBottom: '0px',
    marginTop: '0px',
  },
  inputStyle: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    '&::placeholder': {
      fontSize: '15px',
      fontWeight: 'bold',
      color: 'black',
      opacity: '0.9',
    },
  },
  h1: {
    color: 'black',
    marginTop: '50px',
  },
});

const Authenticate = () => {
  const [cert, setCert] = useState('');
  const [macaroon, setMacaroon] = useState('');
  const [nodeName, setNodeName] = useState('');
  const [socket, setSocket] = useState('');
  const [successDialog, setSuccessDialog] = useState(false);
  const [failureDialog, setFailureDialog] = useState(false);
  const [defaultNode, setDefaultNode] = useState(true);

  const classes = styles();

  const handleCertChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCert(event.target.value);
  };
  const handleMacaroonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMacaroon(event.target.value);
  };
  const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNodeName(event.target.value);
  };
  const handleSocketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSocket(event.target.value);
  };

  const toggleSwitch = () => {
    setDefaultNode((previousState: boolean) => !previousState);
  };

  const handleEvents = async () => {
    const postBody = {
      cert,
      macaroon,
      socket,
      node: nodeName,
      is_default: defaultNode,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');

      const url = `${apiUrl}/credentials`;

      const response = await axios.post(url, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        postBody,
      });

      const { connection, error, result } = await response.data;

      if (!!error) {
        setFailureDialog(true);
      }

      if (!result || !!connection.error) {
        setFailureDialog(true);
      }

      if (!!result && !!connection.hasAccess) {
        setSuccessDialog(true);
      }
    } catch (error) {
      window.alert(error);
    }
  };

  const handleSuccessClick = () => {
    setSuccessDialog(!successDialog);
  };

  const handleFailureClick = () => {
    setFailureDialog(!failureDialog);
  };

  return (
    <CssBaseline>
      <Head>
        <title>Authentication</title>
      </Head>
      <StartFlexBox>
        <StandardButtonLink label="Home" destination="/Commands" />
        <Stack spacing={1} className={classes.form}>
          <h2 className={classes.h1}>Authenticate</h2>
          <TextField
            type="text"
            placeholder="Saved Node Name"
            className={classes.input}
            id="node"
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handleNodeNameChange}
          />
          <FormControlLabel
            control={<StandardSwitch checked={defaultNode} onChange={toggleSwitch} id="default-node" />}
            label="Is Default Node?"
          />
          <TextField
            type="text"
            placeholder="TLS Cert"
            className={classes.input}
            id="cert"
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handleCertChange}
          />
          <TextField
            type="password"
            placeholder="Admin/Nospend Macaroon"
            className={classes.input}
            id="macaroon"
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handleMacaroonChange}
          />
          <TextField
            type="text"
            placeholder="Socket (host:port)"
            className={classes.inputStyle}
            id="socket"
            inputProps={{
              className: classes.inputStyle,
            }}
            onChange={handleSocketChange}
          />
          <SubmitButton
            variant="contained"
            onClick={handleEvents}
            disabled={!cert || !macaroon || !nodeName || !socket}
          >
            Authenticate
          </SubmitButton>
        </Stack>
        <Dialog open={successDialog} id="loginsuccess" onClose={handleSuccessClick}>
          <Alert severity="success" id="loginsuccess">
            Credentials saved and Authenticated to LND! 🚀
          </Alert>
        </Dialog>
        <Dialog open={failureDialog} id="loginerror" onClose={handleFailureClick}>
          <Alert severity="error" id="loginerror">
            Failed to connect to LND!
          </Alert>
        </Dialog>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default Authenticate;