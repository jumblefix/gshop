import { reverseStr } from '@gshop/common';
import React, { Component } from 'react';
import { Button } from 'reakit';
import NavMenu from '../components/NavMenu/NavMenu';
import { Paragraph, SubTitle, Title } from '../components/Text/Text';

export default class About extends Component {
  render() {
    return (
      <div>
        <NavMenu />
        <Title>{reverseStr('About Us')}</Title>
        <SubTitle>{reverseStr('This is an about us page.')}</SubTitle>
        <Paragraph>Welcome to the about us page.</Paragraph>
        <Paragraph>This is an example using styled component</Paragraph>
        <Button>Button</Button>
      </div>
    );
  }
}
