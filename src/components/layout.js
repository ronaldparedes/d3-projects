import React from "react"
import { Link } from "gatsby"
import styled from "styled-components"
import Brand from "../components/brand"
import * as V from "../styles/variables"

const StyledLayout = styled.div`
  background-color: ${props => props.theme.backgroundColor || "white"};
  margin: 3rem auto;
  margin-bottom: 0;
  max-width: 650;
  padding: 0 1rem;
`
const StyledHeader = styled.header`
  display: block;
  background-color: black;
  color: white;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  border-bottom: 1px solid white;
  z-index: 999;
`
const StyledMain = styled.div`
  display: flex;
  justify-content: space-between;
`
const StyledMenu = styled.nav`
  display: flex;
`
const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0 0.5rem;
  height: 4.8rem;
  /* font-size: 1.7rem; */
  font-size: 1.2rem;

  &:focus,
  &:hover {
    color: lightblue;
  }
  &.active,
  &:focus,
  &:hover {
    color: #a1ecf7;
  }
  margin-right: 1rem;
`

const Main = styled.main`
  margin-top: ${V.Height.header};
`

const layout = ({ children, theme }) => {
  return (
    <StyledLayout theme={theme}>
      <StyledHeader>
        <StyledMain>
          <Brand />
          <StyledMenu>
            <StyledLink to="/" activeClassName="active">
              Home
            </StyledLink>
            <StyledLink to="/histogram" activeClassName="active">
              Histogram
            </StyledLink>
            <StyledLink to="/goldielocks" activeClassName="active">
              Goldielocks
            </StyledLink>
          </StyledMenu>
        </StyledMain>
      </StyledHeader>
      <Main>{children}</Main>
    </StyledLayout>
  )
}

export default layout
