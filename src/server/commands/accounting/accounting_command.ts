import * as request from 'balanceofsatoshis/commands/simple_request';
import * as types from '../../../shared/types';

import { AuthenticatedLnd } from 'lightning';
import { getAccountingReport } from 'balanceofsatoshis/balances';
import { logger } from '~server/utils/global_functions';

/** Get an accounting report

  {
    category: <Accounting Category Type String>
    [currency]: <Currency Label String>
    [fiat]: <Fiat Type String>
    [is_csv]: <Return CSV Output Bool>
    [is_fiat_disabled]: <Omit Fiat Conversion Bool>
    lnd: <Authenticated LND API Object>
    [month]: <Month for Report String>
    [node]: <Node Name String>
    [rate_provider]: <Rate Provider String>
    request: <Request Function>
    [year]: <Year for Report String>
  }

  @returns via Promise
  {
    [rows]: [[<Column String>]]
    [rows_summary]: [[<Column String>]]
  }
*/

const accountingCommand = async (args: types.commandAccounting, lnd: AuthenticatedLnd): Promise<{ result: any }> => {
  try {
    const result = await getAccountingReport({
      lnd,
      request,
      category: args.category,
      is_csv: args.is_csv,
      is_fiat_disabled: args.is_fiat_disabled,
      month: args.month,
      node: args.node,
      rate_provider: args.rate_provider,
      year: Number(args.year),
    });

    return { result };
  } catch (error) {
    logger({ error });
  }
};

export default accountingCommand;