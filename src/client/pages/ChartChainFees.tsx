import * as types from '../../shared/types';

import { Button, CssBaseline, IconButton, Stack, TextField } from '@mui/material';
import React, { useState } from 'react';
import { StandardHomeButtonLink, StartFlexBox, SubmitButton } from '../standard_components';
import commands, { globalCommands } from '../commands';

import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';
import Link from 'next/link';

const ChartChainFeesCommand = commands.find(n => n.value === 'ChartChainFees');

/*
  Renders the bos chart-chain-fees command
  Passes query parameters to the chart-chain-fees results page
*/

const styles = {
  form: {
    marginLeft: '50px',
    marginTop: '100px',
    width: '700px',
  },
  textField: {
    width: '350px',
  },
  button: {
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '10px',
    border: '1px solid black',
    marginTop: '20px',
    width: '50px',
  },
  iconButton: {
    width: '50px',
    marginTop: '0px',
  },
  h4: {
    marginTop: '0px',
  },
};

const ChartChainFees = () => {
  const [formValues, setFormValues] = useState([{ node: '' }]);
  const [days, setDays] = useState('60');

  const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDays(event.target.value);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { node: '' }]);
  };

  const removeFormFields = (i: number) => {
    const newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues);
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const flags: types.commandChartChainFees = {
    days: !!days ? Number(days) : 60,
    nodes: formValues.map(n => n.node),
  };

  return (
    <CssBaseline>
      <Head>
        <title>Chart Chain Fees</title>
      </Head>
      <StartFlexBox>
        <StandardHomeButtonLink />
        <Stack spacing={3} style={styles.form}>
          <h2>{ChartChainFeesCommand.name}</h2>
          <h4 style={styles.h4}>{ChartChainFeesCommand.longDescription}</h4>
          <TextField
            type="text"
            placeholder={`${ChartChainFeesCommand.flags.days} (Default 60)`}
            label={`${ChartChainFeesCommand.flags.days} (Default 60)`}
            id={ChartChainFeesCommand.flags.days}
            onChange={handleDaysChange}
            style={styles.textField}
          />
          <>
            <Button href="#text-buttons" onClick={() => addFormFields()} style={styles.button}>
              Add +
            </Button>
            {formValues.map((element, index) => (
              <div key={index}>
                <TextField
                  type="text"
                  label={globalCommands.node.name}
                  name={globalCommands.node.value}
                  placeholder={globalCommands.node.name}
                  value={element.node || ''}
                  onChange={e => handleChange(index, e)}
                  style={styles.textField}
                  id={`node-${index}`}
                />
                {!!index ? (
                  <IconButton aria-label="delete" onClick={() => removeFormFields(index)} style={styles.iconButton}>
                    <DeleteIcon />
                  </IconButton>
                ) : null}
              </div>
            ))}
          </>
          <SubmitButton>
            <Link href={{ pathname: '/result/ChartChainFeesResult', query: flags }}>
              <a target="_blank" style={{ color: 'white', textDecoration: 'none' }}>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Run
                Command&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </a>
            </Link>
          </SubmitButton>
        </Stack>
      </StartFlexBox>
    </CssBaseline>
  );
};

export default ChartChainFees;
