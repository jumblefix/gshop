import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { css, styled } from 'reakit';

interface BarProps {
  open: boolean;
  position: number;
}

interface HamburgerIconProps {
  open: boolean;
}

const BarContainer = styled.div`
  display: inline-block;
  cursor: pointer;
`;

const Bar = styled.div<BarProps>`
  width: 35px;
  height: 5px;
  background-color: #fff;
  margin: 6px 0;
  transition: 0.4s;
  ${({ open, position }) =>
    open &&
    position === 1 &&
    css`
      -webkit-transform: rotate(-45deg) translate(-9px, 6px);
      transform: rotate(-45deg) translate(-9px, 6px);
    `};
  ${({ open, position }) =>
    open &&
    position === 2 &&
    css`
      opacity: 0;
    `};
  ${({ open, position }) =>
    open &&
    position === 3 &&
    css`
      -webkit-transform: rotate(45deg) translate(-8px, -8px);
      transform: rotate(45deg) translate(-8px, -8px);
    `};
`;

export default class HamburgerIcon extends PureComponent<HamburgerIconProps> {
  static propTypes = {
    open: PropTypes.bool.isRequired,
  };

  render() {
    const { open } = this.props;
    return (
      <BarContainer>
        <Bar open={open} position={1} />
        <Bar open={open} position={2} />
        <Bar open={open} position={3} />
      </BarContainer>
    );
  }
}
