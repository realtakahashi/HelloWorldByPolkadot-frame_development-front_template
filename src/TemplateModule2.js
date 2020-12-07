import React, { useEffect, useState } from 'react';
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  // The transaction submission status
  const [status, setStatus] = useState('');

  // The currently stored value
  const [currentValue, setCurrentValue] = useState(0);
  const [formValue, setFormValue] = useState(0);

  const [number1, setNumber1] = useState(0);
  const [number2, setNumber2] = useState(0);

  useEffect(() => {
    let unsubscribe;
    api.query.templateModule.dataOfMine(newValue => {
      // The storage value is an Option<u32>
      // So we have to check whether it is None first
      // There is also unwrapOr
      if (newValue.isNone) {
        setNumber1('0');
        setNumber2('0');
      } else {
        setNumber1(newValue.number1.toString());
        setNumber2(newValue.number2.toString());
      }
    }).then(unsub => {
      unsubscribe = unsub;
    })
      .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api.query.templateModule]);

  return (
    <Grid.Column width={8}>
      <h1>Template Module</h1>
      <Card centered>
        <Card.Content textAlign='center'>
          <Statistic
            label='number1'
            value={number1}
          />
        </Card.Content>
      </Card>
      <Form>
        <Form.Field>
          <Input
            label='number1'
            state='number1'
            type='number'
            onChange={(_, { value }) => setNumber1(value)}
          />
        </Form.Field>
        <Form.Field>
          <Input
            label='number2'
            state='number2'
            type='number'
            onChange={(_, { value }) => setNumber2(value)}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Store Mydata'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'templateModule',
              callable: 'setMydata',
              inputParams: [{ "number1": number1, "number2": number2 }],
              paramFields: [true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}

export default function TemplateModule2 (props) {
  const { api } = useSubstrate();
  return (api.query.templateModule && api.query.templateModule.dataOfMine
    ? <Main {...props} /> : null);
}
