import React, { Component } from 'react';
import { styled } from 'reakit';
import HamburgerIcon from '../HamburgerIcon/HamburgerIcon';

const Nav = styled.div`
  overflow: hidden;
  background-color: #333;
  @media screen and (max-width: 600px) {
    a:not(:first-child) {
      display: none;
    }
    a.icon {
      float: right;
      display: block;
    }
  }
`;

const NavLink = styled.a`
  float: left;
  display: block;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
  &:hover {
    background-color: #ddd;
    color: black;
  }
`;

const NavLinkIcon = styled.a`
  display: none;
  @media screen and (max-width: 600px) {
    .responsive {
      position: relative;
    }
    .responsive .icon {
      position: absolute;
      right: 0;
      top: 0;
    }
    .responsive a {
      float: none;
      display: block;
      text-align: left;
    }
  }
`;

export default class NavMenu extends Component {
  state = {
    open: false,
  };

  toggle = (e: any) => {
    e.preventDefault();
    this.setState({ open: !this.state.open });
  }

  render() {
    const { open } = this.state;
    return (
      <Nav className={open ? 'responsive' : ''}>
        <NavLink href="#home" className="active">
          Home
        </NavLink>
        <NavLink href="#news">News</NavLink>
        <NavLink href="#contact">Contact</NavLink>
        <NavLink href="#about">About</NavLink>
        <NavLinkIcon className="icon" onClick={this.toggle}>
          <HamburgerIcon open={open} />
        </NavLinkIcon>
      </Nav>
    );
  }
}
